import { Router } from 'express';
import {saveChallenge,participationChallenge,getParticipationChallenge,getChallenge,challengeGarden} from '../controllers/challenge';

const router = Router();

//router.post('/challenge', saveChallenge);
router.post('/challenge', challengeGarden);
//router.get('/challenge/:id', getChallenge);


export default router;