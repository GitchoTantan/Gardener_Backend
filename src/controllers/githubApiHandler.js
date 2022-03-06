const axios = require("axios");
import { connect } from '../database'

const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

export const getCommitsFromActions = async (userName, days) => {
  const from = new Date(new Date() - days * ONE_DAY);
  const response = await axios.get(
    `https://api.github.com/users/${userName}/events/?per_page=100&page=1`
  );
  const pushActions = response.data
    .filter((action) => {
      return (
        action.type == "PushEvent" &&
        new Date(action.created_at).getTime() > from.getTime()
      );
    })
    .map((action) => {
      return {
        repo: action.repo.name,
        date: action.created_at,
        count: action.payload.size,
        commits: action.payload.commits.map((commit) => commit.message),
      };
    });
  return pushActions;
};

export const getDailyCommits = async (userName, days) => {
  const pushActions = await getCommitsFromActions(userName, days);
  const dailyCommits = [];
  pushActions.forEach((action) => {
    const date = getStringDate(new Date(action.date));
    const commits = action.commits.map((commit) => {
      return {
        repo: action.repo,
        commit: commit,
      };
    });
    const idx = dailyCommits.length - 1;
    if (idx >= 0 && dailyCommits[idx].date == date) {
      dailyCommits[idx].count += action.count;
      dailyCommits[idx].commits = [...dailyCommits[idx].commits, ...commits];
    } else {
      dailyCommits.push({
        date: date,
        count: action.count,
        commits: commits,
      });
    }
  });
  return dailyCommits;
};

export const getStringDate = (date) => {
  return (
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth()+1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2)
  );
};

export const getTopRepositories = async (req, res) => {
  const response = await axios.get(
    `https://api.github.com/search/repositories?q=stars:>=1000&sort=stars&per_page=10`
  );
  const repos = response.data.items.map((repo) => {
    return {
      repo: repo.full_name,
      stars: repo.stargazers_count,
    };
  });
  res.send(repos);
};

export const getCommits = async (req, res) => {
  const response = await getDailyCommits("rineeee", 30)
  res.send(response);
};

export const getChallengeCommit = async (req, res) => {
  const connection = await connect();
  const [userCommit] = await connection.query('SELECT userId,nickname FROM user');
  userCommit.forEach(async (content) => {
    const response = await getDailyCommits(content.nickname, 0.5)
    try {
      if(response[0].count){
        await connection.query("UPDATE user SET todayCommit = '1' WHERE userId =?",[content.userId])
      }
    } catch (error) {
      await connection.query("UPDATE user SET todayCommit = '0' WHERE userId =?",[content.userId])
    }
  })
  /*
  await connection.query("INSERT INTO user(todayCommit) VALUES (?)",[

  ])
  console.log(userCommit[0].nickname)
  const [rows] = await connection.query('SELECT challengeId,userId FROM challengeintermediate');
  console.log(rows)
  const response = await getDailyCommits("rineeee", 1)
  console.log(response)
  res.send(response);
  */
};

export const getCommitsTest = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/GitchoTantan/Gardener/commits`
      );
      console.log(response);
  } catch (error) {
    console.error(error);
  }
};