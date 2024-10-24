// @ts-ignore
import express from "express";
import prisma from "../prisma/prisma.js";
import { authenticateUser } from "../middleware/userAuth.js";
import { RevenueTransaction, TransactionProduct } from "@prisma/client";

const transactionRoutes = express.Router();
transactionRoutes.use(authenticateUser);

interface RevenueTransactionWithTotal extends RevenueTransaction {
    transactionProducts: TransactionProduct[];
    transactionTotal?: number;
}

interface Product {
    productId: string;
    quantity: number;
}

const formatTransactions = async (transactions: RevenueTransactionWithTotal[]): Promise<RevenueTransactionWithTotal[]> => {
    return Promise.all(transactions.map(async transaction => {
        const productPrices = await Promise.all(transaction.transactionProducts.map(async product => {
            const p = await prisma.product.findFirst({ where: { id: product.productId } });
            return p ? p.price * product.quantity : 0; // if product not found, return 0
        }));
        
        const transactionTotal = productPrices.reduce((total, price) => total + price, 0);
        
        return { ...transaction, transactionTotal };
    }));
} 
// Search by transaction id (revenue or expense)
transactionRoutes.get("/:id", async (req: express.Request, res: express.Response) => {
    try {
        const transactionId = req.params.id;
        
        const revenueTransaction = await prisma.revenueTransaction.findUnique({
            where: { id: transactionId },
            include: {
                transactionProducts: {
                    include: {
                        product: true
                    },
                },
            },
        });
        if (revenueTransaction) {
            const revenueTransactionsFormatted = await formatTransactions([revenueTransaction] as RevenueTransactionWithTotal[]);
            return res.status(200).json(revenueTransactionsFormatted);
        }

        const expenseTransaction = await prisma.expenseTransaction.findUnique({
            where: { id: transactionId },
            include: {
                expenseCategory: {
                    select: {
                        description: true
                    },
                },
            },
        });
        if (expenseTransaction) {
            return res.status(200).json(expenseTransaction);
        }
        res.status(404).json({ message: "Transaction not found" });
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.get ~ err:", err);
        res.status(500).json({ message: "An error occurred while retrieving transaction" });
    }
});

// REVENUE TRANSACTIONS
// Get all revenue transactions
transactionRoutes.get("/transactions/revenue", async (req: express.Request, res: express.Response) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    try {
        const totalTransactions = await prisma.revenueTransaction.count({
            where: { userId: req.userId }
        });
        
        const transactions = await prisma.revenueTransaction.findMany({
            where: { userId: req.userId },
            orderBy: { date: 'desc' },
            skip: offset,
            take: limit,
            include: {
                transactionProducts: {
                    select: {
                        productId: true,
                        quantity: true
                    }
                }
            }
        });
        const transactionsFormatted = await formatTransactions(transactions as RevenueTransactionWithTotal[]);
        res.status(200).json({
            transactions: transactionsFormatted,
            totalTransactions: totalTransactions,
            page,
            totalPages: Math.ceil(totalTransactions / limit)
        });
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.get ~ err:", err);
        res.status(500).json({ message: "An error occurred while retrieving transactions" });
    }
});

// Get X most recent revenue transactions
transactionRoutes.get("/transactions/revenue/latest/:limit", async (req: express.Request, res: express.Response) => {
    try {
        const limit = req.params.limit;
        const transactions = await prisma.revenueTransaction.findMany({
            where: { userId: req.userId },
            take: Number(limit),
            orderBy: { date: 'desc'},
            include: {
                transactionProducts: {
                    select: {
                        productId: true,
                        quantity: true
                    }
                }
            }
        });
        const transactionsFormatted = await formatTransactions(transactions as RevenueTransactionWithTotal[]);
        res.status(200).json(transactionsFormatted);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.get ~ err:", err);
        res.status(500).json({ message: "An error occurred while retrieving latest transactions" });
    }
});

// Create revenue transaction
transactionRoutes.post("/revenue/create", async (req: express.Request, res: express.Response) => {
    try {
        const { date, transactionProducts, customer } = req.body;
        const newTransaction = await prisma.revenueTransaction.create({
            data: {
                transactionProducts: {
                    createMany: {
                        data: transactionProducts.map((product: Product) => ({
                            productId: product.productId,
                            quantity: product.quantity
                        }))
                    }
                },
                date: new Date(date).toISOString(),
                customer,
                userId: req.userId
            },
            include: {
                transactionProducts: true
            }
        });
        res.status(201).json(newTransaction);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.post ~ err:", err);
        res.status(500).json({ error: "An error occurred while creating the transaction" });
    }
});

// Update revenue transaction
transactionRoutes.put("/revenue/update/:id", async (req: express.Request, res: express.Response) => {
    try {
        const transactionId = req.params.id;
        const { date, customer, transactionProducts } = req.body;

        const updatedTransaction = await prisma.revenueTransaction.update({
            where: { id: transactionId },
            data: {
                date,
                customer,
                transactionProducts: {
                    deleteMany: {},
                    create: transactionProducts
                }
            },
            include: {
                transactionProducts: true,
            }
        });
        res.status(200).json(updatedTransaction);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.put ~ err:", err);
        res.status(500).json({ error: "An error occurred while updating the transaction" })
    }
});

// Delete revenue transaction
transactionRoutes.delete("/revenue/delete/:id", async (req: express.Request, res: express.Response) => {
    try {
        const transactionId = req.params.id;
        const deletedTransaction = await prisma.revenueTransaction.delete({
            where: { id: transactionId },
            include: {
                transactionProducts: true
            }
        });
        res.status(200).json({ message: "Transaction deleted successfully", transaction: deletedTransaction });
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.delete ~ err:", err);
        res.status(500).json({ message: "An error ocurred while deleting the transaction" });
    }
});

// EXPENSE TRANSACTION
// Get all expense transactions
transactionRoutes.get("/transactions/expense", async (req: express.Request, res: express.Response) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    try {
        const totalTransactions = await prisma.expenseTransaction.count({
            where: { userId: req.userId }
        });

        const transactions = await prisma.expenseTransaction.findMany({
            where: { userId: req.userId },
            orderBy: { date: 'desc' },
            include: {
                expenseCategory: {
                    select: {
                        description: true,
                    },
                },
            },
        });
        res.status(200).json({
            transactions: transactions,
            totalTransactions: totalTransactions,
            page,
            totalPages: Math.ceil(totalTransactions / limit)
        });
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.get ~ err:", err);
        res.status(500).json({ message: "An error occurred while retrieving transactions" });
    }
});

// Get all expense categories
transactionRoutes.get("/transactions/expense/categories", async (req: express.Request, res: express.Response) => {
    try {
        const categories = await prisma.expenseCategory.findMany({
            include: {
                expenseType: {
                    select: {
                        description: true,
                    },
                },
            },
        });
        res.status(200).json(categories);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.get ~ err:", err)
        res.status(500).json({ message: "An error occurred while retrieving expense categories" });
    }
});

// Get all expense transactions for specified category
transactionRoutes.get("/transactions/expense/category/:id", async (req: express.Request, res: express.Response) => {
    try {
        const { expenseCategoryId } = req.params.id;
    
        const transactions = await prisma.expenseTransaction.findMany({
            where: {
                userId: req.userId,
                expenseCategoryId
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(transactions);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.get ~ err:", err);
        res.status(500).json({ message: "An error occurred while retrieving transactions" });
    }
});

// Create expense transaction
transactionRoutes.post("/expense/create", async (req: express.Request, res: express.Response) => {
    try {
        const { date, counterparty, amount, expenseCategoryId } = req.body;
        const newTransaction = await prisma.expenseTransaction.create({
            data: {
                date: new Date(date).toISOString(),
                counterparty,
                amount,
                expenseCategoryId,
                userId: req.userId
            },
            include: {
                expenseCategory: {
                    select: {
                        description: true,
                    },
                },
            }
        })
        res.status(201).json(newTransaction);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.post ~ err:", err);
        res.status(500).json({ error: "An error occurred while creating the transaction" });
    }
});

// Update expense transaction
transactionRoutes.put("/expense/update/:id", async (req: express.Request, res: express.Response) => {
    try {
        const transactionId = req.params.id;
        const { date, counterparty, amount, expenseCategoryId } = req.body;

        const updatedTransaction = await prisma.expenseTransaction.update({
            where: { id: transactionId },
            data: {
                date,
                counterparty,
                amount,
                expenseCategoryId
            },
            include: {
                expenseCategory: {
                    select: {
                        description: true,
                    },
                },
            }
        });
        res.status(200).json(updatedTransaction);
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.put ~ err:", err);
        res.status(500).json({ error: "An error occurred while updating the transaction" })
    }
});

// Delete expense transaction
transactionRoutes.delete("/expense/delete/:id", async (req: express.Request, res: express.Response) => {
    try {
        const transactionId = req.params.id;
        const deletedTransaction = await prisma.expenseTransaction.delete({
            where: { id: transactionId },
            include: {
                expenseCategory: {
                    select: {
                        description: true,
                    },
                },
            }
        });
        res.status(200).json({ message: "Transaction deleted successfully", transaction: deletedTransaction });
    } catch (err) {
        console.log("🚀 ~ transactionRoutes.delete ~ err:", err);
        res.status(500).json({ message: "An error ocurred while deleting the transaction" });
    }
});


export default transactionRoutes;