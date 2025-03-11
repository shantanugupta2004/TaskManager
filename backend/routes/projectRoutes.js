import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { addProject, removeProject, getProjects } from '../controllers/projectController.js';

const router = express.Router();

router.post('/add', authenticate, addProject);
router.get('/get', authenticate, getProjects);
router.delete('/delete', authenticate, removeProject);

export default router;
