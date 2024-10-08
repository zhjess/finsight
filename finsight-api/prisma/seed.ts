import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hashPassword = async function(password: string, saltRounds: number) {
    return await bcrypt.hash(password, saltRounds);
};

const productList = [
    { description: 'Product A', price: 7000, expense: 3000 },
    { description: 'Product B', price: 9000, expense: 4000 },
    { description: 'Product C', price: 8000, expense: 3500 },
    { description: 'Product D', price: 6000, expense: 2500 },
    { description: 'Product E', price: 8000, expense: 3500 },
    { description: 'Product F', price: 7500, expense: 2800 },
    { description: 'Product G', price: 3000, expense: 1200 },
    { description: 'Product H', price: 4000, expense: 1500 },
    { description: 'Product I', price: 6500, expense: 7500 },
    { description: 'Product J', price: 9000, expense: 4000 },
    { description: 'Product K', price: 8500, expense: 3700 },
    { description: 'Product L', price: 7200, expense: 3100 },
    { description: 'Product M', price: 9500, expense: 4500 },
    { description: 'Product N', price: 11000, expense: 5000 },
    { description: 'Product O', price: 6800, expense: 2900 },
    { description: 'Product P', price: 7400, expense: 3300 },
    { description: 'Product Q', price: 6200, expense: 2400 },
    { description: 'Product R', price: 8000, expense: 3600 },
    { description: 'Product S', price: 7700, expense: 3200 },
    { description: 'Product T', price: 9600, expense: 4600 },
    { description: 'Product U', price: 9000, expense: 4200 },
    { description: 'Product V', price: 5400, expense: 2300 },
    { description: 'Product W', price: 8900, expense: 4100 },
    { description: 'Product X', price: 7200, expense: 3000 },
    { description: 'Product Y', price: 7500, expense: 3500 },
    { description: 'Product Z', price: 10000, expense: 4800 },
];

async function main() {
    await prisma.transactionProduct.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.day.deleteMany({});
    await prisma.month.deleteMany({});
    await prisma.kpi.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    // Create sample users
    const hashedPassword1 = await hashPassword("password1", 10);
    const user1 = await prisma.user.create({
        data: {
            email: 'user1@email.com',
            password: hashedPassword1,
            transactions: {
                create: [
                    {
                        customer: 'Customer A',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[0].description,
                                            price: productList[0].price,
                                            expense: productList[0].expense
                                        },
                                    },
                                    quantity: 1,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[1].description,
                                            price: productList[1].price,
                                            expense: productList[1].expense
                                        },
                                    },
                                    quantity: 1,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[2].description,
                                            price: productList[2].price,
                                            expense: productList[2].expense
                                        },
                                    },
                                    quantity: 3,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[3].description,
                                            price: productList[3].price,
                                            expense: productList[3].expense
                                        },
                                    },
                                    quantity: 3,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[4].description,
                                            price: productList[4].price,
                                            expense: productList[4].expense
                                        },
                                    },
                                    quantity: 3,
                                },
                            ],
                        },
                    },
                    {
                        customer: 'Customer B',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[5].description,
                                            price: productList[5].price,
                                            expense: productList[5].expense
                                        },
                                    },
                                    quantity: 1,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[6].description,
                                            price: productList[6].price,
                                            expense: productList[6].expense
                                        },
                                    },
                                    quantity: 1,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[7].description,
                                            price: productList[7].price,
                                            expense: productList[7].expense
                                        },
                                    },
                                    quantity: 2,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[8].description,
                                            price: productList[8].price,
                                            expense: productList[8].expense
                                        },
                                    },
                                    quantity: 5,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[9].description,
                                            price: productList[9].price,
                                            expense: productList[9].expense
                                        },
                                    },
                                    quantity: 1,
                                },
                            ],
                        },
                    },
                    {
                        customer: 'Customer C',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[10].description,
                                            price: productList[10].price,
                                            expense: productList[10].expense
                                        },
                                    },
                                    quantity: 5,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[11].description,
                                            price: productList[11].price,
                                            expense: productList[11].expense
                                        },
                                    },
                                    quantity: 1,
                                }
                            ],
                        },
                    },
                    {
                        customer: 'Customer C',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[12].description,
                                            price: productList[12].price,
                                            expense: productList[12].expense
                                        },
                                    },
                                    quantity: 2,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[13].description,
                                            price: productList[13].price,
                                            expense: productList[13].expense
                                        },
                                    },
                                    quantity: 1,
                                }
                            ],
                        },
                    },
                    {
                        customer: 'Customer D',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[14].description,
                                            price: productList[14].price,
                                            expense: productList[14].expense
                                        },
                                    },
                                    quantity: 8,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[15].description,
                                            price: productList[15].price,
                                            expense: productList[15].expense
                                        },
                                    },
                                    quantity: 1,
                                }
                            ],
                        },
                    },
                    {
                        customer: 'Customer E',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[16].description,
                                            price: productList[16].price,
                                            expense: productList[16].expense
                                        },
                                    },
                                    quantity: 2,
                                }
                            ],
                        },
                    },
                    {
                        customer: 'Customer F',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[18].description,
                                            price: productList[18].price,
                                            expense: productList[18].expense
                                        },
                                    },
                                    quantity: 4,
                                }
                            ],
                        },
                    },
                    {
                        customer: 'Customer G',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[19].description,
                                            price: productList[19].price,
                                            expense: productList[19].expense
                                        },
                                    },
                                    quantity: 2,
                                }
                            ],
                        },
                    },
                    {
                        customer: 'Customer H',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[20].description,
                                            price: productList[20].price,
                                            expense: productList[20].expense
                                        },
                                    },
                                    quantity: 2,
                                },
                            ],
                        },
                    },
                    {
                        customer: 'Customer I',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[21].description,
                                            price: productList[23].price,
                                            expense: productList[23].expense
                                        },
                                    },
                                    quantity: 2,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[22].description,
                                            price: productList[24].price,
                                            expense: productList[24].expense
                                        },
                                    },
                                    quantity: 3,
                                },
                            ],
                        },
                    },
                    {
                        customer: 'Customer J',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[23].description,
                                            price: productList[23].price,
                                            expense: productList[23].expense
                                        },
                                    },
                                    quantity: 4,
                                },
                                {
                                    product: {
                                        create: {
                                            description: productList[24].description,
                                            price: productList[24].price,
                                            expense: productList[24].expense
                                        },
                                    },
                                    quantity: 2,
                                },
                            ],
                        },
                    },
                    {
                        customer: 'Customer K',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: productList[25].description,
                                            price: productList[25].price,
                                            expense: productList[25].expense
                                        },
                                    },
                                    quantity: 10,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    const hashedPassword2 = await hashPassword("password2", 10);
    const user2 = await prisma.user.create({
        data: {
            email: 'user2@email.com',
            password: hashedPassword2,
            transactions: {
                create: [
                    {
                        customer: 'Customer B',
                        transactionProducts: {
                            create: [
                                {
                                    product: {
                                        create: {
                                            description: 'Product X',
                                            price: 8000, // $80.00
                                            expense: 3500, // $35.00
                                        },
                                    },
                                    quantity: 5,
                                },
                                {
                                    product: {
                                        create: {
                                            description: 'Product X',
                                            price: 6000, // $60.00
                                            expense: 2500, // $25.00
                                        },
                                    },
                                    quantity: 2,
                                },
                                {
                                    product: {
                                        create: {
                                            description: 'Product X',
                                            price: 9000, // $40.00
                                            expense: 6500, // $18.00
                                        },
                                    },
                                    quantity: 6,
                                },
                                {
                                    product: {
                                        create: {
                                            description: 'Product X',
                                            price: 6500, // $65.00
                                            expense: 3200, // $27.00
                                        },
                                    },
                                    quantity: 1,
                                },
                                {
                                    product: {
                                        create: {
                                            description: 'Product X',
                                            price: 9000, // $90.00
                                            expense: 4000, // $40.00
                                        },
                                    },
                                    quantity: 1,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    // Create KPI data
    const kpi = await prisma.kpi.create({
        data: {
            totalProfit: 300000, // $3,000.00
            totalRevenue: 600000, // $6,000.00
            totalExpenses: 300000, // $3,000.00
            expensesByCategory: {
                category1: 150000, // $1,500.00
                category2: 150000, // $1,500.00
            },
            userId: user1.id,
        },
    });

    // Create monthly data for every month of the year
    const currentYear = new Date().getFullYear();

    for (let month = 0; month < 12; month++) {
        const baseRevenue = 600000 + Math.floor(Math.random() * 50000); // Base revenue between $6,000.00 and $6,500.00
        const baseExpenses = 400000 + Math.floor(Math.random() * 50000); // Base expenses between $4,000.00 and $4,500.00

        // Introduce more fluctuations for monthly profit
        const monthlyRevenue = baseRevenue + Math.floor(Math.random() * 200000) - 100000; // Fluctuations between -$1,000.00 and +$1,000.00
        const monthlyExpenses = baseExpenses + Math.floor(Math.random() * 100000) - 50000; // Fluctuations between -$500.00 and +$500.00

        const monthEntry = await prisma.month.create({
            data: {
                date: new Date(currentYear, month, 1), // First day of each month
                revenue: Math.max(monthlyRevenue, 0), // Ensure positive revenue
                expenses: Math.max(monthlyExpenses, 0), // Ensure positive expenses
                operationalExpenses: Math.floor(Math.random() * 300000) + 200000, // Between $2,000.00 and $5,000.00
                nonOperationalExpenses: Math.floor(Math.random() * 100000) + 50000, // Between $500.00 and $1,500.00
                kpiId: kpi.id,
            },
        });

        // Create some daily data for each month
        for (let day = 1; day <= 30; day++) {
            if (day > 28 && month === 1) break; // Skip February for 29/30
            if (day > 30 && [3, 5, 8, 10].includes(month)) break; // Skip April, June, September, November for 31

            const dailyRevenue = 25000 + Math.floor(Math.random() * 20000); // Daily revenue between $250.00 and $450.00
            const dailyExpenses = 15000 + Math.floor(Math.random() * 10000); // Daily expenses between $150.00 and $250.00

            await prisma.day.create({
                data: {
                    date: new Date(currentYear, month, day),
                    revenue: dailyRevenue, // stored in cents
                    expenses: dailyExpenses, // stored in cents
                    kpiId: kpi.id,
                },
            });
        }
    }
    console.log({ user1, kpi });
};

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });