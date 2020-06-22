var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res, next) {
  model.connect(function(db){
    db.collection("site"). find({}).toArray(function(err, result) { // 返回集合中所有数据
      if (err) throw err;
      console.log("查询成功",result);
      res.render('index', { title: 'Express' });

    });
  })
});

//渲染注册页
router.get('/regist', function(req, res, next) {
  res.render('regist',{title: 'regist'})
})
router.get('/login', function(req, res, next) {
  res.render('login',{title: 'login'})
})

module.exports = router;
