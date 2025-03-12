import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { addProject, removeProject, getProjects } from '../controllers/projectController.js';
import { add, updateP,updateS, deleteT, getT } from '../controllers/ptaskController.js';

const router = express.Router();

router.post('/add', authenticate, addProject);
router.get('/get', authenticate, getProjects);
router.delete('/delete', authenticate, removeProject);
router.post('/tasks/add', authenticate, add);
router.post('/tasks/updateP', authenticate, updateP);
router.post('/tasks/updateS', authenticate, updateS);
router.delete('/tasks/delete', authenticate, deleteT);
router.get('/tasks/get', authenticate, getT);

export default router;
