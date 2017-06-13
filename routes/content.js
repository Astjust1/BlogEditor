var express = require("express");
var router = express.Router();
var debug = require('debug')('content');
var request = require('request');
var Content = require('../models/content');

router.get('/',function(req,res,next){
    //console.log(req.user);
    //console.log(req.user.profile);
   // debug(req.session);
    res.render("content",{title:"Content", user: req.user.profile,content: req.session.content}); 
});

router.post('/fetch',function(req,res,next){

    //debug(req.body.url);

    var options = {
      url : req.body.url,
      headers: {
        'User-Agent': 'Blog-Editor:Astjust1'
      }
    };
    var contentArray = [];
    request(options, function(error,response,body){
     // debug(req);
      //debug(response);
      var json = JSON.parse(body);
      json.forEach(function(element) {
        var newContent = new Content(element.name,element.url,element.path,element.sha,element.size,element.type);
        contentArray.push(newContent);
      }, this);
      req.session.content = contentArray;
      req.session.save();
      //debug(req.session);
     //res.render("content",{title:"Content",user: req.user.profile}); 
     res.send({redirect: '/content'});
     //debug(next);
    });
    //res.redirect("/content");
    //console.log("sir");
    //next();
});

module.exports = router;