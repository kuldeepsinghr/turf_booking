import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import turfRoutes from "./routes/turf.routes.js";
import slotRoute from "./routes/slot.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const PORT = process.env.PORT || 5000;

// Start server AFTER DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});


// Routes
app.use("/api/user", userRoutes); // All user-related routes under /api/user
app.use("/api/owners", ownerRoutes); // All owner-related routes under /api/owners
app.use("/api/turfs", turfRoutes); // All turf-related routes under /api/turfs
app.use("/api/slots", slotRoute); // All slot-related routes under /api/slots