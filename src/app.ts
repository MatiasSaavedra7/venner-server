import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { PORT, FRONTEND_URL } from "./config";
import indexRoutes from "./routes/index.routes";

const app: Application = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1", indexRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api/v1`);
});
