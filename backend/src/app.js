import express from "express";
import authRouter from "./routes/auth.route.js";
import interviewRouter from "./routes/interview.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith(".vercel.app"))) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export { app };
