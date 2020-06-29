var express = require('express');
var router = express.Router();
var model = require('../model');
var session  = require('express-session');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/logout', function(req, res, next) { //退出
  req.session.username = null
  res.redirect('/login')
})

router.post('/regist', function(req, res, next) { //注册
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
router.post('/login', function(req, res, next) {  //登录
  var data = {
    username:req.body.name,
    password:req.body.password
  }
  console.log(data)

  model.connect(function(db){
    db.collection("users").find(data).toArray(function(err, result) {
      if (err){
        console.log('注册失败')
        res.redirect('/login')
      }else{
        if(result.length > 0){
          //登录成功，进行session会话存储
          req.session.username = data.username
          // console.log(req.session)
          res.redirect('/')

          
        }else{
          res.redirect('/login')

        }
        // console.log('注册成功')
        // res.redirect('/login')
      }
    });
  })
});

module.exports = router;
