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
        Array.from({ length: 10 }).map(async (_, index) => { // User count
            const hashedPassword = await hashPassword(`password${index + 1}`, 10);
            return prisma.user.create({
                data: {
                    email: `user${index + 1}@example.com`,
                    password: hashedPassword,
                    transactions: {
                        create: Array.from({ length: 5 }).map(() => ({
                            amount: Math.round(Math.random() * 3500000) + 250000, // Random amount between $2,500 and $35,000 in cents
                            products: {
                                create: Array.from({ length: 3 }).map(() => ({
                                    price: Math.round(Math.random() * 6500000) + 150000, // Random price between $1,500 and $65,000 in cents
                                    expense: Math.round(Math.random() * 900000) + 30000, // Random expense between $300 and $9,000 in cents
                                })),
                            },
                        })),
                    },
                    kpis: {
                        create: {
                            totalProfit: Math.round(Math.random() * 6000000) + 1200000, // Random profit between $12,000 and $60,000 in cents
                            totalRevenue: Math.round(Math.random() * 35000000) + 11000000, // Random revenue between $110,000 and $350,000 in cents
                            totalExpenses: Math.round(Math.random() * 6000000) + 1200000, // Random expenses between $12,000 and $60,000 in cents
                            expensesByCategory: {
                                salaries: Math.round(Math.random() * 2200000) + 600000,
                                supplies: Math.round(Math.random() * 850000) + 250000,
                                marketing: Math.round(Math.random() * 1100000) + 400000,
                                rent: Math.round(Math.random() * 1100000) + 500000,
                                utilities: Math.round(Math.random() * 700000) + 150000,
                                insurance: Math.round(Math.random() * 500000) + 150000,
                                miscellaneous: Math.round(Math.random() * 500000) + 30000,
                            },
                            monthlyData: {
                                create: Array.from({ length: 12 }).map((_, monthIndex) => {
                                    const date = new Date();
                                    date.setMonth(date.getMonth() - monthIndex);
                                    date.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()); // Set to end of month
                                    return {
                                        date: date,
                                        revenue: Math.round(Math.random() * 5500000) + 2500000, // Random revenue between $25,000 and $55,000 in cents
                                        expenses: Math.round(Math.random() * 2200000) + 600000, // Random expenses between $6,000 and $22,000 in cents
                                        operationalExpenses: Math.round(Math.random() * 1100000) + 150000, // Random operational expenses between $1,500 and $11,000 in cents
                                        nonOperationalExpenses: Math.round(Math.random() * 600000) + 70000, // Random non-operational expenses between $700 and $6,000 in cents
                                    };
                                }),
                            },
                            dailyData: {
                                create: Array.from({ length: 30 }).map((_, dayIndex) => ({
                                    date: new Date(new Date().setDate(new Date().getDate() - dayIndex)), // Last 30 days
                                    revenue: Math.round(Math.random() * 25000) + 6000, // Random daily revenue between $60 and $250 in cents
                                    expenses: Math.round(Math.random() * 12000) + 1200, // Random daily expenses between $12 and $120 in cents
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