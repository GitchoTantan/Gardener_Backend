import { Router } from 'express';
import { getCommits, getTopRepositories, getChallengeCommit } from '../controllers/githubApiHandler';

const router = Router();

router.get('/github/topRepo',  getTopRepositories);
//router.get('/github/Commit',  getCommits);
router.get('/github/Commit',  getChallengeCommit);

export default router;