'use client';
import { useEffect, useState } from 'react';
import { ChartData } from 'chart.js';
import { fetchChart, fetchData, fetchFinancialSummary } from '@/app/services/api';
import { DataType, FinancialSummary } from '@/app/types';

export const useData = () => {
    const [data, setData] = useState<DataType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const result = await fetchData();
                setData(result);
            } catch { setError('Failed to fetch data') }
            finally { setLoading(false) }
        };
        getData();
    }, []);

    return { data, loading, error };
};

export const useChart = (period: 'daily' | 'monthly' | 'annually', stock: string) => {
    const [chart, setChart] = useState<ChartData>({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);    useEffect(() => {
        const getData = async () => {
            try {
                const result = await fetchChart(period, stock);
                setChart(result);
            } catch { setError('Failed to fetch data') }
            finally { setLoading(false) }
        };
        getData();
    }, [period, stock]);

    return { chart, loading, error };
};

export const useFinancialSummary = (year: string, stock: string) => {
    const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const result = await fetchFinancialSummary(year, stock);
                setFinancialSummary(result);
            } catch { 
                setError('Failed to fetch financial summary') 
            } finally { 
                setLoading(false) 
            }
        };
        getData();
    }, [year, stock]);

    return { financialSummary, loading, error };
};
