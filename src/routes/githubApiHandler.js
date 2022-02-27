import { Router } from 'express';
import { getCommits, getTopRepositories } from '../controllers/githubApiHandler';

const router = Router();

router.get('/github/topRepo',  getTopRepositories);
router.get('/github/Commit',  getCommits);

export default router;