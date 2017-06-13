var express = require('express');
var router = express.Router();
var GitFile = require('../models/file');
var debug = require('debug')('editor');
var request = require('request');

router.get('/',function(req,res,next){

    res.render('editor',{title: "Editor", user: req.user.profile, file: req.session.file});

});

router.post('/fetch',function(req,res,next){   

    //Needed for github API request
    debug("WUT");
    var options = {
        url: req.body.url,
        headers: {
            'User-Agent': 'Blog-Editor:Astjust1'
        }
    };

  //var fileArray = [];

    request(options,function(error,response,body){

        var json = JSON.parse(body);
        //debug(json);
            var file = new GitFile(json.type,json.encoding,json.size,json.name,json.content,json.sha,json.url);
            var encodedData = json.content;
            debug(encodedData);
            var buf = Buffer.from(encodedData,json.encoding);
            var str = buf.toString('utf8');
            debug(str);
            file.content = str;
            //fileArray.push(file);
        req.session.file = file;
        req.session.save();

        res.send({redirect:"/editor"}); 

    });

});

module.exports = router;