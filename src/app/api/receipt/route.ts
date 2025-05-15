import { createClient } from '@/utils/supabase/server';
import vision from '@google-cloud/vision';
import formidable from 'formidable';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextResponse } from 'next/server';

// Disable Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to parse multipart form
function parseForm(req: Request): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: os.tmpdir(),
      keepExtensions: true,
    });

    // `req` in App Router is a ReadableStream, convert it
    const chunks: Uint8Array[] = [];
    const reader = req.body?.getReader();
    if (!reader) return reject(new Error("No body"));

    (async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const buffer = Buffer.concat(chunks);
      form.parse(BufferToReq(buffer, req.headers), (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    })();
  });
}

// Convert buffer to a mock IncomingMessage
function BufferToReq(buffer: Buffer, headers: Headers) {
  const stream = require('stream');
  const req = new stream.PassThrough();
  req.end(buffer);

  req.headers = {
    'content-length': buffer.length.toString(),
    'content-type': headers.get('content-type') || '',
  };

  return req;
}


// Google Vision
const visionClient = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON || '{}'),
});

function extractStoreName(text: string): string {
  return text.split('\n')[0]?.trim();
}

function extractAmount(text: string): number {
  const match = text.match(/(?:Total|Amount Due|Grand Total)[^\d]*([\d,]+\.\d{2})/i);
  return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
}

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const { fields, files } = await parseForm(req);

    const file = files.receipt as formidable.File | formidable.File[];
    const filePath = Array.isArray(file) ? file[0].filepath : file?.filepath;

    if (!filePath) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    // OCR
    const [result] = await visionClient.textDetection(filePath);
    const text = result.fullTextAnnotation?.text || '';

    const storeName = extractStoreName(text);
    const amountSpent = extractAmount(text);

    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('*')
      .eq('store_name', storeName)
      .single();

    if (merchantError || !merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // const { error: insertError } = await supabase
    //   .from('loyalty_points')
    //   .insert({
    //     user_id: fields.user_id?.toString(),
    //     merchant_id: merchant.id,
    //     points_granted: Math.floor(amountSpent / 100),
    //     receipt_text: text,
    //   });

    // if (insertError) throw insertError;

    return NextResponse.json({ success: true, points: Math.floor(amountSpent / 100) });
  } catch (e) {
    console.error('Error processing receipt:', e);
    return NextResponse.json({ error: 'OCR failed' }, { status: 500 });
  }
}
