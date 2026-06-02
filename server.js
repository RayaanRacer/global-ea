import express from "express";
import { db } from "./src/db/index.js";
import { users } from "./src/db/schema.js";
import userRoutes from "./src/routes/user.route.js";
import rideRoutes from "./src/routes/ride.route.js";
import dotenv from "dotenv";
import cors from "cors";
import { initSocket } from "./src/socket.js";
import http from "http";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
const apiVersion = "/api/v1";

app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  }),
);
const server = http.createServer(app);
initSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`${apiVersion}/users`, userRoutes);
app.use(`${apiVersion}/rides`, rideRoutes);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
