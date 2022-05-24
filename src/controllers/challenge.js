import { connect } from '../database'
import {getDailyCommits} from './githubApiHandler';
const delay = require('delay');

//챌린지 이름,사진,생성시간,한줄,유저 정보
export const getChallenge = async(req, res) => {
    const connection = await connect();
    var totalJson = new Array();
    var challenge = new Object();
    var members = new Array();
    var checkbool;
    var boolisleader= false;
    var boolismember = false;
    const [coming] = await connection.query('SELECT userId FROM user WHERE nickname = ?',[
        "yunseonyeong",
    ]);
    const [challengerow] = await connection.query('SELECT * FROM challenge WHERE challengeId = ?',[
        req.params.id
    ]);
    
    challenge.profileImgURL = challengerow[0].imgUrl;
    challenge.name = challengerow[0].title;
    challenge.date = challengerow[0].createdAt;
    challenge.introductionMsg = challengerow[0].description;

    challenge = JSON.stringify(challenge);

    const [user] = await connection.query('SELECT userId,repo FROM challengeintermediate WHERE challengeId = ?',[
        req.params.id
    ]);

    user.forEach(async (content) => { 
        if (coming[0].userId === content.userId) {
            boolismember = true;
        }
        const [temp] = await connection.query('SELECT nickname,tierId,flowerId,mbti FROM user WHERE userId = ?',[
            content.userId
        ]); 
        const response = await getDailyCommits(temp[0].nickname ,0.6)
        if(challengerow[0].userId != content.userId){
            checkbool= false;
       }else{
            if(content.userId == coming[0].userId){
                boolisleader = true
            }
            checkbool= true;
       }
       var membersTemp = new Object();
        membersTemp.memberId = content.userId;
        membersTemp.profileImgURL ="경로 어떻게할지 미정";
        membersTemp.devType = temp[0].mbti;
        membersTemp.name = temp[0].nickname;
        membersTemp.tier = {"tierType":temp[0].tierId,"tierNum":temp[0].flowerId };
        membersTemp.isLeader = checkbool;
        membersTemp.repoUrl = content.repo;

       if(response[0].count != 0){
           checkbool= true;
       }else{
            checkbool= false;
       }
        membersTemp.todayCommit = checkbool;
        members.push(membersTemp);
    })
    
    await delay(500);
    totalJson.push(JSON.parse(challenge));

    members = JSON.stringify(members);
    members = JSON.parse(members)
  
    res.json({
    challenge: totalJson[0],
    isMember: boolismember,
    isLeader: boolisleader,
    members: members,
   })
}


export const saveChallenge = async (req, res) => {
    try{
    const connection = await connect();
    
    const [results] = await connection.query("INSERT INTO challenge(title,description,userId,imgUrl,createdAt) VALUES (?,?,?,?,NOW())",[
        req.body.title, 
        req.body.description, 
        req.body.userId, 
        `/images/${req.file.filename}`, 
    ])
    const [results2] = await connection.query("INSERT INTO challengeintermediate(challengeId,userId,repo,createdAt) VALUES (?,?,?,NOW())",[
        results.insertId,
        req.body.userId,
        req.body.repo
    ])
    res.json({ 
       id: results.insertId,
       id2: results2.insertId,
       ...req.body,
    })  
} catch (error) {  
}
}

export const getBadge = async (req, res) => {
    const connection = await connect();
    try {
        const [rows] = await connection.query('SELECT badgeId FROM badgeintermediate WHERE userId = ?',[
            req.params.id
        ]);
        res.json(rows[0]); 
    } catch (error) {
        console.log(error)
    } 
}

export const participationChallenge = async (req, res) => {
    const connection = await connect();
    try{
        /*
    await connection.query("INSERT INTO challengeintermediate(challengeId,userId,repo,createdAt) VALUES (?,?,?,NOW())",[
       req.body.challengeId, 
       req.body.userId, 
       req.body.repo
    ])
    */
    await connection.query("INSERT INTO challengeintermediate(challengeId,userId,repo,createdAt) VALUES (2,2,?,NOW())",[
       "https://github.com/yunseonyeong/LonelyAlgorithm/commits/master"
    ])
    res.sendStatus(204);
    }catch(err) { console.log(err)}
}

export const getParticipationChallenge = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.query('SELECT userId FROM pendingrequests WHERE challengeId = ?,',[
        req.params.id
    ]);
    res.json(rows[0]);  
}

export const acceptChallenge = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.query('SELECT repo FROM pendingrequests WHERE challengeId = ? AND userId=?',[
        req.body.challengeId, 
        req.body.userId, 
    ]);
    await connection.query("INSERT INTO challengeintermediate(challengeId,userId,repo,createdAt) VALUES (?,?,?,NOW())",[
       req.body.challengeId, 
       req.body.userId, 
       rows[0].repo
    ])
    res.sendStatus(204);
}
 
