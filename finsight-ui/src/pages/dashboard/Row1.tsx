import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery } from "@/state/api";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, Line, CartesianGrid, Legend, LineChart, BarChart, Bar, Rectangle } from "recharts";
import React, { useMemo } from "react";
import { useTheme } from "@mui/material";
import BoxHeader from "@/components/BoxHeader";

const Row1 = () => {
    const { palette } = useTheme();
    const { data } = useGetKpisQuery();

    const revenueExpenses = useMemo(() => {
        return (
            data &&
            data[0].monthlyData.map(({ date, revenue, expenses}) => {
                const d = new Date(date);
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d);
                return {
                    date: monthName.substring(0, 3),
                    revenue: (revenue / 100000).toFixed(2), // Denomination: $'000
                    expenses: (expenses / 100000).toFixed(2) // Denomination: $'000
                };
            })
        );
    }, [data]);

    const revenueProfit = useMemo(() => {
        return (
            data &&
            data[0].monthlyData.map(({ date, revenue, expenses}) => {
                const d = new Date(date);
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d);
                return {
                    date: monthName.substring(0, 3),
                    revenue: (revenue / 100000).toFixed(2), // Denomination: $'000
                    profit: ((revenue - expenses) / 100000).toFixed(2) // Denomination: $'000
                };
            })
        );
    }, [data])
    
    const revenue = useMemo(() => {
        return (
            data &&
            data[0].monthlyData.map(({ date, revenue }) => {
                const d = new Date(date);
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d);
                return {
                    date: monthName.substring(0, 3),
                    revenue: (revenue / 100000).toFixed(2), // Denomination: $'000
                };
            })
        );
    }, [data])

    return (
        <>
            <DashboardBox gridArea="a">
                <BoxHeader
                    title="Revenue and Expenses"
                    subtitle="displayed in $'000"
                    sideText="+X.X%"
                />
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={500}
                        height={400}
                        data={revenueExpenses}
                        margin={{
                            top: 15,
                            right: 25,
                            left: -20,
                            bottom: 60,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.primary[300]} stopOpacity={0.7} />
                                <stop offset="95%" stopColor={palette.primary[300]} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.primary[300]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={palette.primary[300]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke={palette.grey[800]} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            style={{ fontSize: "9px" }}    
                        />
                        <YAxis
                            
                            tickLine={false}
                            axisLine={{ strokeWidth: "0" }}
                            style={{ fontSize: "9px" }}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            dot={true}
                            stroke={palette.primary.main}
                            fill="url(#colorRevenue)"
                            fillOpacity={1}
                        />
                        <Area
                            type="monotone"
                            dataKey="expenses"
                            dot={true}
                            stroke={palette.primary.main}
                            fill="url(#colorExpenses)"
                            fillOpacity={1}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </DashboardBox>
            
            <DashboardBox gridArea="b">
                <BoxHeader
                        title="Revenue and Profit"
                        subtitle="displayed in $'000"
                        sideText="+X.X%"
                />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={revenueProfit}
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
                        <Legend height={20} wrapperStyle={{ margin: "0 0 10px 0", fontSize: "10px"}} />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            stroke={palette.primary.main}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="profit"
                            stroke={palette.tertiary[500]}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>

            <DashboardBox gridArea="c">
                <BoxHeader
                    title="Revenue Month by Month"
                    subtitle="displayed in $'000"
                    sideText="+X.X%"
                />
                <ResponsiveContainer>
                    <BarChart
                        data={revenue}
                        margin={{
                            top: 17,
                            right: 20,
                            left: -20,
                            bottom: 60,
                        }}
                    >
                         <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.primary[300]} stopOpacity={0.7} />
                                <stop offset="95%" stopColor={palette.primary[300]} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRevenueSelected" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.primary[600]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={palette.primary[600]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke={palette.grey[800]} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: "10px"}}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: "10px"}}
                        />
                        <Tooltip />
                        <Bar
                            dataKey="revenue"
                            fill="url(#colorRevenue)"
                            activeBar={<Rectangle fill="url(#colorRevenueSelected)" stroke="black" />}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    )
}

export default Row1;