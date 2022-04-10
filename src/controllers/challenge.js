import { connect } from '../database'
import {getDailyCommits} from './githubApiHandler';
const delay = require('delay');

//챌린지 이름,사진,생성시간,한줄,유저 정보
export const getChallenge = async(req, res) => {
    const connection = await connect();
    const [user] = await connection.query('SELECT userId FROM challengeintermediate WHERE challengeId = ?',[
        req.params.id
    ]);
    const userDetail = []
    const userGarden = []
    user.forEach(async (content) => { 
        const [temp] = await connection.query('SELECT nickname,tierId,flowerId FROM user WHERE userId = ?',[
            content.userId
        ]); 
        const response = await getDailyCommits(temp[0].nickname ,7)
        const l1 = userDetail.push(temp)
        const l2 = userGarden.push(response)
    })
    const [rows] = await connection.query('SELECT * FROM challenge WHERE challengeId = ?',[
        req.params.id
    ]);

    const [date] = await connection.query('SELECT datetime,isDone FROM challengedetail WHERE challengeId = ?',[
        req.params.id
    ]);
    await delay(500);

    res.json({
    id: rows[0].challengeId,
    title: rows[0].title,
    description: rows[0].description,
    createdAt: rows[0].createdAt,
    admin : rows[0].userId,
    imgUrl: rows[0].imgUrl,
    participateuser: userDetail,
    usergarden: userGarden,
    date: date
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

export const deleteBadge = async (req, res) => {
    const connection = await connect();
    await connection.query("DELETE FROM badge WHERE badgeId =1")
    res.sendStatus(204);
}

export const participationChallenge = async (req, res) => {
    const connection = await connect();
    await connection.query("INSERT INTO pendingrequests(challengeId,userId,repo,createdAt) VALUES (?,?,?,NOW())",[
       req.body.challengeId, 
       req.body.userId, 
       req.body.repo
    ])
    res.sendStatus(204);
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
 
