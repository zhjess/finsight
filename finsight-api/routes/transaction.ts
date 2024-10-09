import express from "express";
import prisma from "../prisma/prisma";

const transactionRoutes = express.Router();

transactionRoutes.get("/transactions", async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            take: 10,  // limit to 10 transactions
            orderBy: { createdAt: 'desc'},
            include: {
                transactionProducts: true
            }
        });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
});

export default transactionRoutes;