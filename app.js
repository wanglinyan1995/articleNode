var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');
var session  = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session ({  //session配置
  secret:'Keyboard cat',
  resave:false,
  saveUninitialized: true,
  cookie: {maxAge:500000},
  // cookie: {secure:false,maxAge:10000}, /*第一个参数：只有在https才可以访问cookie；第二个参数：设置cookie的过期时间*/
  // rolling:true/*只要页面在操作就不会过期，无操作60秒后过期*/
}))

app.get('*',function(req,res,next){ //登录拦截
  var username = req.session.username
  var path = req.path
  if(path != '/login' && path != '/regist'){
    console.log('session',username)
    if(!username){
      // alert('登录超时，请重新登录')
      res.redirect('/login')
  
    }
  }
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/article', articleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
