import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('T3');
    const berita = await db.collection('iqplus_news')
      .find({}, { projection: { _id: 0, ticker: 1, title: 1, content: 1, summary: 1, date:1} })
      .sort({ _id: -1 })
      .limit(20)
      .toArray();
    return NextResponse.json({ success: true, data: berita });
  } catch (error) {
    console.error('[MongoDB News API Error]', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch news' }, { status: 500 });
  }
}
