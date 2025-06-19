export interface StockData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    timestamp: string;
}

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
    }[];
}

export interface DataType {
    stocks: StockData[];
    charts: ChartData;
    lastUpdated: string;
}

export interface FinancialSummary {
    emitten: string;
    year: number;
    period: string;
    revenue: number;
    grossProfit: number;
    operatingProfit: number;
    netProfit: number;
    cash: number;
    totalAssets: number;
    shortTermBorrowing: number;
    longTermBorrowing: number;
    totalEquity: number;
    cashFromOperating: number;
    cashFromInvesting: number;
    cashFromFinancing: number;
    currency: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
