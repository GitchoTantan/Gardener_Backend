import { connect } from '../database'

export const getChallenge = async(req, res) => {
    const connection = await connect();
    const [rows] = await connection.query('SELECT * FROM challenge WHERE challengeId = ?',[
        req.params.id
    ]);
    const date = rows[0].createdAt.split(' ');
   res.json({
       id: rows[0].challengeId,
       title: rows[0].title,
       description: rows[0].description,
       createdAt: date[0],
       admin : rows[0].userId,
       imgUrl: rows[0].imgUrl
   })
}

export const saveChallenge = async (req, res) => {
    const connection = await connect();
    const [results] = await connection.query("INSERT INTO challenge(title,description,userId,imgUrl,createdAt) VALUES (?,?,?,?,NOW())",[
        req.body.title, 
        req.body.description, 
        req.body.userId, 
        req.body.imgUrl, 
    ])
    const [results2] = await connection.query("INSERT INTO challengeintermediate(challengeId,userId,createdAt) VALUES (?,?,NOW())",[
        results.insertId,
        req.body.userId
    ])
    res.json({ 
       id: results.insertId,
       id2: results2.insertId,
       ...req.body,
    })
}

export const deleteChallenge = async (req, res) => {
    const connection = await connect();
    await connection.query("DELETE FROM routine WHERE routineId = ?",[
       req.params.id, 
    ])
    res.sendStatus(204);
}

export const participationChallenge = async (req, res) => {
    const connection = await connect();
    await connection.query("INSERT INTO pendingrequests(challengeId,userId,createdAt) VALUES (?,?,NOW())",[
       req.body.challengeId, 
       req.body.userId, 
    ])
    res.sendStatus(204);
}

export const getParticipationChallenge = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.query('SELECT userId FROM pendingrequests WHERE challengeId = ?',[
        req.params.id
    ]);
    res.json(rows[0]);  
}

export const acceptChallenge = async (req, res) => {
    const connection = await connect();
    await connection.query("INSERT INTO challengeintermediate(challengeId,userId,createdAt) VALUES (?,?,NOW())",[
       req.body.challengeId, 
       req.body.userId, 
    ])
    res.sendStatus(204);
}
 
