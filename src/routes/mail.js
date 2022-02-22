import { Router } from 'express';
const mailController = require('../controllers/mail') 

const router = Router();

router.post('/mail', mailController);

export default router;