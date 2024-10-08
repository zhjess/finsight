import express from "express";
import prisma from "../prisma/prisma";

const transactionRoutes = express.Router();

transactionRoutes.get("/transactions", async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            take: 10,  // limit to 10 transactions
            orderBy: { createdAt: 'desc'}
        });

        const transactionsWithProducts = await Promise.all(
            transactions.map(async (transaction) => {
                const transactionProducts = await prisma.transactionProduct.findMany({
                    where: { transactionId: transaction.id }
                });
                return {
                    ...transaction,
                    transactionProducts,
                };
            })
        );
        res.status(200).json(transactionsWithProducts);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
});

export default transactionRoutes;