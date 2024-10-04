export interface ExpensesByCategory {
    food: number;
    transport: number;
    utilities: number;
}

export interface Day {
    id: string;
    date: Date;
    revenue: number;
    expenses: number;
    kpiId: string;
}

export interface Month {
    id: string;
    date: Date;
    revenue: number;
    expenses: number;
    operationalExpenses: number;
    nonOperationalExpenses: number;
    kpiId: string;
}

export interface GetKpisResponse {
    id: string;
    totalProfit: number;
    totalRevenue: number;
    totalExpenses: number;
    expensesByCategory: ExpensesByCategory;
    dailyData: Array<Day>;
    monthlyData: Array<Month>;
    userId: string;
}