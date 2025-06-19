'use client';
import React, { useState, useEffect } from 'react';
import { ChartDataset } from 'chart.js';
import { useChart, useData } from '@/app/hooks';
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
  const { chart, loading: chartLoading } = useChart(period, mockFinanceData.symbol);
  const { data, loading, error } = useData();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

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
    <div className="max-w-[1400px] mx-auto p-8 min-h-screen">
      {/* header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-700 text-white p-8 rounded-2xl mb-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-2">
          { mockFinanceData.symbol }
        </h1>
        <div className="text-base opacity-90 font-light mb-4">
          Last Updated: { new Date(mockFinanceData.lastUpdated).toLocaleString('id-ID') }
        </div>
      </div>

      {/* content grid */}
      <div className="grid grid-cols-[2fr_1fr] grid-rows-[auto_auto] gap-6 mb-12">
        {/* main chart */}
        <div className="col-start-1 row-start-1 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Financial Overview
            </h3>
            <select name="period" id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'daily' | 'monthly' | 'annually')}
              className="px-4 py-2 border-2 border-slate-300 dark:border-slate-500 rounded-lg bg-gray-100 dark:bg-gray-700 font-medium cursor-pointer transition-all duration-200">
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
          <div className="h-fit relative">
            {chart ? (
              <Chart labels={ chart.labels as string[] } datasets={ chart.datasets as ChartDataset<"line", number[]>[] } />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 dark:text-gray-400">
                  { chartLoading ? "Loading..." : "No chart data available" }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* financial summary */}
        <div className="col-start-2 row-start-1 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Financial Summary
              </h3>
              <select name="summary" id="summary" className="px-4 py-2 border-2 border-slate-300 dark:border-slate-500 rounded-lg bg-gray-100 dark:bg-gray-700 font-medium cursor-pointer transition-all duration-200">
                <option value="q1">Q1</option>
                <option value="q2">Q2</option>
                <option value="q3">Q3</option>
                <option value="q4">Q4</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            <div className="space-y-8">
                <div className="flex justify-between items-center mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border-indigo-500 border-l-4">
                  <label className="text-gray-600 dark:text-gray-300">
                    Revenue
                  </label>
                  <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
                    { mockFinanceData.revenue }
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border-indigo-500 border-l-4">
                  <label className="text-gray-600 dark:text-gray-300">
                    Gross Profit
                  </label>
                  <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
                    { mockFinanceData.grossProfit }
                  </span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-gray-700 my-6"></div>
                <div className="text-gray-500 text-sm leading-6">
                  Financial performance indicators and key metrics for investment analysis.
                </div>
            </div>
        </div>

        {/* news section */}
        <div className="col-start-1 row-start-2 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-slate-200 dark:border-gray-700">
            Latest News
          </h3>
          {newsLoading ? (
            <div className="text-gray-500">Loading news...</div>
          ) : newsError ? (
            <div className="text-red-500">{newsError}</div>
          ) : news.length === 0 ? (
            <div className="text-gray-500">No news available.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {news.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-gray-800 rounded-lg mb-2">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{item.judul}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">{item.ringkasan}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* news list */}
        <div className="col-start-2 row-start-2 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-slate-200 dark:border-gray-700">
            News List
          </h3>
          <div className="flex flex-col gap-3">
            {mockNews.map((news) => (
              <div key={ news.id } className="flex justify-between items-center p-3 bg-slate-50 dark:bg-gray-800 rounded-lg transition-all duration-200 cursor-pointer hover:bg-slate-150 dark:hover:bg-gray-700 hover:transform hover:-translate-y-1">
                <span className="font-medium text-gray-800 dark:text-gray-200 flex-1">
                  { news.title }
                </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  { news.date }
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* stock grid */}
      {data && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
            Portfolio Overview
          </h2>
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
              {data.stocks.map((stock) => (
                <div key={ stock.symbol } className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-gray-700 transition-all duration-300 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-indigo-400 before:to-purple-500 hover:-translate-y-1 hover:shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      { stock.symbol }
                    </h3>
                    <div className={`flex text-lg font-bold w-10 h-10 rounded-full items-center justify-center text-white ${
                        stock.change >= 0 ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'
                    }`}>
                      { stock.change >= 0 ? '↗' : '↘' }
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                      Rp{ stock.price.toLocaleString() }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className={`font-semibold text-lg ${ stock.change >= 0 ? 'text-green-500' : 'text-red-500' }`}>
                      { stock.change >= 0 ? '+' : '' }{ stock.change.toFixed(2).toLocaleString() } ({ stock.changePercent.toFixed(2).toLocaleString() }%)
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Vol: { stock.volume.toLocaleString() }
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