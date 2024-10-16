import express from "express";
import prisma from "../prisma/prisma";

const kpiRoutes = express.Router();

kpiRoutes.get("/kpis", async (req, res) => {
    try {
        const kpis = await prisma.kpi.findMany({
            include: {
                dailyData: true,
                monthlyData: true
            }
        });
        res.status(200).json(kpis);
    } catch (err) {
        console.log("🚀 ~ kpiRoutes.get ~ err:", err)
        res.status(500).json({ message: "An error occurred while retrieving KPIs" });
    }
});

export default kpiRoutes;