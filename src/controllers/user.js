import { connect } from '../database'
const delay = require('delay');

export const getUserPage = async(req, res) => {
    const connection = await connect();
    var totalJson = new Array();
    var profile = new Object();
    var todaycommit = true;
    const challengeArray = []

    const [challenged] = await connection.query('SELECT challengeId FROM challengeintermediate WHERE userId = ?',[
        req.params.id
    ]);
    challenged.forEach(async (detail) => {
        const [temp2] = await connection.query('SELECT title,imgUrl FROM challenge WHERE challengeId = ?',[
            detail.challengeId
        ])
        const l1 = challengeArray.push(temp2)
        var challengesTemp = new Object();
        challengesTemp.challengeId = detail.challengeId
        challengesTemp.challengeImgURL = temp2[0].imgUrl
        challengesTemp.challengeTitle = temp2[0].title
        try{
        const [temp3] = await connection.query('SELECT isDone FROM challengedetail WHERE (challengeId = ?) and (datetime = now())',[
            detail.challengeId
        ])
        if(temp3[0].isDone == 0){
            todaycommit = false;
        }
        }catch(e){
            todaycommit = false;
        }
        challengesTemp.todayCommit = todaycommit
        totalJson.push(challengesTemp);
    })
    
    const [usertable2] = await connection.query('SELECT nickname,exp FROM user WHERE userId = ?',[
        req.params.id
    ]);

    const response = await getDailyCommits( usertable2[0].nickname ,0.6)

    if(response2[0].count != 0) {
         try{
          await connection.query("UPDATE user SET exp = ? WHERE userId =?",[ 
              usertable2[0].exp+response[0].count,
              req.params.id
            ])
          } catch{}
    }

       const [usertable] = await connection.query('SELECT nickname,exp,tierId,totalCommit,flowerId,mbti FROM user WHERE userId = ?',[
        req.params.id
    ]);


    profile.Id = req.params.id;
    profile.nickname = usertable[0].nickname;
    profile.devType = usertable[0].mbti;
    profile.exp = usertable[0].exp;
    profile.tierType = usertable[0].tierId;
    profile.tierNum = usertable[0].flowerId;
    
    await delay(500);

    res.json({
       profile: profile,
       challenges : totalJson
    })
}

export const saveUser = async(req, res) => {
    const connection = await connect();
    const [results] = await connection.query("INSERT INTO user(nickname,exp,email,tierId,totalCommit,todayCommit) VALUES (0,0,1,1,0,0)")
    res.json({ 
       id: results.insertId,
       ...req.body,
    })
}

export const updateTier = async(req, res) => {
    const connection = await connect();
    const [results] = await connection.query("SELECT userId,totalCommit,flowerId,exp FROM user")
    results.forEach(async (content) => {
       
    })
}
