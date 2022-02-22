const axios = require("axios");

const KR_TIME_DIFF = 9 * 60 * 60 * 1000;


export const getActions = async (req, res) => {
  const response = await axios.get(
    `https://api.github.com/users/${req.params.user}/events`
  );
  const actions = response.data.map((action) => {
    return {
      type: action.type,
      repo: action.repo.name,
      time: new Date(action.created_at) + KR_TIME_DIFF,
    };
  });
  res.send(actions);
};

//날짜별로 커밋개수
export const getCommits = async (req, res)  => {
  const response = await axios.get(
    `https://api.github.com/search/commits?q=author-name:${req.params.user}&sort=committer-date&order=desc&page=1&per_page=10`
  );
  const commits = response.data.items.map((commit) => {
    return {
      repo: commit.repository.name,
      message: commit.commit.message,
      time: new Date(commit.commit.committer.date) + KR_TIME_DIFF ,
    };
  });
  res.send(commits);
};

export const getCommitCount = async (req, res)  => {
    const response = await axios.get(
      `https://api.github.com/search/commits?q=author-name:${req.params.user}&sort=committer-date&order=desc&page=1&per_page=10`
    );
    const commitcount = Array.from({length: 365}, () => 0);
    let today = new Date();    
    for (var i = 0; i < commitcount.length; i++) {
        
    }
    const commitCount = response.data.items.map((commit) => {
      return {
        repo: commit.repository.name,
        message: commit.commit.message,
        time: new Date(commit.commit.committer.date) + KR_TIME_DIFF ,
      };
    });
    res.send(commitCount);
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


