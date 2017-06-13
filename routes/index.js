var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(req.user);
 // req.session.accessToken = req.accessToken;
  console.log(req.session);
  if(req.user){
    //console.log(req.user.profile);
  res.render('index', { title: 'Blog Editor' , user: req.user.profile});
  }else{
    res.render('index',{title: 'Blog Editor' ,user: undefined});
  }

  //console.log(res);
});

module.exports = router;
