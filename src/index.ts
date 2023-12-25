import express, { Router } from "express";
import { configEnv } from "./config/envExtractor";
import { connectToDB } from "./config/dataBase/connectDB";
import { errorHandler } from "./errors/errorHandler";
import { userRoter } from "./routes/userRoutes";
import { authRoter } from "./routes/authRoute";
import { businessRotue } from "./routes/businessRoute";
import { prodectRotue } from "./routes/productRoute";
import { orderRouter } from "./routes/orderRoute";
require("./services/googleAuth");
configEnv();
connectToDB();
var cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT);
app.use("/business", businessRotue);
app.use("/users", userRoter);
app.use("/auth", authRoter);
app.use("/product", prodectRotue);
app.use("/order", orderRouter);
app.use(errorHandler);
