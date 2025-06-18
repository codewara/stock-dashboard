import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const rawData = await db.collection('yfinance').aggregate([{
      $group: {
        _id: "$ticker",
        ticker: { $first: "$ticker" },
        Open: { $first: "$Open" },
        Close: { $last: "$Close" },
        Volume: { $sum: "$Volume" },
        Date: { $last: "$Date" }
      }
    }]).toArray();

    const stocks = rawData.map((doc) => ({
      symbol: doc.ticker,
      price: doc.Close,
      change: doc.Close - doc.Open,
      changePercent: doc.Open ? ((doc.Close - doc.Open) / doc.Open) * 100 : 0,
      volume: doc.Volume,
      timestamp: doc.Date?.toISOString?.() || new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        stocks,
        charts: { labels: [], datasets: [] }, // Optional: add if chart data exists
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[MongoDB API Error]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch data from MongoDB',
      },
      { status: 500 }
    );
  }
}