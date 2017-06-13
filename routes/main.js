var express = require('express');
var router = express.Router();
var debug = require('debug')('main');

router.get('/',function(req,res,next){
    //console.log(req.user._json);
    //debug(req.session.repos);
    //debug(res.session);
    res.render('main',{title: "Main",user: req.user.profile, repos: req.session.repos});
});

module.exports=router;