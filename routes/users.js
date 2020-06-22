var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/regist', function(req, res, next) {
  var data = {
    username:req.body.name,
    password:req.body.password,
    password2:req.body.password2
  }

  model.connect(function(db){
    db.collection("users").insertOne(data, function(err, ret) {
      if (err){
        console.log('注册失败')
        res.redirect('/regist')
      }else{
        console.log('注册成功')
        res.redirect('/login')
      }
    });
  })
});

module.exports = router;
