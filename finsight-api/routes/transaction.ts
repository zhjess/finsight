import express from "express";
import prisma from "../prisma/prisma";

const transactionRoutes = express.Router();

transactionRoutes.get("/transactions", async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            take: 10,  // limit to 10 transactions
            orderBy: { createdAt: 'desc'},
            include: {
                transactionProducts: {
                    select: {
                        productId: true,
                        quantity: true
                    }
                }
            }
        });

        // Fromat response to include transaction total
        const transactionsFormatted = await Promise.all(transactions.map(async transaction => {
            let transactionTotal: Number = 0;

            const productPrices = await Promise.all(transaction.transactionProducts.map(async product => {
                const p = await prisma.product.findFirst({ where: { id: product.productId } });
                return p ? p.price * product.quantity : 0; // If product not found, return 0
            }));
            
            transactionTotal = productPrices.reduce((total, price) => total + price, 0);
            
            return ({...transaction, transactionTotal});
        }));
        res.status(200).json(transactionsFormatted);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
});

export default transactionRoutes;