export type ViewMode = 'asset' | 'class';
export type TimePeriod = '7d' | '15d' | '30d';

export interface PieChartData {
    name: string;
    value: number;
    [key: string]: string | number;
}
