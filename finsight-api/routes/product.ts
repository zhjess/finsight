import express from "express";
import prisma from "../prisma/prisma";

const productRoutes = express.Router();

productRoutes.get("/products", async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { description: 'asc'},
            include: {
                transactionProducts: true
                }
            })
        res.status(200).json(products);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
});

export default productRoutes;