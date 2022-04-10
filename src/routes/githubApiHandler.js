import { Router } from 'express';
import { getCommits, getTopRepositories, getChallengeCommit, updateChallengeGarden } from '../controllers/githubApiHandler';

const router = Router();

router.get('/github/topRepo',  getTopRepositories);
router.get('/github/commit',  updateChallengeGarden);
router.put('/github/commit/today',  getChallengeCommit);
router.get('/github/commit/get',  getCommits);

export default router;