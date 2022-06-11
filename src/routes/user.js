import { Router } from 'express';
import { getUserPage, saveUser } from '../controllers/user';

const router = Router();

router.get('/api/user/:id', getUserPage);

router.post('/api/user', saveUser);


export default router;