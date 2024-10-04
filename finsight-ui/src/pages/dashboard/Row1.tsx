import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery } from "@/state/api";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import React, { useMemo } from "react";
import { useTheme } from "@mui/material";
import BoxHeader from "@/components/BoxHeader";

const Row1 = () => {
    const { palette } = useTheme();

    const { data } = useGetKpisQuery();
    console.log("🚀 ~ Row1 ~ data:", data)
    
    const revenueExpenses = useMemo(() => {
        return (
            data &&
            data[0].monthlyData.map(({ date, revenue, expenses}) => {
                const d = new Date(date);
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d);
                return {
                    date: monthName.substring(0, 3),
                    revenue: revenue / 100,
                    expenses: expenses / 100
                };
            })
        );
    }, [data]);
        
    return (
        <>
            <DashboardBox gridArea="a">
                <BoxHeader
                    title="Revenue and Expenses"
                    subtitle="This is a sample subtitle"
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
                            left: -15,
                            bottom: 60,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.primary[300]} stopOpacity={0.5} />
                                <stop offset="95%" stopColor={palette.primary[300]} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.primary[300]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={palette.primary[300]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            style={{ fontSize: "10px" }}    
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={{ strokeWidth: "0" }}
                            style={{ fontSize: "10px" }}
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
            <DashboardBox gridArea="b"></DashboardBox>
            <DashboardBox gridArea="c"></DashboardBox>
        </>
    )
}

export default Row1;