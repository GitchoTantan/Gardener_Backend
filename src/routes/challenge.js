import { Router } from 'express';
import { getChallenge, getChallengeCount, getChallenges, deleteChallenge, saveChallenge } from '../controllers/challenge';

const router = Router();

router.get('/challenge', getChallenges);

router.get('/challenge/count', getChallengeCount);

router.get('/challenge/:id', getChallenge);

router.delete('/challenges/:id', deleteChallenge);

router.post('/challenge', saveChallenge);


export default router;