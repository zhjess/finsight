// @ts-ignore
import express from "express";
import prisma from "../prisma/prisma.js";
import { authenticateUser } from "../middleware/userAuth.js";

const productRoutes = express.Router();
productRoutes.use(authenticateUser);

productRoutes.get("/products", async (req: express.Request, res: express.Response) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    try {
        const totalProducts = await prisma.product.count();
        
        const products = await prisma.product.findMany({
            orderBy: { description: 'asc'},
            include: {
                transactionProducts: true
                }
            })
        res.status(200).json({
            products: products,
            totalProducts: totalProducts,
            page,
            totalPages: Math.ceil(totalProducts / limit)

        });
    } catch (err) {
        console.log("🚀 ~ productRoutes.get ~ err:", err)
        res.status(500).json({ message: "An error ocurred while retrieving products" });
    }
});

productRoutes.post("/create", async (req: express.Request, res: express.Response) => {
    try {
        const { description, price, expense } = req.body;
        const newProduct = await prisma.product.create({
            data: {
                description,
                price,
                expense,
            }
        });
        res.status(201).json(newProduct);
    } catch (err) {
        console.log("🚀 ~ productRoutes.post ~ err:", err);
        res.status(500).json({ error: "An error occurred while creating the product" });
    }
});

productRoutes.put("/update/:id", async (req: express.Request, res: express.Response) => {
    try {
        const productId = req.params.id;
        const { description, price, expense } = req.body;
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                description,
                price,
                expense
            }
        });
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.log("🚀 ~ productRoutes.put ~ err:", err);
        res.status(500).json({ error: "An error occurred while updating the product" });
    }
});

productRoutes.delete("/delete/:id", async (req: express.Request, res: express.Response) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await prisma.product.delete({
            where: { id: productId }
        });
        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (err) {
        console.log("🚀 ~ productRoutes.delete ~ err:", err)
        res.status(500).json({ message: "An error ocurred while deleting the product" });
    }
});

export default productRoutes;