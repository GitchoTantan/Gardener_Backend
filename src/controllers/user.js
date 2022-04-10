import { connect } from '../database'

export const getUser = async(req, res) => {
    const connection = await connect();
    const [usertable] = await connection.query('SELECT nickname,exp,tierId,totalCommit,flowerId FROM user WHERE userId = ?',[
        req.params.id
    ]);
    res.json({
        nickname: usertable[0].nickname,
        exp:usertable[0].exp,
        tierId: usertable[0].tierId,
        totalCommit: usertable[0].totalCommit,
        flowerId: usertable[0].flowerId,
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
