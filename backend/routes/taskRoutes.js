import express from 'express';
import { add, update, deleteTask, getTasks } from '../controllers/taskController.js';

const router = express.Router();

router.post('/add', add);
router.post('/update', update);
router.delete('/delete', deleteTask);
router.get('/fetch', getTasks);

export default router;