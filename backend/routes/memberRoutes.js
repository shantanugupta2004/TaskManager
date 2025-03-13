import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { addM, updateR, deleteM, fetchM, getNames} from '../controllers/memberController.js';

const router = express.Router();

router.post('/add', authenticate, addM);
router.post('/updateRole', authenticate, updateR);
router.delete('/delete', authenticate, deleteM);
router.get('/get', authenticate, fetchM);
router.get('/getN', authenticate, getNames);

export default router;