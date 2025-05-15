import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { levelUpConsumerRank } from '@/actions/rank';
import { rebateConsumerPoints } from '@/actions/purchase';

function extractStoreName(text: string): string {
  return text.split('\n')[0]?.trim();
}

function extractAmount(text: string): number {
  const match = text.match(/(?:Total|Amount Due|Grand Total)[^\d]*([\d,]+\.\d{2})/i);
  return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
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
    console.log('Store Name:', storeName);
    console.log('Amount Spent:', amountSpent);
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('*')
      .ilike('name', storeName)
      .single();

    if (merchantError || !merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Optional: Store in loyalty_points table here

    await rebateConsumerPoints(user!.id, amountSpent);
    await levelUpConsumerRank(user!.id);

    return NextResponse.json({
      success: true,
      points: Math.floor(amountSpent / 100),
    });
  } catch (e) {
    console.error('Error processing OCR text:', e);
    return NextResponse.json({ error: 'Failed to process receipt text' }, { status: 500 });
  }
}
