import { Router } from 'express';
import { getCommits, getTopRepositories, getChallengeCommit, updateChallengeGarden } from '../controllers/githubApiHandler';

const router = Router();

router.get('/api/github/topRepo',  getTopRepositories);
router.get('/api/github/commit',  updateChallengeGarden);
router.put('/api/github/commit/today',  getChallengeCommit);
router.get('/api/github/commit/get',  getCommits);

export default router;