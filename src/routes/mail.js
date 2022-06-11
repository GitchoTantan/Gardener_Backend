import { Router } from 'express';
import {mailSender} from '../controllers/mail';

const router = Router();

var emailParam = {
    toEmail: "99yunsy@naver.com",
    subject: "[정원사]윤선영님이 김하린님을 콕 찔렀습니다.",
    text: "어서 커밋 해 주세요"
  };

  var emailParam2 = {
    toEmail: "tngur1101@naver.com",
    subject: "[정원사] 같이 캡스톤 해요~~",
    text: "윤선영님이 캡스톤을 요청했어요"
  };


router.put('/api/mail', function(req, res){
  mailSender.sendNmail(emailParam);
  res.sendStatus(204);
}); 

export default router;