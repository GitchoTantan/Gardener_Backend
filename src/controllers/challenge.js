import { connect } from '../database'

export const getChallenges = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.query("SELECT * FROM tasks");
    res.json(rows)
}

export const getChallenge = async(req, res) => {
    const connection = await connect();
    const [rows] = await connection.query('SELECT * FROM tasks WHERE id = ?',[
        req.params.id
    ]);
    res.json(rows[0]);  
}

export const saveChallenge = async (req, res) => {
    const connection = await connect();
    const [results] = await connection.query("INSERT INTO routine(name,userId) VALUES (?,1)", [
        req.body.name,
    ])
    res.json({ 
       id: results.insertId,
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

export const getChallengeCount =  async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.query("SELECT COUNT(*) FROM routine")
    res.json(rows[0]["COUNT(*)"])
 }

 