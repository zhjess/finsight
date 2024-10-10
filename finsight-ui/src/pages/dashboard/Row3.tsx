import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

const Row3 = () => {
    const { palette } = useTheme();
    const pieColors = [palette.primary[500],palette.primary[800]];

    const { data: productData } = useGetProductsQuery();
    const { data: transactionData } = useGetTransactionsQuery();
    const { data: kpiData } = useGetKpisQuery();

    const pieChartData = useMemo(() => {
        if (kpiData) {
            const totalExpenses = kpiData[0].totalExpenses;
            
            return Object.entries(kpiData[0].expensesByCategory).map(
                ([key, value]) => {
                    return [
                        {
                            name: key,
                            value: value,
                        },
                        {
                            name: `${key} of Total`,
                            value: totalExpenses - value
                        }
                    ];
                }
            );
        }
        return [];
    }, [kpiData]);

    const productColumns = [
        { field: "id", headerName: "ID", flex: 1.3 },
        { field: "description", headerName: "Name", flex: 0.5 },
        { field: "expense", headerName: "Expense", flex: 0.5, valueFormatter: (value: number) => `$${(value / 100).toLocaleString()}`},
        { field: "price", headerName: "Price", flex: 0.5, valueFormatter: (value: number) => `$${(value / 100).toLocaleString()}`}
    ];

    const transactionColumns = [
        { field: "createdAt", headerName: "Created at", flex: 0.9 },
        { field: "id", headerName: "ID", flex: 1 },
        // { field: "customer", headerName: "Customer", flex: 0.5 },
        { field: "transactionTotal", headerName: "Total", flex: 0.4, valueFormatter: (value: number) => `$${(value / 100).toLocaleString()}`}
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
                    title="Recent Sales"
                    subtitle="This is a list of recent sales"
                    sideText={`${transactionData?.length} latest transactions`}
                />
                <Box 
                    m="0.5rem"
                    p=" 0 0.5rem"
                    height="78%"
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
            <DashboardBox gridArea="i">
                <BoxHeader
                    title="Expense breakdown by category"
                    subtitle="This is a breakdown of expenses by category"
                    sideText="XX.XX"
                />
                <FlexBetween p="0 1rem" textAlign="center">
                {pieChartData?.map((data, i) => (
                    <Box key={`${data[0].name}-${i}`} mt="0.3rem">
                    <PieChart width={110} height={60}>
                        <Pie
                        stroke="none"
                        data={data}
                        innerRadius={10}
                        outerRadius={25}
                        paddingAngle={2}
                        dataKey="value"
                        >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index]} />
                        ))}
                        </Pie>
                    </PieChart>
                    <Typography variant="h5" >{data[0].name}</Typography>
                    </Box>
                ))}
                </FlexBetween>
            </DashboardBox>
            <DashboardBox gridArea="j">
                <BoxHeader
                    title="Overall Summary and Explanation Data"
                    subtitle="This is a sample subtitle"
                    sideText="+XX.X%"
                />
                <Box>
                    <Box
                        height="15px"
                        margin="1.25rem 1rem 0.4rem 1rem"
                        bgcolor={palette.primary[800]}
                        borderRadius="1rem"
                    >
                        <Box
                            height="15px"
                            bgcolor={palette.primary[600]}
                            borderRadius="1rem"
                            width="40%"
                        >
                        </Box>   
                    </Box>
                </Box>
                <Typography margin="0 1rem" variant="h6">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias fugiat consectetur voluptas doloremque sunt voluptatibus aperiam maxime et nesciunt? A, dolorum fugit sunt nemo consectetur quisquam? Error ea molestiae aliquid!
                </Typography>
            </DashboardBox>
        </>
    )
}

export default Row3;