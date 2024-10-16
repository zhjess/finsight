export interface ExpensesByCategory {
    supplies: number;
    salaries: number;
    services: number;
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

export interface Product {
    id: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    price: number;
    expense: number;
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
    transactionTotal: number;
}

export interface CreateTransactionResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    customer: string;
    userId: string;
}

export interface CreateTransactionRequest {
    transaction: any;
}

export interface UpdateTransactionResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    customer: string;
    userId: string;
}

export interface UpdateTransactionRequest {
    transactionId: string;
    customer: string;
    transactionProducts: Array<{ productId: string, quantity: number }>;
}

export interface DeleteTransactionResponse {
    message: string;
    transaction: Transaction;
}

export interface DeleteTransactionRequest {
    transactionId: string;
}

export interface GetTransactionProductsResponse {
    product: Product;
    totalQuantity: number;
    totalRevenue: number;
}

export interface LoginResponse {
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface updateProductResponse {
    message: string;
    product: Product;
}

export interface updateProductRequest {
    id: string;
    description: string;
    expense: number;
    price: number;    
}

export interface createProductResponse {
    product: Product;
}

export interface createProductRequest {
    description: string;
    expense: number;
    price: number;
}

export interface DeleteProductResponse {
    message: string;
    product: Product;
}

export interface DeleteProductRequest {
    productId: string;
}

export interface createTransactionProductResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    transactionId: string;
    productId: string;
    quantity: number;
}

export interface createTransactionProductRequest {
    transactionId: string;
    productId: string;
    quantity: number;
}