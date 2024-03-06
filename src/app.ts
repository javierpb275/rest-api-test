import cors from "cors";
import express, { Application } from "express";

const app: Application = express();

//settings
app.set("port", process.env.PORT || 4000);

//middlewares
app.use(cors());
app.use(express.json());

export default app;
