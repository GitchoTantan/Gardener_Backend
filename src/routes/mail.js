import { Router } from 'express';
import {mailSender} from '../controllers/mail';

const router = Router();

var emailParam = {
    toEmail: "icecandy1256@gmail.com",
    subject: "메일 테스트",
    text: "메일 내용"
  };


router.put('/api/mail', function(req, res){
  mailSender.sendNmail(emailParam);
  res.sendStatus(204);
}); 

export default router;