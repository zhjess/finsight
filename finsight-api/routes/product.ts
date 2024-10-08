import express from "express";
import prisma from "../prisma/prisma";

const productRoutes = express.Router();

productRoutes.get("/products", async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { description: 'asc'}
        });

        // Dispaly transactions as part of product
        const productsWithTransactions = await Promise.all(
            products.map(async (product) => {
                const transactionProducts = await prisma.transactionProduct.findMany({
                    where: { product: { id: product.id } }
                });
                return {
                    ...product,
                    transactionProducts,
                };
            })
        );
        res.status(200).json(productsWithTransactions);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
});

export default productRoutes;