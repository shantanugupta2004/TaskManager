import express from 'express';
import { add, update, deleteTask, getTasks } from '../controllers/taskController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/add', authenticate, add);
router.post('/update', authenticate, update);
router.delete('/delete', authenticate, deleteTask);
router.get('/fetch', authenticate, getTasks);

export default router;