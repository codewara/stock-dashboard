import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const PERIOD_COLLECTIONS: Record<string, string> = {
  daily: 'yfinance_d',
  monthly: 'yfinance_m',
  annually: 'yfinance_y',
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const period = url.searchParams.get('period') || 'daily';
    const stock = url.searchParams.get('stock');
    const collectionName = PERIOD_COLLECTIONS[period] || PERIOD_COLLECTIONS.daily;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Chart data aggregation (example: revenue by month)
    const chartRaw = await db.collection(collectionName).aggregate([
      { $match: { ticker: stock } },
      {
        $group: {
          _id: period === 'daily' ? { date: "$Date" } :
                period === 'monthly' ? { year: "$Year", month: "$Month" } :
                period === 'annually' ? { year: "$Year" } : null,
          value: { $sum: "$Close" }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    const chartLabels = chartRaw.map(item => item._id ?
      period === 'daily' ? item._id.date.toISOString().split('T')[0] :
      period === 'monthly' ? `${item._id.year}-${String(item._id.month).padStart(2, '0')}` :
      period === 'annually' ? String(item._id.year) :
    '' : '');
    const chartData = chartRaw.map(item => item.value);

    // Stock summary (as before, from daily collection)
    const stocksRaw = await db.collection(collectionName).aggregate([
      { $match: { ticker: stock } },      
      {
        $group: {
          _id: "$ticker",
          ticker: { $first: "$ticker" },
          Open: { $first: "$Open" },
          Close: { $last: "$Close" },
          Volume: { $sum: "$Volume" },
          Date: { $last: "$Date" }
        }
      }
    ]).toArray();
    
    const stocks = stocksRaw.map((doc) => ({
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
        charts: {
          labels: chartLabels,
          datasets: [
            {
              label: 'Close',
              data: chartData,
              fill: true,
              backgroundColor: 'rgba(0,123,255,0.1)',
              borderColor: '#007bff',
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#007bff',
            }
          ]
        },
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