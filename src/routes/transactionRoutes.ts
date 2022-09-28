import express from 'express';
import {
  transaction_post,
  transaction_delete,
  transactions_get,
} from '../controllers/transactionController';
import requireAuth from '../middleware/requireAuth';

const router = express.Router();
// router.use(requireAuth);

router.post('/transaction', transaction_post);
router.delete('/transaction/delete/:transactionId', transaction_delete);
router.get('/transactions', transactions_get);

export default router;
