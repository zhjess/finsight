import express from "express";
import prisma from "../prisma/prisma";
import { authenticateUser } from "../middleware/userAuth";

const kpiRoutes = express.Router();
kpiRoutes.use(authenticateUser);

kpiRoutes.get("/kpis", async (req, res) => {
    try {
        const kpis = await prisma.kpi.findMany({
            include: {
                dailyData: true,
                monthlyData: true
            }
        });
        res.status(200).json(kpis);
    } catch (err) {
        console.log("🚀 ~ kpiRoutes.get ~ err:", err)
        res.status(500).json({ message: "An error occurred while retrieving KPIs" });
    }
});

kpiRoutes.get("/kpis/:year", async (req, res) => {
  const year = parseInt(req.params.year);
  const userId = req.userId;
  
  if (isNaN(year)) {
    return res.status(400).json({ error: "Invalid year" });
  }

  try {
    // Fetch revenue transactions
    const revenueTransactions = await prisma.revenueTransaction.findMany({
      where: {
        date: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`)
        },
        userId
      },
      include: {
        transactionProducts: {
          include: {
            product: true,
          }
        }
      }
    });

    // Fetch expense transactions
    const expenseTransactions = await prisma.expenseTransaction.findMany({
      where: {
        date: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`)
        },
        userId
      },
      include: {
        expenseCategory: {
          include: {
            expenseType: true, // Include the expenseType relation
          },
        },
      },
    });

    // Calculate total revenue and total expenses
    const totalRevenue = revenueTransactions.reduce((acc, transaction) => {
      return acc + transaction.transactionProducts.reduce((sum, tp) => sum + (tp.product.price * tp.quantity), 0);
    }, 0);

    const totalExpenses = expenseTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalProfit = totalRevenue - totalExpenses;

    // Calculate expenses by category
    const expensesByCategory = expenseTransactions.reduce((acc, transaction) => {
      const category = transaction.expenseCategory.description;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    // Calculate operational and non-operational expenses
    const totalOperational = expenseTransactions
      .filter(et => et.expenseCategory.expenseType.description === "Operational")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalNonOperational = expenseTransactions
      .filter(et => et.expenseCategory.expenseType.description === "Non-Operational")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    // Daily data
    const dailyData: { date: string, totalRevenue: number, totalExpenses: number }[] = [];
    for (let day = 1; day <= 365; day++) {
      const date = new Date(year, 0, day);
      if (date.getFullYear() !== year) break;

      const dailyRevenue = revenueTransactions
        .filter(rt => new Date(rt.date).toDateString() === date.toDateString())
        .reduce((acc, transaction) => acc + transaction.transactionProducts.reduce((sum, tp) => sum + (tp.product.price * tp.quantity), 0), 0);

      const dailyExpenses = expenseTransactions
        .filter(et => new Date(et.date).toDateString() === date.toDateString())
        .reduce((acc, transaction) => acc + transaction.amount, 0);

      dailyData.push({
        date: date.toISOString().split("T")[0],
        totalRevenue: dailyRevenue,
        totalExpenses: dailyExpenses
      });
    }

    // Monthly data
    const monthlyData: { monthEnded: string, totalRevenue: number, totalExpenses: number, totalOperational: number, totalNonOperational: number }[] = [];
    for (let month = 0; month < 12; month++) {
        const lastDayOfMonth = new Date(year, month + 1, 0); // Get the last day of the current month

        const monthlyRevenue = revenueTransactions
            .filter(rt => new Date(rt.date).getMonth() === month && new Date(rt.date).getFullYear() === year)
            .reduce((acc, transaction) => acc + transaction.transactionProducts.reduce((sum, tp) => sum + (tp.product.price * tp.quantity), 0), 0);

        const monthlyExpenses = expenseTransactions
            .filter(et => new Date(et.date).getMonth() === month && new Date(et.date).getFullYear() === year)
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        const operationalExpenses = expenseTransactions
            .filter(et => et.expenseCategory.expenseType.description === "Operational" && new Date(et.date).getMonth() === month && new Date(et.date).getFullYear() === year)
            .reduce((acc, transaction) => acc + transaction.amount, 0);
            
        const nonOperationalExpenses = expenseTransactions
            .filter(et => et.expenseCategory.expenseType.description === "Non-Operational" && new Date(et.date).getMonth() === month && new Date(et.date).getFullYear() === year)
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        monthlyData.push({
            monthEnded: lastDayOfMonth.toISOString().split("T")[0], // Format as YYYY-MM-DD
            totalRevenue: monthlyRevenue,
            totalExpenses: monthlyExpenses,
            totalOperational: operationalExpenses,
            totalNonOperational: nonOperationalExpenses
        });
    }

    // Construct the KPI object
    const kpi = {
      userId,
      totalRevenue,
      totalExpenses,
      totalProfit,
      expensesByCategory,
      expensesByType: {
        totalOperational,
        totalNonOperational
      },
      dailyData,
      monthlyData
    };

    console.log(userId);

    return res.json(kpi);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default kpiRoutes;