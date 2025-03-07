import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import transactionRoutes from './routes/transactions';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 