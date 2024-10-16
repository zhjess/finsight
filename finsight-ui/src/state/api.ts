import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createProductRequest, createProductResponse, createTransactionProductRequest, createTransactionProductResponse, CreateTransactionRequest, CreateTransactionResponse, DeleteProductRequest, DeleteProductResponse, DeleteTransactionRequest, DeleteTransactionResponse, GetKpisResponse, GetProductsResponse, GetTransactionProductsResponse, GetTransactionsResponse, LoginRequest, LoginResponse, updateProductRequest, updateProductResponse, UpdateTransactionRequest, UpdateTransactionResponse } from "./types";

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

export const api = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Kpis", "Products", "Transactions", "Latest Transactions", "Transaction Products"],
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest> ({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials
            })
        }),
        getKpis: builder.query<Array<GetKpisResponse>, void>({
            query: () => "kpi/kpis",
            providesTags: ["Kpis"]
        }),
        getProducts: builder.query<Array<GetProductsResponse>, void>({
            query: () => "product/products",
            providesTags: ["Products"]
        }),
        createProduct: builder.mutation<createProductResponse, createProductRequest> ({
            query: (product) => ({
                url: "/product/create",
                method: "POST",
                body: product
            })
        }),
        updateProduct: builder.mutation<updateProductResponse, updateProductRequest> ({
            query: (product) => ({
                url: "/product/update",
                method: "PUT",
                body: product
            })
        }),
        deleteProduct: builder.mutation<DeleteProductResponse, DeleteProductRequest> ({
            query: (product) => ({
                url: "/product/delete",
                method: "DELETE",
                body: product
            })
        }),
        getTransactions: builder.query<Array<GetTransactionsResponse>, void>({
            query: () => "transaction/transactions",
            providesTags: ["Transactions"]
        }),
        createTransaction: builder.mutation<CreateTransactionResponse, CreateTransactionRequest> ({
            query: (transaction) => ({
                url: "/transaction/create",
                method: "POST",
                body: transaction
            })
        }),
        updateTransaction: builder.mutation<UpdateTransactionResponse, UpdateTransactionRequest> ({
            query: (transaction) => ({
                url: "/transaction/update",
                method: "PUT",
                body: transaction
            })
        }),
        deleteTransaction: builder.mutation<DeleteTransactionResponse, DeleteTransactionRequest> ({
            query: (transaction) => ({
                url: "/transaction/delete",
                method: "DELETE",
                body: transaction
            })
        }),
        getLatestTransactions: builder.query<Array<GetTransactionsResponse>, void>({
            query: () => "transaction/transactions/latest",
            providesTags: ["Latest Transactions"]
        }),
        getTopTransactionProducts: builder.query<Array<GetTransactionProductsResponse>, void>({
            query: () => "/transactionproduct/transactionproducts/top",
            providesTags: ["Transaction Products"]
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
    useGetTransactionsQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation,
    useGetLatestTransactionsQuery,
    useGetTopTransactionProductsQuery,
    // useCreateTransactionProductMutation
} = api;