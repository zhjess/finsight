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
        console.log("🚀 ~ productRoutes.get ~ err:", err)
        res.status(500).json({ message: "An error ocurred while retrieving products" });
    }
});

productRoutes.post("/create", async (req, res) => {
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

productRoutes.put("/update", async (req, res) => {
    try {
        const { productId, description, price, expense } = req.body;
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

productRoutes.delete("/delete", async (req, res) => {
    try {
        const { productId } = req.body;
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