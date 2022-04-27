import { Router } from 'express';
import {saveChallenge,participationChallenge,getParticipationChallenge,getChallenge,acceptChallenge,getBadge} from '../controllers/challenge';

const router = Router();
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/images/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname,ext) + "-"+Date.now() + ext)
    },
})

var upload = multer({storage: storage})


router.post('/challenge', upload.single("image"), saveChallenge);
router.put('/challenge/accept', acceptChallenge);
router.get('/challenge/:id', getChallenge);
router.put('/challenge/participate', participationChallenge);
router.get('/badge/:id', getBadge);

export default router;