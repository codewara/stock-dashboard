'use client';
import React, { useState, useEffect } from 'react';
import { ChartDataset } from 'chart.js';
import { useChart, useData, useFinancialSummary } from '@/app/hooks';
import Chart from '@/app/components/chart';
import { fetchNews, NewsItem } from '@/app/services/api';

// Mock news data for demonstration (replace with actual data)
const mockNews = [
  { id: 1, title: "AALI Reports Record Revenue in Q1", date: "2024-06-01" },
  { id: 2, title: "Palm Oil Prices Surge, Boosting AALI", date: "2024-05-28" },
  { id: 3, title: "AALI Expands Sustainable Farming Initiatives", date: "2024-05-20" }
];

const Dashboard = () => {
  // Mock data for demonstration (replace with actual data)
  const mockFinanceData = {
    revenue: "Rp 2.5T",
    grossProfit: "Rp 1.2T",
    symbol: "AALI.JK",
    lastUpdated: new Date().toISOString()
  };
  
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'annually'>('daily');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const { chart, loading: chartLoading } = useChart(period, mockFinanceData.symbol);
  const { data, loading, error } = useData();
  const { financialSummary, loading: financialLoading } = useFinancialSummary(selectedYear, mockFinanceData.symbol.replace('.JK', ''));
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await fetchNews();
        setNews(data);
      } catch {
        setNewsError('Failed to fetch news');
      } finally {
        setNewsLoading(false);
      }
    };
    getNews();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
      <div className="w-[100px] h-[100px] border-12 border-slate-200 dark:border-slate-700 border-t-indigo-500 dark:border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p>Loading dashboard...</p>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="bg-red-100 text-red-700 p-8 rounded-xl text-center border border-red-200">
        <h3 className="mb-2 text-xl font-semibold">⚠️ Error Loading Data</h3>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 min-h-screen space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-700 text-white p-6 lg:p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          {mockFinanceData.symbol}
        </h1>
        <div className="text-sm lg:text-base opacity-90 font-light">
          Last Updated: {new Date(mockFinanceData.lastUpdated).toLocaleString('id-ID')}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Financial Chart - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b-2 border-slate-200 dark:border-gray-700 gap-4 sm:gap-0">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Financial Overview
            </h3>
            <select 
              name="period" 
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'daily' | 'monthly' | 'annually')}
              className="px-4 py-2 border-2 border-slate-300 dark:border-slate-500 rounded-lg bg-gray-100 dark:bg-gray-700 font-medium cursor-pointer transition-all duration-200 w-full sm:w-auto">
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
          <div className="h-64 lg:h-80 relative">
            {chart ? (
              <Chart labels={chart.labels as string[]} datasets={chart.datasets as ChartDataset<"line", number[]>[]} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  {chartLoading ? "Loading..." : "No chart data available"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b-2 border-slate-200 dark:border-gray-700 gap-4 sm:gap-0">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Financial Summary
            </h3>
            <select 
              name="year" 
              id="year" 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border-2 border-slate-300 dark:border-slate-500 rounded-lg bg-gray-100 dark:bg-gray-700 font-medium cursor-pointer transition-all duration-200 w-full sm:w-auto">
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {financialLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading financial data...</p>
              </div>
            ) : financialSummary ? (
              <>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-l-4 border-blue-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Revenue</label>
                  <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">
                    Rp {financialSummary.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-l-4 border-green-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Gross Profit</label>
                  <span className="font-bold text-green-700 dark:text-green-300 text-sm">
                    Rp {financialSummary.grossProfit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border-l-4 border-purple-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Operating Profit</label>
                  <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">
                    Rp {financialSummary.operatingProfit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border-l-4 border-orange-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Net Profit</label>
                  <span className="font-bold text-orange-700 dark:text-orange-300 text-sm">
                    Rp {financialSummary.netProfit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg border-l-4 border-teal-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Cash</label>
                  <span className="font-bold text-teal-700 dark:text-teal-300 text-sm">
                    Rp {financialSummary.cash.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg border-l-4 border-pink-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Total Assets</label>
                  <span className="font-bold text-pink-700 dark:text-pink-300 text-sm">
                    Rp {financialSummary.totalAssets.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border-l-4 border-yellow-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Short Term Borrowing</label>
                  <span className="font-bold text-yellow-700 dark:text-yellow-300 text-sm">
                    Rp {financialSummary.shortTermBorrowing.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border-l-4 border-red-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Long Term Borrowing</label>
                  <span className="font-bold text-red-700 dark:text-red-300 text-sm">
                    Rp {financialSummary.longTermBorrowing.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg border-l-4 border-indigo-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Total Equity</label>
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 text-sm">
                    Rp {financialSummary.totalEquity.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border-l-4 border-emerald-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Cash from Operating</label>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                    Rp {financialSummary.cashFromOperating.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border-l-4 border-violet-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Cash from Investing</label>
                  <span className="font-bold text-violet-700 dark:text-violet-300 text-sm">
                    Rp {financialSummary.cashFromInvesting.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border-l-4 border-cyan-500">
                  <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Cash from Financing</label>
                  <span className="font-bold text-cyan-700 dark:text-cyan-300 text-sm">
                    Rp {financialSummary.cashFromFinancing.toLocaleString()}
                  </span>
                </div>
                <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Data for {financialSummary.emitten} - {financialSummary.year} ({financialSummary.period})
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No financial data available for {selectedYear}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* News Detail - Takes 2 columns on lg screens */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-slate-200 dark:border-gray-700">
            Detail News
          </h3>
          {selectedNews ? (
            <div className="space-y-4">
              <div className="font-bold text-xl lg:text-2xl text-gray-800 dark:text-gray-200">
                {selectedNews.judul}
              </div>
              {selectedNews.isi !== selectedNews.ringkasan && (
                <div className="text-gray-700 dark:text-gray-300 pb-4 border-b border-slate-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Summary:</div>
                  {selectedNews.ringkasan}
                </div>
              )}
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedNews.isi}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-gray-500">Pilih berita dari News List untuk melihat detail.</p>
            </div>
          )}
        </div>

        {/* News List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-slate-200 dark:border-gray-700">
            News List
          </h3>
          {newsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading news...</p>
            </div>
          ) : newsError ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-red-500">{newsError}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No news available.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {news.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedNews(item)} 
                  className={`p-4 rounded-lg transition-all duration-200 cursor-pointer border-2 ${
                    selectedNews?.judul === item.judul 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-600' 
                      : 'bg-slate-50 dark:bg-gray-800 border-transparent hover:bg-slate-100 dark:hover:bg-gray-700 hover:border-slate-200 dark:hover:border-gray-600'
                  } hover:transform hover:-translate-y-1 hover:shadow-md`}
                >
                  <div className="font-medium text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                    {item.judul}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.tanggal}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
            {/* Stock Market Cards */}
      {data && (
        <div className="space-y-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 text-center">
            Stock Market Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {data.stocks.map((stock) => (
              <div key={stock.symbol} className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-gray-700 transition-all duration-300 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-indigo-400 before:to-purple-500 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {stock.symbol}
                  </h3>
                  <div className={`flex text-lg font-bold w-10 h-10 rounded-full items-center justify-center text-white ${
                      stock.change >= 0 ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'
                  }`}>
                    {stock.change >= 0 ? '↗' : '↘'}
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">
                    Rp{stock.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm lg:text-base">
                  <div className={`font-semibold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2).toLocaleString()} ({stock.changePercent.toFixed(2).toLocaleString()}%)
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Vol: {stock.volume.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;