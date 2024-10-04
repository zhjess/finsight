import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hashPassword = async function(password: string, saltRounds: number) {
    return await bcrypt.hash(password, saltRounds);
};

async function main() {
    // Drop all existing records
    await prisma.day.deleteMany({});
    await prisma.month.deleteMany({});
    await prisma.kpi.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.user.deleteMany({});

    // Create users with sample data
    const users = await Promise.all(
        Array.from({ length: 10 }).map(async (_, index) => { // Increased user count
            const hashedPassword = await hashPassword(`password${index + 1}`, 10);
            return prisma.user.create({
                data: {
                    email: `user${index + 1}@example.com`,
                    password: hashedPassword,
                    transactions: {
                        create: Array.from({ length: 5 }).map(() => ({ // Increased transaction count
                            amount: Math.round(Math.random() * 3000000) + 200000, // Random amount between $2,000 and $30,000 in cents
                            products: {
                                create: Array.from({ length: 3 }).map(() => ({ // Increased product count
                                    price: Math.round(Math.random() * 6000000) + 100000, // Random price between $1,000 and $60,000 in cents
                                    expense: Math.round(Math.random() * 800000) + 20000, // Random expense between $200 and $8,000 in cents
                                })),
                            },
                        })),
                    },
                    kpis: {
                        create: {
                            totalProfit: Math.round(Math.random() * 5000000) + 1000000, // Random profit between $10,000 and $50,000 in cents
                            totalRevenue: Math.round(Math.random() * 30000000) + 10000000, // Random revenue between $100,000 and $300,000 in cents
                            totalExpenses: Math.round(Math.random() * 5000000) + 1000000, // Random expenses between $10,000 and $50,000 in cents
                            expensesByCategory: {
                                salaries: Math.round(Math.random() * 2000000) + 500000, 
                                supplies: Math.round(Math.random() * 800000) + 200000,
                                marketing: Math.round(Math.random() * 1000000) + 300000,
                                rent: Math.round(Math.random() * 1000000) + 400000,
                                utilities: Math.round(Math.random() * 600000) + 100000,
                                insurance: Math.round(Math.random() * 400000) + 100000,
                                miscellaneous: Math.round(Math.random() * 400000) + 20000,
                            },
                            monthlyData: {
                                create: Array.from({ length: 12 }).map((_, monthIndex) => {
                                    const date = new Date();
                                    date.setMonth(date.getMonth() - monthIndex);
                                    date.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()); // Set to end of month
                                    return {
                                        date: date, // End of the month
                                        revenue: Math.round(Math.random() * 5000000) + 2000000, // Random revenue between $20,000 and $50,000 in cents
                                        expenses: Math.round(Math.random() * 2000000) + 500000, // Random expenses between $5,000 and $20,000 in cents
                                        operationalExpenses: Math.round(Math.random() * 1000000) + 100000, // Random operational expenses between $1,000 and $10,000 in cents
                                        nonOperationalExpenses: Math.round(Math.random() * 500000) + 50000, // Random non-operational expenses between $500 and $5,000 in cents
                                    };
                                }),
                            },
                            dailyData: {
                                create: Array.from({ length: 30 }).map((_, dayIndex) => ({
                                    date: new Date(new Date().setDate(new Date().getDate() - dayIndex)), // Last 30 days
                                    revenue: Math.round(Math.random() * 20000) + 5000, // Random daily revenue between $50 and $200 in cents
                                    expenses: Math.round(Math.random() * 10000) + 1000, // Random daily expenses between $10 and $100 in cents
                                })),
                            },
                        },
                    },
                },
            });
        })
    );
    console.log(`Seeded ${users.length} users with their data.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });