var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  var username = req.session.username || ''
  var page = req.query.page || 1
  var data = {
    total:0,  //总共有多少页
    curPage:page,
    list:[] //当前页的文章列表
  } 
  var pageSize = 2

  // console.log(moment(Date.now()).format('YYY年MM月DD日 HH:mm:ss'),'==============')
  model.connect(function(db){
    //1.第一步查询所有文章
    db.collection("article").find().toArray(function(err, docs) {
      
      data.total = Math.ceil(docs.length / pageSize)
      //2.查询当前页的文章列表
      model.connect(function(db){
        //3.分页查询 sort() limit() skip()
        db.collection("article").find().sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray(function(err, docs2) {
          if(docs2.length == 0){
            console.log(docs2.length)
            res.redirect('/?page='+((page-1) || 1))

          }else{
            docs2.map(function(ele,index){
              ele['time'] = moment(ele.id).format('YYY-MM-DD HH:mm:ss')
            })
            data.list = docs2
          }
          res.render('index', { title: 'Express',username:username,data:data });
          
        })
      })
    });
  })

});

//渲染注册页
router.get('/regist', function(req, res, next) {
  res.render('regist',{title: 'regist'})
})
router.get('/login', function(req, res, next) {
  req.session.name = 'aslkdjfl'
  console.log(req.session)
  res.render('login',{title: 'login'})
})

router.get('/wirte', function(req, res, next) { //写文章
  var username = req.session.username || ''
  var id = parseInt(req.query.id)
  var page = req.query.page
  var item = {
    title:'',
    content:'',
  }
  console.log(id,'===========')
  if(id){ //编辑文章
    model.connect(function(db){
      db.collection("article").findOne({id:id},function(err, docs) {
          if(err){
            console.log('查询失败')
          }else{
            item = docs
            item['page'] = page
            res.render('wirte',{username: username,item:item})

          }
      })
    })
  }else{  //添加文章
    res.render('wirte',{username: username,item:item})
  }

})

router.get('/detail', function(req, res, next) {
  var id = parseInt(req.query.id)
  var item = {
    title:'',
    content:'',
    id:'',
    username:'',
  }
  model.connect(function(db){
    db.collection("article").findOne({id:id},function(err, docs) {
      console.log(docs,'==========')
      item = docs
      item['time'] = moment(docs.id).format('YYY-MM-DD HH:mm:ss')

      if(err){
        console.log('查询失败',err)
      }else{
        res.render('detail',{item: item})
      }
    })
  })
})

module.exports = router;
