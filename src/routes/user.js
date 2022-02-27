import { Router } from 'express';
import { getUser, saveUser } from '../controllers/user';

const router = Router();

router.get('/user/:id', getUser);

router.post('/user', saveUser);


export default router;