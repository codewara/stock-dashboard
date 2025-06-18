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

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
