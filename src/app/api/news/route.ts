import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('T3');
    const berita = await db.collection('BERITA_IQPLUS')
      .find({}, { projection: { _id: 0, judul: 1, ringkasan: 1, isi: 1, tanggal: 1} })
      .sort({ _id: -1 })
      .limit(20)
      .toArray();
    return NextResponse.json({ success: true, data: berita });
  } catch (error) {
    console.error('[MongoDB News API Error]', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch news' }, { status: 500 });
  }
}
