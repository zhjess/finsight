import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.ts";
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js";
import loginRoutes from "./routes/login.js";
import transactionProductRoutes from "./routes/transactionProduct.js";

// Configuration
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(
    {
        origin: [""],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    }
));

// Routes
app.get("/", (req, res) => {res.status(200).json({info: "Finsight API"})});
app.use("/login", loginRoutes);
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);
app.use("/transactionproduct", transactionProductRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});

export default app;