// Types for Expenses
export interface ExpensesByCategory {
    "Cost of goods sold": number;
    "Rent": number;
    "Services": number;
    "Salaries": number;
    "Utilities": number;
}

// Types for Date-related Data
export interface Day {
    date: string;
    totalRevenue: number;
    totalExpenses: number;
}

export interface Month {
    monthEnded: string;
    totalRevenue: number;
    totalExpenses: number;
    totalOperational: number;
    totalNonOperational: number;
}

// Product
export interface Product {
    id: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    price: number;
    expense: number;
    transactionProducts: TransactionProduct[];
}

export interface GetProductsResponse {
    products: Product[];
    totalProducts: number;
    page: number;
    totalPages: number;

}

export interface CreateProductRequest {
    description: string;
    expense: number;
    price: number;
}

export interface CreateProductResponse {
    product: Product;
}

export interface UpdateProductRequest {
    description: string;
    price: number;
    expense: number;
}

export interface UpdateProductResponse {
    message: string;
    product: Product;
}

export interface DeleteProductResponse {
    message: string;
    product: Product;
}

// KPI
export interface GetKpisResponse {
    userId: string;
    totalProfit: number;
    totalRevenue: number;
    totalExpenses: number;
    expensesByCategory: ExpensesByCategory;
    expensesByType: { totalOperational: number; totalNonOperational: number };
    dailyData: Day[];
    monthlyData: Month[];
}

// User
export interface User {
    id: string;
    email: string;
    password: string;
    revenueTransactions: RevenueTransaction[];
    expensesTransactions: ExpenseTransaction[];
    kpis: string[];
}

// Transaction Product
export interface TransactionProduct {
    id: string;
    createdAt: string;
    updatedAt: string;
    revenueTransactionId: string;
    productId: string;
    quantity: number;
}

export interface GetTransactionProductsTopSalesResponse {
    product: Product;
    totalQuantity: number;
    totalRevenue: number;
}

export interface CreateTransactionProductRequest {
    transactionId: string;
    productId: string;
    quantity: number;
}

export interface CreateTransactionProductResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    transactionId: string;
    productId: string;
    quantity: number;
}

// Revenue transaction
export interface RevenueTransaction {
    id: string;
    createdAt: string;
    updatedAt: string;
    date: string;
    transactionProducts: { productId: string; quantity: number }[];
    customer: string;
    userId: string;
    transactionTotal: number;
}

export interface GetRevenueTransactionsResponse {
    transactions: RevenueTransaction[];
    total: number;
    page: number;
    totalPages: number;
}

export interface CreateRevenueTransactionRequest {
    date: string; // TO CHECK
    customer: string;
    transactionProducts: { productId: string; quantity: number }[];
}

export interface CreateRevenueTransactionResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    date: string;
    customer: string;
    userId: string;
    transactionProducts: TransactionProduct[];
}

export interface UpdateRevenueTransactionRequest {
    date: string;
    customer: string;
    transactionProducts: { productId: string; quantity: number }[];
}

export interface UpdateRevenueTransactionResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    date: string;
    customer: string;
    userId: string;
    transactionProducts: TransactionProduct[];
}

export interface DeleteRevenueTransactionResponse {
    message: string;
    transaction: UpdateProductResponse;
}

// Expense transaction
export interface ExpenseTransaction {
    id: string;
    createdAt: string;
    updatedAt: string;
    date: string;
    counterparty: string;
    userId: string;
    amount: number;
    expenseCategoryId: string;
    expenseCategory: { description: string};
}

export interface GetExpenseTransactionsResponse {
    transactions: ExpenseTransaction[];
    total: number;
    page: number;
    totalPages: number;
}

export interface CreateExpenseTransactionRequest {
    date: string; // TO CHECK
    counterparty: string;
    amount: number;
    expenseCategoryId: string;
}

export interface CreateExpenseTransactionResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    date: string;
    counterparty: string;
    userId: string;
    amount: number;
    expenseCategoryId: string;
    expenseCategory: { description: string};
}

export interface UpdateExpenseTransactionRequest {
    date: string; // TO CHECK
    counterparty: string;
    amount: number;
    expenseCategoryId: string;
}

export interface UpdateExpenseTransactionResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    date: string;
    counterparty: string;
    userId: string;
    amount: number;
    expenseCategoryId: string;
    expenseCategory: { description: string};
}

export interface DeleteExpenseTransactionResponse {
    message: string;
    transaction: UpdateExpenseTransactionResponse;
}

export interface GetExpenseCategoriesResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    expenseTypeId: string;
    expenseType: { description: string };
}

// Login 
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}