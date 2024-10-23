import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

const productList = [
    { description: "Product A", price: 15000, expense: 5000 },
    { description: "Product B", price: 18000, expense: 6000 },
    { description: "Product C", price: 20000, expense: 7000 },
    { description: "Product D", price: 16000, expense: 4000 },
    { description: "Product E", price: 17000, expense: 4500 },
    { description: "Product F", price: 25000, expense: 8000 },
    { description: "Product G", price: 22000, expense: 7500 },
    { description: "Product H", price: 21000, expense: 6500 },
    { description: "Product I", price: 30000, expense: 9000 },
    { description: "Product J", price: 32000, expense: 9500 },
    { description: "Product K", price: 28000, expense: 8500 },
    { description: "Product L", price: 24000, expense: 7000 },
    { description: "Product M", price: 26000, expense: 7200 },
    { description: "Product N", price: 35000, expense: 10000 },
    { description: "Product O", price: 33000, expense: 9800 },
    { description: "Product P", price: 38000, expense: 11000 },
    { description: "Product Q", price: 40000, expense: 12000 },
    { description: "Product R", price: 42000, expense: 13000 },
    { description: "Product S", price: 45000, expense: 14000 },
    { description: "Product T", price: 50000, expense: 15000 },
];

async function main() {
    // Clear existing data
    await prisma.transactionProduct.deleteMany({});
    await prisma.expenseTransaction.deleteMany({});
    await prisma.revenueTransaction.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.expenseCategory.deleteMany({});
    await prisma.expenseType.deleteMany({});
    await prisma.kpi.deleteMany({});
    await prisma.day.deleteMany({});
    await prisma.month.deleteMany({});

    // Create Users
    const hashedPassword = await hashPassword("password");
    const user = await prisma.user.create({
        data: {
            email: "user@example.com",
            password: hashedPassword,
        },
    });

    // Create Products
    const products = await Promise.all(
        productList.map(product => 
            prisma.product.create({
                data: {
                    description: product.description,
                    price: product.price,
                    expense: product.expense
                },
            })
        )
    );

    // Create Expense Types
    const operationalExpenseType = await prisma.expenseType.create({
        data: { description: "Operational" },
    });

    const nonOperationalExpenseType = await prisma.expenseType.create({
        data: { description: "Non-Operational" },
    });

    // Create Expense Categories
    const expenseCategories = await Promise.all([
        "Salaries",
        "Services",
        "Cost of goods sold",
        "Utilities",
        "Interest expense" // non-operating
    ].map(async (description) => {
        const expenseTypeId = description === "Interest expense" ? nonOperationalExpenseType.id : operationalExpenseType.id;

        return prisma.expenseCategory.create({ 
            data: { 
                description, 
                expenseTypeId 
            } 
        });
    }));

    // Function to generate data for a given year
    const generateYearData = async (year: number) => {
        let totalRevenue = 0;
        let totalExpenses = 0;
        const expensesByCategory: { [key: string]: number } = {};
        
        for (let day = 1; day <= 365; day++) {
            const date = new Date(year, 0, day); // January 1 to December 31 of the specified year

            // Generate random revenue and expense data with an increasing trend
            const revenueAmount = Math.floor(Math.random() * 8000) + 20000; // Random revenue amount between 20,000 and 28,000
            const expenseAmount = Math.floor(Math.random() * 7000) + 10000; // Random expense amount between 10,000 and 17,000

            totalRevenue += revenueAmount;
            totalExpenses += expenseAmount;

            // Assign expense to a random category
            const categoryIndex = Math.floor(Math.random() * expenseCategories.length);
            const expenseCategory = expenseCategories[categoryIndex].description;
            expensesByCategory[expenseCategory] = (expensesByCategory[expenseCategory] || 0) + expenseAmount;

            // Create daily data
            const dayEntry = await prisma.day.create({
                data: {
                    date,
                    revenue: revenueAmount,
                    expenses: expenseAmount,
                },
            });

            // Create Revenue Transaction
            await prisma.revenueTransaction.create({
                data: {
                    date,
                    customer: `Customer ${day}`,
                    userId: user.id,
                    transactionProducts: {
                        create: [
                            {
                                productId: products[day % products.length].id,
                                quantity: Math.floor(Math.random() * 5) + 1, // Random quantity
                            },
                        ],
                    },
                },
            });

            // Create Expense Transaction
            await prisma.expenseTransaction.create({
                data: {
                    date,
                    counterparty: `Counterparty ${day}`,
                    userId: user.id,
                    amount: expenseAmount,
                    expenseCategoryId: expenseCategories[categoryIndex].id,
                },
            });
        }

        // Create KPI
        const kpi = await prisma.kpi.create({
            data: {
                totalProfit: totalRevenue - totalExpenses,
                totalRevenue,
                totalExpenses,
                expensesByCategory,
                userId: user.id,
            },
        });

        // Update Day entries with kpiId
        await prisma.day.updateMany({
            where: {},
            data: {
                kpiId: kpi.id,
            },
        });

        // Create Monthly Data
        for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 0); // Last day of the month

            // Calculate monthly totals
            const monthlyRevenue = await prisma.day.aggregate({
                _sum: {
                    revenue: true,
                },
                where: {
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
            });

            const monthlyExpenses = await prisma.day.aggregate({
                _sum: {
                    expenses: true,
                },
                where: {
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
            });

            // Calculate operational and non-operational expenses
            const operationalExpenses = await prisma.expenseTransaction.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                    expenseCategory: {
                        expenseTypeId: operationalExpenseType.id,
                    },
                },
            });

            const nonOperationalExpenses = await prisma.expenseTransaction.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                    expenseCategory: {
                        expenseTypeId: nonOperationalExpenseType.id,
                    },
                },
            });

            // Create Monthly Data
            await prisma.month.create({
                data: {
                    date: startOfMonth,
                    revenue: monthlyRevenue._sum.revenue || 0,
                    expenses: monthlyExpenses._sum.expenses || 0,
                    operationalExpenses: operationalExpenses._sum.amount || 0,
                    nonOperationalExpenses: nonOperationalExpenses._sum.amount || 0,
                    kpiId: kpi.id, // Link to the created KPI
                },
            });
        }
    };

    // Generate data for 2022 and 2023
    await generateYearData(2022);
    await generateYearData(2023);

    console.log("Seed data generated for 2022 and 2023!");
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
