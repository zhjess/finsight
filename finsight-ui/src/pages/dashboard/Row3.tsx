import DashBoxHeader from "@/components/DashBoxHeader";
import DashBox from "@/components/DashBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery, useGetRevenueTransactionsLatestQuery, useGetTransactionProductsTopQuery } from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { formatDate } from "@/utils/dateUtils";
import Legend from "@/components/Legend";
import ProgressBarChart from "@/components/ProgressBarChart";

interface Row2Props {
    kpiYear: string;
}

const Row3: React.FC<Row2Props> = ({ kpiYear }) => {
    const year = kpiYear;
    
    const { palette } = useTheme();
    const pieColorsOperational = [palette.primary[500],palette.grey[800]];
    const pieColorsNonOperational = [palette.tertiary[500],palette.grey[800]];

    const { data: productData } = useGetTransactionProductsTopQuery();
    const productDataFormatted = productData?.map(product => {
        return {
            id: product.product.id,
            description: product.product.description,
            totalQuantity: product.totalQuantity,
            totalRevenue: product.totalRevenue
        };
    });
    const transactionsToLoad = "10";
    const { data: transactionData } = useGetRevenueTransactionsLatestQuery(transactionsToLoad);
    const { data: kpiData } = useGetKpisQuery(year);

    const pieChartData = useMemo(() => {
        if (kpiData) {
            const totalExpenses = kpiData.totalExpenses;
            
            return Object.entries(kpiData.expensesByCategory).map(
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
        { field: "description", headerName: "Name", flex: 0.5 },
        { field: "id", headerName: "Product ID", flex: 1 },
        { field: "totalRevenue", headerName: "Total revenue", flex: 0.5, valueFormatter: (value: number) => `$${(value / 100).toLocaleString(undefined, {minimumFractionDigits: 2})}` }
    ];

    const transactionColumns = [
        {
            field: "date",
            headerName: "Date",
            flex: 0.7,
            renderCell: (params: any) => {
                const date = new Date(params.value);
                return formatDate(date);
            },
         },
        { field: "id", headerName: "Transaction ID", flex: 1 },
        { field: "transactionTotal", headerName: "Total", flex: 0.5, valueFormatter: (value: number) => `$${(value / 100).toLocaleString(undefined, {minimumFractionDigits: 2})}`}
    ];

    const progressBarWidth = () => {
        const operationalExpenses = kpiData?.expensesByType?.totalOperational || 0;
        const totalExpenses = kpiData?.totalExpenses || 1;
        const width = (operationalExpenses / totalExpenses) * 100;
        return `${width.toFixed(2)}%`
    }    

    return (
        <>
            <DashBox gridArea="g">
                <DashBoxHeader
                    title="Top-Selling Products"
                    subtitle="by sales revenue"
                    sideText={`Top ${productData?.length} products`}
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
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
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
                        rows={productDataFormatted || []}
                        columns={productColumns}
                    />
                </Box>
            </DashBox>
            <DashBox gridArea="h">
                <DashBoxHeader
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
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
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
            </DashBox>
            <DashBox gridArea="i">
            <DashBoxHeader
                title="Expense Breakdown by Category"
                subtitle="This is a breakdown of expenses by category"
                sideText="XX.XX"
            />
                <FlexBetween textAlign="center" margin="0 1rem" alignItems="center">
                    {pieChartData?.map((data, i) => {
                        const isInterestExpense = data[0].name === "Interest expense";
                        return (
                            <Box key={`${data[0].name}-${i}`} mt="0.5rem" display="flex" flexDirection="column" alignItems="center">
                                <PieChart width={90} height={40}>
                                    <Pie
                                        stroke="none"
                                        data={data}
                                        innerRadius={7}
                                        outerRadius={15}
                                        dataKey="value"
                                    > 
                                        {/* 
                                        // @ts-ignore */}
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={isInterestExpense 
                                                    ? (index === 0 ? pieColorsNonOperational[0] : pieColorsNonOperational[1])
                                                    : (index === 0 ? pieColorsOperational[0] : pieColorsOperational[1])}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                                <Typography variant="h5" fontSize="smaller">
                                    {kpiData ? `${((data[0].value / kpiData.totalExpenses) * 100).toFixed(1)}%` : 'N/A'}
                                </Typography>
                                <Typography variant="h5" fontSize="smaller">{data[0].name}</Typography>
                            </Box>
                        );
                    })}
                </FlexBetween>
                <Box>
                    <ProgressBarChart width={progressBarWidth()} bgColorPrimary={palette.tertiary[700]} bgColorSecondary={palette.primary[600]} ></ProgressBarChart>
                    <Legend items={[{ name: "Operational Expenses", color: palette.primary[700]}, { name: "Non-Operational Expenses", color: palette.tertiary[700] }]}></Legend>
                </Box>
            </DashBox>
            <DashBox gridArea="j">
                <DashBoxHeader
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
                        />
                    </Box>
                </Box>
                <Typography margin="0 1rem" variant="h6">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias fugiat consectetur voluptas doloremque sunt voluptatibus aperiam maxime et nesciunt? A, dolorum fugit sunt nemo consectetur quisquam? Error ea molestiae aliquid!
                </Typography>
            </DashBox>
        </>
    )
}

export default Row3;