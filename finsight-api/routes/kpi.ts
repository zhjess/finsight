import express from "express";
import prisma from "../prisma/prisma";

const kpiRoutes = express.Router();

kpiRoutes.get("/kpis", async (req, res) => {
    try {
        const kpis = await prisma.kpi.findMany();
 
        // Display monthly and daily data as part of kpis
        const kpisWithDailyMonthlyData = await Promise.all(
            kpis.map(async (kpi) => {
                const dailyData = await prisma.day.findMany({ where: { kpiId: kpi.id } });
                const monthlyData = await prisma.month.findMany({ where: { kpiId: kpi.id } });
                return {
                    ...kpi,
                    dailyData,
                    monthlyData
                };
            })
        );

        res.status(200).json(kpisWithDailyMonthlyData);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
});

export default kpiRoutes;