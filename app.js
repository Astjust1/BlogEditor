var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//routes
var index = require('./routes/index');
var users = require('./routes/users');
var main = require("./routes/main");
var content = require('./routes/content');
var editor = require('./routes/editor');

var passport = require('passport');
var bluebird = require('bluebird');
var session = require('express-session');
var GithubStrategy = require('passport-github2').Strategy;
var request = require('request');
var Repo = require("./models/repos");

var debug = require('debug')('APP.JS');

var app = express();
//Git Setup
require('dotenv').config();

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback"
},
  function(accessToken,refreshToken,profile,done){
      //console.log(profile);
      return done(null,{profile: profile._json, accessToken: accessToken});
  })
);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(methodOverride());
//app.set('trust proxy', 1) // trust first proxy 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj,done){
  done(null, obj);
});


app.use(express.static(path.join(__dirname, 'public')));



app.use('/', index);
app.get('/auth/github', 
  passport.authenticate('github',{scope: ['user']}),
  function(req, res){
    //console.log(res);
  });

  app.get('/auth/github/callback',
  passport.authenticate('github',{ failureRedirect: '/users'}),
  function(req,res){
    //console.log("Whats happening here");
    //Gonna try to add another call on return to grab a list of the repos
    req.session.login = req.user.profile.login;
    req.session.repos_url = req.user.profile.repos_url;
    //req.session.auth_token = req.user.profile.accessToken;
    req.session.save();
    //debug(req.user);
    //debug(session);
    
    var options = {
      url : req.session.repos_url,
      headers: {
        'User-Agent': 'Blog-Editor:Astjust1'
      }
    };
    request(options, function(error,response,body){
     // debug(req);
      debug(response);
      var json = JSON.parse(body);
      debug(json);
      var repoArray = [];
      json.forEach(function(element) {
        var newRepo = new Repo(element.name,element.url,element.description);
        repoArray.push(newRepo);
      }, this);
      //debug(repoArray);
      req.session.repos = repoArray;
      req.session.save();
      //debug(req.session);
      res.redirect('/main');
    });
  });

app.get('/logout',function(req,res){
  console.log("peace");
  req.logOut();
  res.redirect('/');
});
//Needs auth to access
app.all('*',ensureAuthenticated);
//app.use('/users', users);

app.use('/main', main);
app.use('/content', content );
app.use('/editor',editor );
//app.post('/content/fetch',require('./routes/content'));
//app.use('/editor/fetch', require('./routes/editor'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //console.log(err.status);
  //console.log(err.message);
  debug(res.locals.error);
  res.status(err.status || 500);
  res.render('error');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }else{
    res.redirect('/');
  }
}

module.exports = app;
