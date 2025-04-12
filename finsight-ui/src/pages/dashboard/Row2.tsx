import DashBoxHeader from "@/components/DashBoxHeader";
import DashBox from "@/components/DashBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery, useGetProductsQuery } from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from "recharts";

interface Row2Props {
    kpiYear: string;
}

const Row2: React.FC<Row2Props> = ({ kpiYear }) => {
    const year = kpiYear;
    const salesTarget = 350000;

    const { palette } = useTheme();
    const pieColors = [palette.grey[800], palette.primary[500]];

    const { data: kpiData } = useGetKpisQuery(year);
    const { data: productData } = useGetProductsQuery({ page: 1, limit: 1000 });

    const pieData = [
        { name: "Target Sales", value: salesTarget - (kpiData?.totalRevenue as number / 100) },
        { name: "Actual Sales", value: kpiData?.totalRevenue as number / 100 }
    ];

    const operationalExpenses = useMemo(() => {
        return (
            kpiData &&
            kpiData.monthlyData.map(({ monthEnded, totalOperational, totalNonOperational}) => {
                const date = new Date(monthEnded);
                const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
                return {
                    date: monthName,
                    operationalExpenses: (totalOperational / 100000).toFixed(2), // Denomination: $'000
                    nonOperationalExpenses: (totalNonOperational / 100000).toFixed(2) // Denomination: $'000
                };
            })
        );
    }, [kpiData]);

    const productPricesExpenses = useMemo(() => {
        return (
          productData &&
          productData.products.map(({ id, description, price, expense }) => {
            return {
              id,
              description,
              price: Number((price / 100).toFixed(2)),  // Denomination: $
              expense: Number((expense / 100).toFixed(2))  // Denomination: $
            };
          })
        );
      }, [productData]);

    return (
        <>
            <DashBox gridArea="d">
                <DashBoxHeader
                        title="Operational vs. Non-Operational Expenses"
                        subtitle="displayed in $'000"
                        sideText="+X.X%"
                />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={operationalExpenses}
                        margin={{
                            top: 20,
                            right: -20,
                            left: -20,
                            bottom: 55,
                        }}
                    >
                        <CartesianGrid vertical={false} stroke={palette.grey[800]} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            style={{ fontSize: "9px" }}    
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            tickLine={false}
                            axisLine={false}
                            style={{ fontSize: "9px" }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            style={{ fontSize: "9px" }}
                        />
                        <Tooltip />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="nonOperationalExpenses"
                            stroke={palette.primary.main}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="operationalExpenses"
                            stroke={palette.tertiary[500]}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </DashBox>
            <DashBox gridArea="e">
                <DashBoxHeader
                    title="Targets and Year-on-Year Metrics"
                    subtitle="Key metrics and sales target for the year"
                    sideText="+X.X%"
                />
                <FlexBetween mt="1rem">
                    <PieChart
                        width={110}
                        height={90}
                        margin={{
                            top: 0,
                            right: -10,
                            left: 10,
                            bottom: 0
                        }}
                    >
                        <Pie
                            data={pieData}
                            innerRadius={18}
                            outerRadius={38}
                            paddingAngle={2}
                            dataKey="value"
                        >
                        {/* 
                        // @ts-ignore */}
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index]} />
                        ))}
                        </Pie>
                    </PieChart>
                    <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
                        <Typography variant="h4" color={palette.grey[100]} fontStyle="bold" mb="0.5rem">Sales target</Typography>
                        <Typography m="0.3rem" variant="h4" color={palette.primary[300]}>{`$${(kpiData?.totalRevenue as number / 100).toLocaleString()}`}</Typography>
                        <Typography m="0.3rem" variant="h5" color={palette.grey[600]}>of</Typography>
                        <Typography m="0.3rem" variant="h4" color={palette.primary[300]}>{`$${salesTarget.toLocaleString()}`}</Typography>
                    </Box>
                    <Box flexBasis="40%" mr="1rem">
                        <Typography variant="h5" mb="0.2rem" color={palette.grey[100]} fontStyle="bold">Revenue</Typography>
                        <Typography variant="h5"mb="1rem">+12.5% compared to this time last year</Typography>
                        <Typography mt="0.4rem" mb="0.2rem"variant="h5" color={palette.grey[100]} fontStyle="bold">Profit margin</Typography>
                        <Typography variant="h5">+8.7% compared to this time last year</Typography>
                    </Box>
                </FlexBetween>
            </DashBox>
            <DashBox gridArea="f">
                <DashBoxHeader
                    title="Product Prices vs. Expenses"
                    subtitle="This is a sample subtitle"
                    sideText="+X.X%"
                />
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                    margin={{
                        top: 20,
                        right: 30,
                        bottom: 60,
                        left: -10,
                    }}
                    >
                        <CartesianGrid stroke={palette.grey[800]} />
                        <XAxis
                            type="number"
                            dataKey="price"
                            name="price"
                            domain={['auto', 'auto']}
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: "9px" }}
                            tickFormatter={(v) => `$${v}`}
                        />
                        <YAxis
                            type="number"
                            dataKey="expense"
                            name="expense"
                            domain={['auto', 'auto']}
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: "9px" }}
                            tickFormatter={(v) => `$${v}`}
                        />
                        <ZAxis type="number" range={[17]} />
                        <Tooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            formatter={(value, name) => [`$${value}`, name]}
                        />
                        <Scatter name="Product Expense Ratio" data={productPricesExpenses} fill={palette.tertiary[500]} />
                    </ScatterChart>
                </ResponsiveContainer>
            </DashBox>
        </>
    )
}

export default Row2;