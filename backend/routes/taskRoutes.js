import express from 'express';
import { add, update, deleteTask, getTasks, updateP, getTasksbyPriority } from '../controllers/taskController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/add', authenticate, add);
router.post('/update', authenticate, update);
router.post('/updateP', authenticate, updateP);
router.delete('/delete', authenticate, deleteTask);
router.get('/fetch', authenticate, getTasks);
router.get('/fetchP', authenticate, getTasksbyPriority);

export default router;