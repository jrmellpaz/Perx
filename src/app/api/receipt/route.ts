import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { levelUpConsumerRank } from '@/actions/rank';
import { updateRewardPoints } from '@/actions/purchase';

function extractStoreName(text: string): string {
  return text.split('\n')[0]?.trim();
}

function extractAmount(text: string): number {
  const match = text.match(/(?:Total|Amount Due|Grand Total|Sub-Total|Subtotal)[^\d]*([\d,]+\.\d{2})/i);
  return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
}

function extractReceiptNumber(text: string): string | null {
  const regex = /(?:OR|Invoice|Inv#?|Sales Invoice|Receipt)\s*(?:No\.?|#|Number)?\s*[:\-]?\s*([\w\-\.\/]+)/ig;
  const matches = [];
  let match;  while ((match = regex.exec(text)) !== null) {
    console.log('Found match:', match[1]);
    matches.push(match[1].trim());
  }
  // Return the first match that contains at least one number, or null if none found
  return matches.find(match => /\d/.test(match)) || null;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const { user_id, text } = await req.json();

    const storeName = extractStoreName(text);
    const amountSpent = extractAmount(text);
    const receiptNumber = extractReceiptNumber(text);

    if (!receiptNumber) {
      return NextResponse.json({ error: 'Receipt number not found' }, { status: 400 });
    }

    console.log('Store Name:', storeName);
    console.log('Amount Spent:', amountSpent);
    console.log('Receipt Number:', receiptNumber);

    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('*')
      .ilike('name', storeName)
      .single();

    if (merchantError || !merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Check if receipt number already exists for this user
    const { data: existingReceipt, error: checkError } = await supabase
      .from('receipts')
      .select('*')
      .eq('user_id', user!.id)
      .eq('merchant_id', merchant.id)
      .eq('receipt_number', receiptNumber)
      .single();

    if (existingReceipt) {
      return NextResponse.json({ error: 'Duplicate receipt number' }, { status: 409 });
    }

    // Insert receipt record
    const { error: insertError } = await supabase.from('receipts').insert([
      {
        consumer_id: user!.id,
        receipt_number: receiptNumber,
        merchant_id: merchant.id,
        amount_paid: amountSpent,
      },
    ]);

    if (insertError) {
      return NextResponse.json({ error: 'Failed to store receipt' }, { status: 500 });
    }

    await updateRewardPoints(user!.id, 1);
    await levelUpConsumerRank(user!.id);

    return NextResponse.json({
      success: true,
      points: Math.floor(amountSpent / 100),
      receiptNumber,
    });
  } catch (e) {
    console.error('Error processing OCR text:', e);
    return NextResponse.json({ error: 'Failed to process receipt text' }, { status: 500 });
  }
}
