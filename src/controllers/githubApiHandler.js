const axios = require("axios");
import { connect } from '../database'

const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

export const getCommitsFromActions = async (userName, days) => {
  const from = new Date(new Date() - days * ONE_DAY);
  const response = await axios.get(
    `https://api.github.com/users/${userName}/events?per_page=100&page=1`
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
  const dailyCommits = getDateList(new Date(new Date() - (days * ONE_DAY)), new Date());
  let idx = dailyCommits.length - 1;
  console.log(pushActions)
  pushActions.forEach((action) => {
    const date = getStringDate(new Date(action.date));
    const commits = action.commits.map((commit) => {
      return {
        repo: action.repo,
        commit: commit,
      };
    });
    while (true) {
      if (date == dailyCommits[idx].date) {
        dailyCommits[idx].count += action.count;
        dailyCommits[idx].commits = [...dailyCommits[idx].commits, ...commits];
        break;
      }
      else { 
        idx -= 1;
      }
    }      
  });
  return dailyCommits;
};

const getDateList = (start, now) => {
  const nowDate = getStringDate(now);
  let cur = start;
  let curDate = getStringDate(cur);
  const result = []
  while (curDate <= nowDate) {
    result.push({
      date: curDate,
      count: 0,
      commits: [],
    })
    cur = new Date(cur.getTime() + ONE_DAY)
    curDate = getStringDate(cur);
  }
  return result
}

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
  try{
  const response = await getDailyCommits("Tarakyu", 3)
  res.send(response);
  } catch (error) {
    console.log(error); 
  }
};


export const getChallengeCommit = async (req, res) => {
  const connection = await connect();
  const [userCommit] = await connection.query('SELECT userId,nickname FROM user');
  userCommit.forEach(async (content) => {
    const response = await getDailyCommits(content.nickname, 0.5)
    try {
      if(response[0].count > 0){
        await connection.query("UPDATE user SET todayCommit = '1' WHERE userId =?",[content.userId])
      } else{
        await connection.query("UPDATE user SET todayCommit = '0' WHERE userId =?",[content.userId])
      }
    } catch (error) {
    }
  })
};

//challenge 의 각각 가든 채우기
export const updateChallengeGarden = async (req, res) => {
  const connection = await connect();
  var check = 0
  const [challenges] = await connection.query('SELECT challengeId FROM challenge');
  challenges.forEach(async (content) => {
      try{
      await connection.query("INSERT INTO challengedetail(challengeId,datetime,isDone) VALUES (?,NOW(),0)",[content.challengeId])
      } catch(error) { console.log(error)}
      const [challengesDetail] = await connection.query('SELECT userId,repo FROM challengeintermediate WHERE challengeId =?',[content.challengeId])
      challengesDetail.forEach(async (action) => {
        const [name] = await connection.query('SELECT nickname FROM user WHERE userId =?',[action.userId])
        try {
          const response = await getDailyCommits(name[0].nickname, 0.5)
          if(response[0].count > 0){ 
            response[0].commits.forEach(async (repocheck) => { 
              check = 0
              if(repocheck.repo==action.repo){
                check = check + 1
                return false
              }
            })
          }
        } catch (error) {
          console.log("no")
        }
        if( check ==challengesDetail.length ){
          try{
          await connection.query("UPDATE challengedetail SET isDone = '1' WHERE challengeId =?",[ content.challengeId])
          } catch(error) {}
        }
      })
  })
};
