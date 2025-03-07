import express from 'express';
import { transactionController } from '../controllers/transactionController';

const router = express.Router();

router.get('/', transactionController.getAllTransactions);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.get('/range', transactionController.getTransactionsByDateRange);

export default router; 