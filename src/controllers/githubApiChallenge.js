const axios = require("axios");
import { connect } from '../database'

export const updateChallengeGarden = async (req, res) => {
    const connection = await connect();
    const [challenges] = await connection.query('SELECT challengeId FROM challenge');
    challenges.forEach(async (content) => {
        const [challengesDetail] = await connection.query('SELECT userId,repo FROM challengeintermediate WHERE challengeId =?',[content.challengeId])
        challengesDetail.forEach(async (action) => {
          const commitresult = await getCommits(action.repo);
        })
        console.log(commitresult)
    })
  };

  export const getCommits = async (repo) => {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${repo}/commits`
        );
      const result = response. 
    } catch (error) {
      console.error(error);
    }
  };