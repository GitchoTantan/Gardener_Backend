import { Router } from 'express';
import {updateChallengeGarden } from '../controllers/githubApiChallenge';

const router = Router();

router.get('/github/challenge/garden',  updateChallengeGarden);


export default router;