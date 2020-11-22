const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
var cookieSession = require('cookie-session')

const DiscordStrategy = require('passport-discord').Strategy
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials : true,
}

app.use(cors(corsOptions));
//
app.use(
    session({
        name: "aid",
        secret: 'ss',
        resave: true,
        saveUninitialized: false,
        cookie: {
            domain: "localhost",
            maxAge: 6*60*60*1000,
            httpOnly: false,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];
passport.use(new DiscordStrategy({
    clientID: "680089271998218240",
    clientSecret: "T5jwg-uUfe9VwRzsv071SCZVEpKqmnbQ",
    scope: scopes,
    callbackURL: "http://localhost:8000/auth/discord/callback"
}, function (accessToken, refreshToken, profile, cb) {
    return cb(null, profile)
}))

app.get('/auth/discord', passport.authenticate('discord'))
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/fail'
}), function (req, res) {
    res.redirect('http://localhost:3000') // Successful  auth
});

app.get('/fail', ((req, res) => {
    res.send("FAIL")
}))
app.get('/logout', (req,res)=>{
    req.logout()
    res.redirect('http://localhost:3000')
})
app.get('/me', (req, res) => {

    if (req.user) {
        console.log(req.session.passport.user.username)
        res.send(req.user.username)
    } else {
        res.send("NO")
    }
})

app.listen('8000', () => {
    console.log("APP OMJ")
})