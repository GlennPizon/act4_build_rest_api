import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./users/users.routes";

// Load environment variables from .env file
dotenv.config();

// Validate PORT from .env
const PORT: number = parseInt(process.env.PORT || "3000", 10);
if (!PORT) {
  console.error("PORT is not defined in .env file");
  process.exit(1); // Exit the process if PORT is missing
}

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers

// Log PORT to verify .env is loaded
console.log(`Loaded PORT from .env: ${PORT}`);

// Use Routes
app.use("/users", userRoutes); // Attach user routes

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the REST API using TypeScript and Node.js!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
