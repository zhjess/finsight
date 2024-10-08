import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import FlexBetween from '@/components/FlexBetween';
import { useGetKpisQuery, useGetProductsQuery } from '@/state/api';
import { Box, Typography, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';

const pieData = [
    { name: "Group A", value: 600 },
    { name: "Group B", value: 400 }
];

const Row2 = () => {
    const { palette } = useTheme();
    const pieColors = [palette.primary[800], palette.primary[300]];

    const { data: kpiData } = useGetKpisQuery();
    const { data: productData } = useGetProductsQuery();

    const operationalExpenses = useMemo(() => {
        return (
            kpiData &&
            kpiData[0].monthlyData.map(({ date, operationalExpenses, nonOperationalExpenses}) => {
                const d = new Date(date);
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d);
                return {
                    date: monthName.substring(0, 3),
                    operationalExpenses: (operationalExpenses / 100000).toFixed(2), // Denomination: $'000
                    nonOperationalExpenses: (nonOperationalExpenses / 100000).toFixed(2) // Denomination: $'000
                };
            })
        );
    }, [kpiData]);

    const productPricesExpenses = useMemo(() => {
        return (
            productData &&
            productData.map(({ id, price, expense }) => {
                return {
                    id: id,
                    price: (price / 100).toFixed(2), // Denomination: $
                    expense: (expense / 100).toFixed(2) // Denomination: $
                };
            })
        );
    }, [productData]);

    return (
        <>
            <DashboardBox gridArea="d">
                <BoxHeader
                        title="Operational vs. Non-operational Expenses"
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
            </DashboardBox>
            <DashboardBox gridArea="e">
                <BoxHeader
                    title="Targets"
                    subtitle="displayed in $'000"
                    sideText="+X.X%"
                />
                <FlexBetween mt="0">
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
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index]} />
                        ))}
                        </Pie>
                    </PieChart>
                    <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
                        <Typography variant="h5">Target sales</Typography>
                        <Typography m="0.3rem" variant="h3" color={palette.primary[300]}>83</Typography>
                        <Typography variant="h6">Finance goals of the campaign...</Typography>
                    </Box>
                    <Box flexBasis="40%" mr="0.5rem">
                        <Typography variant="h5">Losses in Revenue</Typography>
                        <Typography variant="h6">Losses are down XX.X%</Typography>
                        <Typography mt="0.4rem" variant="h5">Profit margins</Typography>
                        <Typography variant="h6">Margins up XX.X% from last month</Typography>
                    </Box>
                </FlexBetween>
            </DashboardBox>
            <DashboardBox gridArea="f">
                <BoxHeader
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
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: "9px" }}
                            tickFormatter={(v) => `$${v}`}
                        />
                        <YAxis
                            type="number"
                            dataKey="expense"
                            name="expense"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: "9px" }}
                            tickFormatter={(v) => `$${v}`}
                        />
                        <ZAxis type="number" range={[20]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v) => `${v}`} />
                        <Scatter name="Product Expense Ratio" data={productPricesExpenses} fill={palette.tertiary[500]} />
                    </ScatterChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    )
}

export default Row2;