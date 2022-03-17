import {mailSender} from './mail';

var emailParam = {
    toEmail: "harin14@naver.com",
    subject: "메일 테스트",
    text: "메일 내용"
  };

 export const updateExpGroup = async (req, res) => {
    mailSender.sendGmail(emailParam);
}
