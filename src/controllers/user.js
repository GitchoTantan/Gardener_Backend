import { connect } from '../database'

export const getUser = async(req, res) => {
    const connection = await connect();
    const [rows] = await connection.query('SELECT * FROM user WHERE userId = ?',[
        req.params.id
    ]);
    res.json(rows[0]);  
}

export const saveUser = async(req, res) => {
    const connection = await connect();
    const [results] = await connection.query("INSERT INTO user(nickname,exp,email,tierId,totalCommit,todayCommit) VALUES (0,0,1,1,0,0)")
    res.json({ 
       id: results.insertId,
       ...req.body,
    })
}
