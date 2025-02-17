import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

// Load environment variables from .env file
dotenv.config();

// Check if PORT is set
if (!process.env.PORT) {
  console.error("PORT is not defined");
}

// Parse the PORT number
const PORT = parseInt(process.env.PORT as string, 10);

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers


// Start Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
