import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hashPassword = async function(password: string, saltRounds: number) {
    return await bcrypt.hash(password, saltRounds);
};

const productList = [
    { description: 'Product A', price: 7000, expense: 3054 },
    { description: 'Product B', price: 9050, expense: 4000 },
    { description: 'Product C', price: 8000, expense: 3500 },
    { description: 'Product D', price: 6000, expense: 2500 },
    { description: 'Product E', price: 8095, expense: 3500 },
    { description: 'Product F', price: 7500, expense: 2800 },
    { description: 'Product G', price: 3000, expense: 1200 },
    { description: 'Product H', price: 4050, expense: 1500 },
    { description: 'Product I', price: 6500, expense: 7595 },
    { description: 'Product J', price: 9040, expense: 4000 },
    { description: 'Product K', price: 8580, expense: 3700 },
    { description: 'Product L', price: 7200, expense: 3100 },
    { description: 'Product M', price: 9500, expense: 4500 },
    { description: 'Product N', price: 11000, expense: 5025 },
    { description: 'Product O', price: 6800, expense: 2910 },
    { description: 'Product P', price: 7400, expense: 3300 },
    { description: 'Product Q', price: 6200, expense: 2415 },
    { description: 'Product R', price: 8060, expense: 3600 },
    { description: 'Product S', price: 7700, expense: 3200 },
    { description: 'Product T', price: 9695, expense: 4625 },
    { description: 'Product U', price: 9000, expense: 4200 },
    { description: 'Product V', price: 5400, expense: 2340 },
    { description: 'Product W', price: 8950, expense: 4155 },
    { description: 'Product X', price: 7200, expense: 3065 },
    { description: 'Product Y', price: 7500, expense: 3500 },
    { description: 'Product Z', price: 10000, expense: 4895 },
];

async function main() {
    await prisma.transactionProduct.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.day.deleteMany({});
    await prisma.month.deleteMany({});
    await prisma.kpi.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    const createTransactionProduct = (product, quantity) => ({
        product: {
            create: {
                description: product.description,
                price: product.price,
                expense: product.expense,
            },
        },
        quantity,
    });

    const createTransaction = (customer, transactionProducts) => ({
        customer,
        transactionProducts: {
            create: transactionProducts,
        },
    });

    const transactions1 = [
        createTransaction('Customer A', [
            createTransactionProduct(productList[0], 1),
            createTransactionProduct(productList[1], 1),
            createTransactionProduct(productList[2], 3),
            createTransactionProduct(productList[3], 3),
            createTransactionProduct(productList[4], 3),
        ]),
        createTransaction('Customer B', [
            createTransactionProduct(productList[5], 1),
            createTransactionProduct(productList[6], 1),
            createTransactionProduct(productList[7], 2),
            createTransactionProduct(productList[8], 5),
            createTransactionProduct(productList[9], 1),
        ]),
        createTransaction('Customer C', [
            createTransactionProduct(productList[10], 5),
            createTransactionProduct(productList[11], 1),
        ]),
        createTransaction('Customer D', [
            createTransactionProduct(productList[12], 2),
            createTransactionProduct(productList[13], 1),
        ]),
        createTransaction('Customer E', [
            createTransactionProduct(productList[14], 8),
            createTransactionProduct(productList[15], 1),
        ]),
        createTransaction('Customer F', [
            createTransactionProduct(productList[16], 2),
        ]),
        createTransaction('Customer G', [
            createTransactionProduct(productList[18], 4),
        ]),
        createTransaction('Customer H', [
            createTransactionProduct(productList[19], 2),
        ]),
        createTransaction('Customer I', [
            createTransactionProduct(productList[20], 2),
        ]),
    ];

    const transactions2 = [
        createTransaction('Customer I', [
            createTransactionProduct(productList[22], 5),
        ]),
        createTransaction('Customer J', [
            createTransactionProduct(productList[23], 3),
            createTransactionProduct(productList[24], 6),
        ]),
        createTransaction('Customer K', [
            createTransactionProduct(productList[25], 2),
        ]),
    ];

    const hashedPassword1 = await hashPassword("password1", 10);
    const user1 = await prisma.user.create({
        data: {
            email: 'user1@email.com',
            password: hashedPassword1,
            transactions: {
                create: transactions1,
            },
        },
    });

    const hashedPassword2 = await hashPassword("password2", 10);
    const user2 = await prisma.user.create({
        data: {
            email: 'user2@email.com',
            password: hashedPassword2,
            transactions: {
                create: transactions2,
            },
        },
    });

    // Calculate total revenue and expenses
    const calculateTotals = (transactions) => {
        let totalRevenue = 0;
        let totalExpenses = 0;

        transactions.forEach(transaction => {
            transaction.transactionProducts.create.forEach(tp => {
                totalRevenue += tp.product.create.price * tp.quantity;
                totalExpenses += tp.product.create.expense * tp.quantity;
            });
        });

        return { totalRevenue, totalExpenses };
    };

    const { totalRevenue: revenue1, totalExpenses: expenses1 } = calculateTotals(transactions1);
    const { totalRevenue: revenue2, totalExpenses: expenses2 } = calculateTotals(transactions2);

    const totalRevenue = revenue1 + revenue2;
    const totalExpenses = expenses1 + expenses2;

    console.log(`Total Revenue from Transactions: ${totalRevenue}`);
    console.log(`Total Expenses from Transactions: ${totalExpenses}`);

    const kpi = await prisma.kpi.create({
        data: {
            totalProfit: totalRevenue - totalExpenses,
            totalRevenue: totalRevenue,
            totalExpenses: totalExpenses,
            expensesByCategory: {
                supplies: 120000,
                salaries: 140000,
                services: 90000,
            },
            userId: user1.id,
        },
    });

    const currentYear = new Date().getFullYear();

    for (let month = 0; month < 12; month++) {
        const baseRevenue = 600000 + Math.floor(Math.random() * 200000);
        const baseExpenses = 300000 + Math.floor(Math.random() * 100000);

        const monthlyRevenue = baseRevenue + Math.floor(Math.random() * 50000) - 20000;
        const monthlyExpenses = baseExpenses + Math.floor(Math.random() * 50000) - 20000;

        await prisma.month.create({
            data: {
                date: new Date(currentYear, month, 1),
                revenue: Math.max(monthlyRevenue, 0),
                expenses: Math.max(monthlyExpenses, 0),
                operationalExpenses: Math.floor(Math.random() * 200000) + 100000,
                nonOperationalExpenses: Math.floor(Math.random() * 50000) + 50000,
                kpiId: kpi.id,
            },
        });

        for (let day = 1; day <= 30; day++) {
            if (day > 28 && month === 1) break;
            if (day > 30 && [3, 5, 8, 10].includes(month)) break;

            const dailyRevenue = 25000 + Math.floor(Math.random() * 20000);
            const dailyExpenses = Math.min(dailyRevenue, 20000 + Math.floor(Math.random() * 10000));

            await prisma.day.create({
                data: {
                    date: new Date(currentYear, month, day),
                    revenue: dailyRevenue,
                    expenses: dailyExpenses,
                    kpiId: kpi.id,
                },
            });
        }
    }

    console.log({ user1, user2, kpi });
};

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
