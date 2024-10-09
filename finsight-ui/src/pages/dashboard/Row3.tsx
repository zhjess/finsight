import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from "@/state/api";
import { Transaction } from "@/state/types";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import React from "react";

const Row3 = () => {
    const { palette } = useTheme();
    const { data: productData } = useGetProductsQuery();
    const { data: transactionData } = useGetTransactionsQuery();
    const { data: kpiData } = useGetKpisQuery();

    const productColumns = [
        { field: "id", headerName: "ID", flex: 1.3 },
        { field: "description", headerName: "Name", flex: 0.5 },
        { field: "expense", headerName: "Expense", flex: 0.5, renderCell: (params: GridCellParams) => `$${params.value}`},
        { field: "price", headerName: "Price", flex: 0.5, renderCell: (params: GridCellParams) => `$${params.value}`}
    ];

    const transactionColumns = [
        { field: "id", headerName: "ID", flex: 1 },
        { field: "customer", headerName: "Customer", flex: 0.5 },
        { field: "transactionProducts", headerName: "Transaction items", flex: 0.9, renderCell: (params: GridCellParams) => (params.value as Array<string>).length }
    ];

    return (
        <>
            <DashboardBox gridArea="g">
                <BoxHeader
                    title="Product List"
                    subtitle="This is a list of products"
                    sideText={`${productData?.length} products`}
                />
                <Box 
                    m="0.5rem"
                    p=" 0 0.5rem"
                    height="70%"
                    sx={{
                        "& .MuiDataGrid-root": {
                            color: palette.grey[500],
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            border: "none",
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            borderBottom: `1px solid ${palette.grey[900]} !important`,
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            visibility: "hidden"
                        }
                    }}
                >
                    <DataGrid
                        columnHeaderHeight={25}
                        rowHeight={35}
                        hideFooter={true}
                        rows={productData || []}
                        columns={productColumns}
                    />
                </Box>
            </DashboardBox>
            <DashboardBox gridArea="h">
                <BoxHeader
                    title="Recent Orders"
                    subtitle="This is a list of recent orders"
                    sideText={`${transactionData?.length} latest transactions`}
                />
                <Box 
                    m="0.5rem"
                    p=" 0 0.5rem"
                    height="80%"
                    sx={{
                        "& .MuiDataGrid-root": {
                            color: palette.grey[500],
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            border: "none",
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            borderBottom: `1px solid ${palette.grey[900]} !important`,
                            border: "none"
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            visibility: "hidden"
                        }
                    }}
                >
                    <DataGrid
                        columnHeaderHeight={25}
                        rowHeight={35}
                        hideFooter={true}
                        rows={transactionData || []}
                        columns={transactionColumns}
                    />
                </Box>
            </DashboardBox>
            <DashboardBox gridArea="i"></DashboardBox>
            <DashboardBox gridArea="j"></DashboardBox>
        </>
    )
}

export default Row3;