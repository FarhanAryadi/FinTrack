import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express from 'express';
import categoryRoutes from './routes/categoryRoutes';
import transactionRoutes from './routes/transactions';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
