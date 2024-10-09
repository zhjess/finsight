export interface ExpensesByCategory {
    category1: number;
    category2: number;
}

export interface Day {
    id: string;
    createdAt: string;
    updatedAt: string;
    date: Date;
    revenue: number;
    expenses: number;
    kpiId: string;
}

export interface Month {
    id: string;
    createdAt: string;
    updatedAt: string;
    date: Date;
    revenue: number;
    expenses: number;
    operationalExpenses: number;
    nonOperationalExpenses: number;
    kpiId: string;
}

export interface GetKpisResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    totalProfit: number;
    totalRevenue: number;
    totalExpenses: number;
    expensesByCategory: ExpensesByCategory;
    dailyData: Array<Day>;
    monthlyData: Array<Month>;
    userId: string;
}

export interface User {
    id: string;
    email: string;
    password: string;
    transactions: Array<Transaction>;
    kpis: Array<string>;
}

export interface TransactionProduct {
    id: string;
    createdAt: string;
    updatedAt: string;
    transactionId: string;
    productId: string;
    quantity: number;
}

export interface Transaction {
    id: string;
    createdAt: string;
    updatedAt: string;
    amount: number;
    transactionProducts: Array<TransactionProduct>;
    customer: string;
    userId: string;
    user: User;
}

export interface GetProductsResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    price: number;
    expense: number;
    transactions: Array<Transaction>;
}

export interface GetTransactionsResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    transactionProducts: Array<TransactionProduct>;
    customer: string;
    userId: string;
}