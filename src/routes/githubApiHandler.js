import { Router } from 'express';
import { getActions, getCommits, getTopRepositories } from '../controllers/githubApiHandler';

const router = Router();

router.get('/github/topRepo',  getTopRepositories);
router.get('/github/:user', getActions);
router.get('/github/commit/:user', getCommits);

export default router;