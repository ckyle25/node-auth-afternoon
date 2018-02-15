const express = require('express');
const session = require('express-session');
const passport = require('passport')
const strategy = require('./strategy')
const request = require('request')
const axios = require('axios')

const app = express();
app.use( session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false
}));
app.use( passport.initialize() );
app.use( passport.session() );
passport.use( strategy );

passport.serializeUser(function(user,done){
  const { _json } = user;
  done(null, { clientID: _json.clientID, 
               email: _json.email, 
               name: _json.name, 
               followers: _json.followers_url });
})

passport.deserializeUser(function(obj,done){
  done(null, obj)
})

app.get('/login',
  passport.authenticate('auth0',{
    successRedirect:'/followers',
    failureRedirect:'/login',
    failureFlash:true,
    connection:'github'
  })
)

app.get('/followers',function(req,res,next){
  console.log(req.session.user)
  if(!req.user){
    res.redirect('/login')
  } else {
    let baseURL = 'https://api.github.com/'
    axios.get(`${baseURL}users/ckyle25/followers`)
      .then(response => {
        return response
      })
  }
}
)

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );