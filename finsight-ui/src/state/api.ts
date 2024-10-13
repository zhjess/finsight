import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetKpisResponse, GetProductsResponse, GetTransactionsResponse, LoginRequest, LoginResponse } from "./types";

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    reducerPath: "main",
    tagTypes: ["Kpis", "Products", "Transactions", "Token"],
    endpoints: (builder) => ({
        getKpis: builder.query<Array<GetKpisResponse>, void>({
            query: () => "kpi/kpis",
            providesTags: ["Kpis"]
        }),
        getProducts: builder.query<Array<GetProductsResponse>, void>({
            query: () => "product/products",
            providesTags: ["Products"]
        }),
        getTransactions: builder.query<Array<GetTransactionsResponse>, void>({
            query: () => "transaction/transactions",
            providesTags: ["Transactions"]
        }),
        login: builder.mutation<LoginResponse, LoginRequest> ({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials
            })
        })
    })
});

export const { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery, useLoginMutation } = api;