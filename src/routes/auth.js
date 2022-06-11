import { Router } from 'express';
const passport = require("passport");
// import {connectDB, insertUser} from '../query';

const router = Router();
const CLIENT_URL = "http://localhost:3000/"
const SUCCESS_URL = "http://localhost:3000"

router.get("/login/success", (req, res) => {
    if(req.user){
    res.status(200).json({
        success:true,   
        message: "successful",
        user: req.user,
        cookies: req.cookies
    });
}
    else{
        res.status(400).json({
            success: false,
            message: "no user",
        });
    }
});

router.get("/login/failed",  (req, res) => {
    res.status(401).json({
        success:false,
        message: "failure",
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);   
});

router.get("/github", passport.authenticate("github", {scope:"user:email"}));

router.get("/github/callback", passport.authenticate("github", {
    successRedirect: SUCCESS_URL,
    failureRedirect: "/login/failed"
}),
    function(req, res) {
        const conn = query.connectDB();
        query.insertUser(conn, req.user, function(){
            res.redirect("/");
        });
        console.log(req.user);
    }
);

module.exports = router;

