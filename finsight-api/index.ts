// @ts-ignore
import express from "express";
// @ts-ignore
import bodyParser from "body-parser";
// @ts-ignore
import cors from "cors";
// @ts-ignore
import dotenv from "dotenv";
import helmet from "helmet";
// @ts-ignore
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.js";
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

const allowedOrigins = ["http://localhost:3000", "https://finsight-six.vercel.app/"]
app.use(cors(
    {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
        credentials: true
    }
));

// Routes
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).json({ info: "Finsight API" });
});
app.use("/login", loginRoutes);
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);
app.use("/transactionproduct", transactionProductRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err: Error) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});

export default app;