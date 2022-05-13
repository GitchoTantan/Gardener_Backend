import { Router } from 'express';
import { getUserPage, saveUser } from '../controllers/user';

const router = Router();

router.get('/user/:id', getUserPage);

router.post('/user', saveUser);


export default router;