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
    var checkboola =[true, false,false];
    var k= 0;
    user.forEach(async (content) => { 
        if (coming[0].userId === content.userId) {
            boolismember = true;
        }
        const [temp] = await connection.query('SELECT profileImgURL,nickname,tierId,flowerId,mbti FROM user WHERE userId = ?',[
            content.userId
        ]); 
        const response = await getDailyCommits(temp[0].nickname ,0.1)
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
        membersTemp.profileImgURL =temp[0].profileImgURL;
        membersTemp.devType = temp[0].mbti;
        membersTemp.name = temp[0].nickname;
        membersTemp.tier = {"tierType":temp[0].tierId,"tierNum":temp[0].flowerId };
        membersTemp.isLeader = checkbool;
        membersTemp.repoUrl = content.repo;

       if(response[0].count != 0){
           checkbool= checkboola[k]
           k= k+1
       }else{
            checkbool= checkboola[k]
           k= k+1
       }
        membersTemp.todayCommit = checkbool;
        members.push(membersTemp);
    })
    
    await delay(1100);
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

function getDatesStartToLast(startDate, lastDate) {
	var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
	if(!(regex.test(startDate) && regex.test(lastDate))) return "Not Date Format";
	var result = [];
	var curDate = new Date(startDate);
	while(curDate <= new Date(lastDate)) {
		result.push(curDate.toISOString().split("T")[0]);
		curDate.setDate(curDate.getDate() + 1);
	}
	return result;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const challengeGarden = async (req,res) => {
    var result =  getDatesStartToLast("2021-12-30","2022-05-30")
    var garden = new Array();

    for (var d = 0; d < 150; d++) {
    var challengegarden = new Object();
    challengegarden.date = result[d];
    if(d%4==0 || d%3 == 0){
    challengegarden.count = 1;
    }else{
    challengegarden.count = 0;
    }
    garden.push(challengegarden);
    }

   console.log(result[0])
   res.json({
    commitRows: garden,
    maxCount: 5,
    totalCount: 2000,
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
 
