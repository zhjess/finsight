import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const transactionProductRoutes = Router();

const getProductsByIds = async (productIds: string[]) => {
    return await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
        },
    });
};
// format result to include total quantity/revenue for each product
const formatResult = (transactionProducts: any[], products: any[]) => {
    const productMap: { [key: number]: any } = {};

    products.forEach(product => {
        productMap[product.id] = product;
    });

    return transactionProducts.map(item => {
        const product = productMap[item.productId];
        const totalQuantity = item._sum.quantity || 0;
        const totalRevenue = product.price * totalQuantity;

        return {
            product,
            totalQuantity,
            totalRevenue,
        };
    }).sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0)).slice(0, 10);
};

// Route to get transaction products
transactionProductRoutes.get("/transactionproducts/top", async (req: Request, res: Response) => {
    try {
        const transactionProducts = await prisma.transactionProduct.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
        });

        const productIds: string[] = transactionProducts.map(item => item.productId);
        const products = await getProductsByIds(productIds);

        const result = formatResult(transactionProducts, products);
        res.status(200).json(result);
    } catch (err) {
        console.error("Error retrieving transaction products:", err);
        res.status(500).json({ error: "An error occurred while retrieving transaction products" });
    }
});

// transactionProductRoutes.post("/create", async (req, res) => {
//     try {
//         const { transactionId, productId, quantity } = req.body;
//         const newTransactionProduct = await prisma.transactionProduct.create({
//             data: {
//                 transactionId,
//                 productId,
//                 quantity
//             }
//         });
//         res.status(201).json(newTransactionProduct);
//     } catch (err) {
//         console.log("🚀 ~ transactionProductRoutes.post ~ err:", err);
//         res.status(500).json({ error: "An error occurred while creating the transaction product" });
//     }
// });

export default transactionProductRoutes;
