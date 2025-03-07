import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import categoryRoutes from './routes/categoryRoutes';
import transactionRoutes from './routes/transactions';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`);
	console.log(`For local access: http://localhost:${PORT}`);
	console.log("For access from other devices, use your computer's IP address:");
	console.log(`http://YOUR_IP_ADDRESS:${PORT}`);
});
