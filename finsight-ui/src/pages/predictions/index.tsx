import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery } from "@/state/api";
import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import regression, { DataPoint } from "regression";

const Predictions = () => {
    const { palette } = useTheme();
    const [isPredictions, setIsPredictions] = useState<boolean>(false);
    const { data: kpiData } = useGetKpisQuery();

    const formattedData = useMemo(() => {
        if (kpiData) {
            const monthlyData = kpiData[0].monthlyData;

            const formatted: Array<DataPoint> = monthlyData.map(
                ({ revenue }, index: number) => {
                    return [index, revenue / 100000]; // index represents month in graph
                }
            );
            const regressionLine = regression.linear(formatted);

            return monthlyData.map(({ date, revenue }, index: number) => {
                const d = new Date(date);
                const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(d);
                return {
                    date: monthName.substring(0, 3),
                    "actual revenue": (revenue / 100000).toFixed(2),
                    "regression line": regressionLine.points[index][1],
                    "predicted revenue": regressionLine.predict(index + 12)[1]
                };
            });
        }
        return [];
    }, [kpiData]);

    // Calculate min and max for the Y-axis with a buffer
    const revenues: number[] = formattedData.map(data => parseInt(data["actual revenue"]));
    const minRevenue: number = Math.min(...revenues);
    const maxRevenue: number = Math.max(...revenues);
    const yMin = Math.round(minRevenue * (1 - 0.1)); // Decrease min by 10%
    const yMax = Math.round(maxRevenue * (1 + 0.1)); // Increase max by 10%

    return (
        <DashboardBox width="100%" height="90vh" p="1rem">
            <FlexBetween m="1rem 2.5rem" gap="0.3rem">
                <Box>
                    <Typography variant="h3">Revenue and Predictions</Typography>
                    <Typography variant="h6" fontSize="12px">Predicted revenue for the next 12 months based on a simple linear regression model</Typography>
                </Box>
                <Button
                    onClick={() => setIsPredictions(!isPredictions)}
                    sx={{
                        color: palette.grey[100],
                        backgroundColor: palette.grey[700],
                        boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)"
                    }}
                >
                    {isPredictions ? "Hide" : "Show"} prediction
                </Button>
            </FlexBetween>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={formattedData}
                    margin={{
                        top: 20,
                        right: 75,
                        left: 20,
                        bottom: 100,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={palette.grey[800]} />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        style={{ fontSize: "12px" }}
                    >
                        <Label value="Month" offset={-15} position="insideBottom" />
                    </XAxis>
                    <YAxis
                        axisLine={false}
                        style={{ fontSize: "12px" }}
                        domain={[yMin, yMax]} // Set Y-axis domain with buffer
                    >
                        <Label 
                            value="Revenue ($'000)"
                            angle={-90}
                            position="insideLeft"
                        />
                    </YAxis>
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Line
                        type="monotone"
                        dataKey="actual revenue"
                        stroke={palette.primary.main}
                        strokeWidth={0}
                        dot={{ strokeWidth: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="regression line"
                        stroke={palette.tertiary[500]}
                        dot={false}
                    />
                    {isPredictions && (
                        <Line
                            type="monotone"
                            dataKey="predicted revenue"
                            stroke={palette.secondary[500]}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </DashboardBox>
    );
}

export default Predictions;
