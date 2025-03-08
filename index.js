// Packages
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

// Files
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Configuration
dotenv.config();
connectDB();

const app = express();

// ✅ Use CORS Middleware
const allowedOrigins = ["http://localhost:5173", "*"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow cookies
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"], // ✅ Allow these HTTP methods
  })
);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hey, I am server. I am running smoothly");
});

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/upload", uploadRoutes);

const __dirname = path.resolve();
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
