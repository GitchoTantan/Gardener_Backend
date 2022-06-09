const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = "83b3792f35699392fb8c"
const GITHUB_CLIENT_SECRET = "b4abd60e13423dc3049840201ebce0716b88dce0"

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/github/callback",
    scope: 'user:email',
  },
  function(accessToken, refreshToken, profile, done) {

    return done(null, profile);
}
));
// a
passport.serializeUser(function(user,done) {
    done(null,user);
})

passport.deserializeUser(function(user,done){
    done(null,user);
})