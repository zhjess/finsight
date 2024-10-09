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
        res.status(404).json({message: err.message});
    }
});

export default kpiRoutes;