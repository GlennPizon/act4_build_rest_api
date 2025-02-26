import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';


// Load environmental variables from .env file
dotenv.config();

if (!process.env.PORT) {
    console.log(`Error to get ports`);
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

// Create Express server
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


