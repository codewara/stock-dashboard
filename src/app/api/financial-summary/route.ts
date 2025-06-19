import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const YEAR_COLLECTIONS: Record<string, string> = {
  '2021': 'idx_2021',
  '2022': 'idx_2022',
  '2023': 'idx_2023',
  '2024': 'idx_2024',
  '2025-q1': 'idx_2025_q1',
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const year = url.searchParams.get('year') || '2025-q1';
    const stock = url.searchParams.get('stock') || 'AALI';
    const collectionName = YEAR_COLLECTIONS[year] || YEAR_COLLECTIONS['2025-q1'];

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Get financial data for specific stock and year
    const financialData = await db.collection(collectionName).findOne({
      emitten: stock
    });

    if (!financialData) {
      return NextResponse.json({
        success: false,
        message: 'Financial data not found for the specified stock and year',
      }, { status: 404 });
    }

    // Transform data to match our interface
    const summary = {
      emitten: financialData.emitten,
      year: financialData.year,
      period: financialData.period,
      revenue: financialData.Revenue || 0,
      grossProfit: financialData.GrossProfit || 0,
      operatingProfit: financialData.OperatingProfit || 0,
      netProfit: financialData.NetProfit || 0,
      cash: financialData.Cash || 0,
      totalAssets: financialData.TotalAssets || 0,
      shortTermBorrowing: financialData.ShortTermBorrowing || 0,
      longTermBorrowing: financialData.LongTermBorrowing || 0,
      totalEquity: financialData.TotalEquity || 0,
      cashFromOperating: financialData.CashFromOperatin || 0,
      cashFromInvesting: financialData.CashFromInvesting || 0,
      cashFromFinancing: financialData.CashFromFinancing || 0,
      currency: financialData.Currency || 'IDR',
    };

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('[MongoDB Financial Summary API Error]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch financial summary from MongoDB',
      },
      { status: 500 }
    );
  }
}
