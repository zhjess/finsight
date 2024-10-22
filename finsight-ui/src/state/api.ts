import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateExpenseTransactionRequest, CreateExpenseTransactionResponse, CreateProductRequest, CreateProductResponse, CreateRevenueTransactionRequest, CreateRevenueTransactionResponse, DeleteExpenseTransactionResponse, DeleteProductResponse, DeleteRevenueTransactionResponse, ExpenseTransaction, GetExpenseCategoriesResponse, GetExpenseTransactionsResponse, GetKpisResponse, GetProductsResponse, GetRevenueTransactionsResponse, GetTransactionProductsTopSalesResponse, LoginRequest, LoginResponse, RevenueTransaction, UpdateExpenseTransactionRequest, UpdateExpenseTransactionResponse, UpdateProductRequest, UpdateProductResponse, UpdateRevenueTransactionRequest, UpdateRevenueTransactionResponse } from "./types";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        window.location.href = "/expired";
    }
    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Kpis", "Products", "Transaction", "Transactions - revenue", "Transactions - revenue - latest", "Transactions - expense", "Transactions - expense - by type", "Transaction products - top"],
    endpoints: (builder) => ({
        // login
        login: builder.mutation<LoginResponse, LoginRequest> ({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials
            })
        }),
        // kpi
        getKpis: builder.query<Array<GetKpisResponse>, void>({
            query: () => "kpi/kpis",
            providesTags: ["Kpis"]
        }),
        // product
        getProducts: builder.query<GetProductsResponse, { page: number; limit: number }>({
            query: ({ page, limit }) => `product/products?page=${page}&limit=${limit}`,
            providesTags: ["Products"]
        }),
        createProduct: builder.mutation<CreateProductResponse, CreateProductRequest> ({
            query: (product) => ({
                url: "/product/create",
                method: "POST",
                body: product
            })
        }),
        updateProduct: builder.mutation<UpdateProductResponse, { id: string; product: UpdateProductRequest }>({
            query: ({ id, product }) => ({
                url: `/product/update/${id}`,
                method: "PUT",
                body: product
            })
        }),
        deleteProduct: builder.mutation<DeleteProductResponse, string> ({
            query: (productId) => ({
                url: `/product/delete/${productId}`,
                method: "DELETE"
            })
        }),
        // transaction
        getTransaction: builder.query<RevenueTransaction | ExpenseTransaction , string>({
            query: (transactionId) => `transaction/${transactionId}`,
            providesTags: ["Transaction"]
        }),
        // transaction - revenue
        getRevenueTransactions: builder.query<GetRevenueTransactionsResponse, { page: number; limit: number }>({
            query: ({ page, limit }) => `transaction/transactions/revenue?page=${page}&limit=${limit}`,
            providesTags: ["Transactions - revenue"]
        }),
        getRevenueTransactionsLatest: builder.query<Array<RevenueTransaction>, string>({
            query: (limit) => `transaction/transactions/revenue/latest/${limit}`,
            providesTags: ["Transactions - revenue - latest"]
        }),
        createRevenueTransaction: builder.mutation<CreateRevenueTransactionResponse, CreateRevenueTransactionRequest> ({
            query: (transaction) => ({
                url: "/transaction/revenue/create",
                method: "POST",
                body: transaction
            })
        }),
        updateRevenueTransaction: builder.mutation<UpdateRevenueTransactionResponse, { id: string; transaction: UpdateRevenueTransactionRequest }> ({
        query: ({ id, transaction }) => ({
                url: `/transaction/revenue/update/${id}`,
                method: "PUT",
                body: transaction
            })
        }),
        deleteRevenueTransaction: builder.mutation<DeleteRevenueTransactionResponse, string> ({
            query: (transactionId) => ({
                    url: `/transaction/revenue/delete/${transactionId}`,
                    method: "DELETE",
                })
            }),
        // transaction - expense
        getExpenseTransactions: builder.query<GetExpenseTransactionsResponse, { page: number; limit: number }>({
            query: ({ page, limit }) => `transaction/transactions/expense?page=${page}&limit=${limit}`,
            providesTags: ["Transactions - expense"]
        }),
        getExpenseTransactionsByType: builder.query<Array<ExpenseTransaction>, { id: string }>({
            query: ({ id }) => `transaction/transactions/expense/${id}`,
            providesTags: ["Transactions - expense - by type"]
        }),
        createExpenseTransaction: builder.mutation<CreateExpenseTransactionResponse, CreateExpenseTransactionRequest> ({
            query: (transaction) => ({
                url: "/transaction/expense/create",
                method: "POST",
                body: transaction
            })
        }),
        updateExpenseTransaction: builder.mutation<UpdateExpenseTransactionResponse, { id: string; transaction: UpdateExpenseTransactionRequest }> ({
        query: ({ id, transaction }) => ({
                url: `/transaction/expense/update/${id}`,
                method: "PUT",
                body: transaction
            })
        }),
        deleteExpenseTransaction: builder.mutation<DeleteExpenseTransactionResponse, string> ({
            query: (transactionId) => ({
                    url: `/transaction/expense/delete/${transactionId}`,
                    method: "DELETE",
                })
            }),
        // expense categories
        getExpenseCategories: builder.query<Array<GetExpenseCategoriesResponse>, void>({
            query: () => "transaction/transactions/expense/categories",
            providesTags: ["Transactions - expense"]
        }),
        // transaction products
        getTransactionProductsTop: builder.query<Array<GetTransactionProductsTopSalesResponse>, void>({
            query: () => "/transactionproduct/transactionproducts/sales/top",
            providesTags: ["Transaction products - top"]
        }),
        // createTransactionProduct: builder.mutation<createTransactionProductResponse, createTransactionProductRequest> ({
        //     query: (transactionProduct) => ({
        //         url: "/transactionproduct/create",
        //         method: "POST",
        //         body: transactionProduct
        //     })
        // })
    })
});

export const {
    useLoginMutation,
    useGetKpisQuery,
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetTransactionQuery,
    useGetRevenueTransactionsQuery,
    useGetRevenueTransactionsLatestQuery,
    useCreateRevenueTransactionMutation,
    useUpdateRevenueTransactionMutation,
    useDeleteRevenueTransactionMutation,
    useGetExpenseTransactionsQuery,
    useGetExpenseTransactionsByTypeQuery,
    useGetExpenseCategoriesQuery,
    useCreateExpenseTransactionMutation,
    useUpdateExpenseTransactionMutation,
    useDeleteExpenseTransactionMutation,
    useGetTransactionProductsTopQuery,
    // useCreateTransactionProductMutation,
} = api;