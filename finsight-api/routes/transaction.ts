import express from "express";
import prisma from "../prisma/prisma";
import { authenticateUser } from "../middleware/userAuth";
import { Transaction, TransactionProduct } from "@prisma/client";

const transactionRoutes = express.Router();
transactionRoutes.use(authenticateUser);

interface TransactionWithTotal extends Transaction {
    transactionProducts: TransactionProduct[];
    transactionTotal?: number;
}

const formatTransactions = async (transactions: TransactionWithTotal[]): Promise<TransactionWithTotal[]> => {
    return Promise.all(transactions.map(async transaction => {
        const productPrices = await Promise.all(transaction.transactionProducts.map(async product => {
            const p = await prisma.product.findFirst({ where: { id: product.productId } });
            return p ? p.price * product.quantity : 0; // if product not found, return 0
        }));
        
        const transactionTotal = productPrices.reduce((total, price) => total + price, 0);
        
        return { ...transaction, transactionTotal };
    }));
} 

transactionRoutes.get("/transactions", async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' },
            include: {
                transactionProducts: {
                    select: {
                        productId: true,
                        quantity: true
                    }
                }
            }
        });
        const transactionsFormatted = await formatTransactions(transactions as TransactionWithTotal[]);
        res.status(200).json(transactionsFormatted);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.get ~ err:", err);
        res.status(500).json({ message: "An error occurred while retrieving transactions" });
    }
});

transactionRoutes.get("/:id", async (req, res) => {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: req.params.id },
            include: {
                transactionProducts: {
                    select: {
                        productId: true,
                        quantity: true
                    }
                }
            }
        });
        const transactionsFormatted = await formatTransactions([transaction] as TransactionWithTotal[]);
        res.status(200).json(transactionsFormatted);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.get ~ err:", err);
        res.status(500).json({ message: "An error occurred while retrieving transaction" });
    }
});

transactionRoutes.get("/transactions/latest", async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.userId },
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
        const transactionsFormatted = await formatTransactions(transactions as TransactionWithTotal[]);
        res.status(200).json(transactionsFormatted);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.get ~ err:", err);
        res.status(500).json({ message: "An error occurred while retrieving latest transactions" });
    }
});

transactionRoutes.post("/create", async (req, res) => {
    try {
        const { transaction } = req.body;
        const newTransaction = await prisma.transaction.create({
            data: {
                transactionProducts: {
                    createMany: {
                        data: transaction.transactionProducts.map(product => ({
                            productId: product.productId,
                            quantity: product.quantity
                        }))
                    }
                },
                customer: transaction.customer,
                userId: req.userId
            }
        });
        res.status(201).json(newTransaction);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.post ~ err:", err);
        res.status(500).json({ error: "An error occurred while creating the transaction" });
    }
});

transactionRoutes.put("/update", async (req, res) => {
    try {
        const { transactionId, customer, transactionProducts } = req.body;

        if (!transactionId) {
            return res.status(400).json({ error: "Transaction ID is required" });
        }

        const updatedTransaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                customer,
                transactionProducts: {
                    deleteMany: {},
                    create: transactionProducts
                }
            }
        });
        res.status(200).json(updatedTransaction);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.put ~ err:", err);
        res.status(500).json({ error: "An error occurred while updating the transaction" })
    }
});

transactionRoutes.delete("/delete", async (req, res) => {
    try {
        const { transactionId } = req.body;
        const deletedTransaction = await prisma.transaction.delete({
            where: { id: transactionId }
        });
        res.status(200).json({ message: "Transaction deleted successfully", transaction: deletedTransaction });
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.delete ~ err:", err);
        res.status(500).json({ message: "An error ocurred while deleting the transaction" });
    }
});

export default transactionRoutes;