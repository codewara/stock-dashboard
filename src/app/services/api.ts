import axios from 'axios';
import { ChartData } from 'chart.js';
import { DataType, ApiResponse } from '@/app/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export const fetchData = async (): Promise<DataType> => {
    try {
        const response = await api.get<ApiResponse<DataType>>('/api/stock-data');
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || 'API returned unsuccessful response');
    } catch {
        // fallback mock
        return {
            stocks: [],
            charts: { labels: [], datasets: [] },
            lastUpdated: new Date().toISOString(),
        };
    }
};

export const fetchChart = async (period: 'daily' | 'monthly' | 'annually', stock: string): Promise<ChartData> => {
    try {
        const response = await api.get<ApiResponse<DataType>>('/api/stock-chart', { params: { period, stock } });
        if (response.data.success) return response.data.data.charts;
        else throw new Error(response.data.message || 'API returned unsuccessful response');
    } catch { return { labels: [], datasets: [] } }
};

export interface NewsItem {
  judul: string;
  ringkasan: string;
  isi: string;
  tanggal: string;
}

export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await api.get<{ success: boolean; data: NewsItem[] }>(
      '/api/news'
    );
    if (response.data.success) return response.data.data;
    else throw new Error('API returned unsuccessful response');
  } catch {
    return [];
  }
};