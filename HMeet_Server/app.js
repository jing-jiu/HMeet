let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let loginRouter = require('./routes/login');
let homeRouter = require('./routes/home');
let app = express();
let db = require('./model/db')
let fs = require('fs')
// 允许跨域
// const allowHeaders = "Origin, Expires, Content-Type, X-E4M-With, Authorization";
// app.all("*", function (req, res, next) {
//   //设置允许跨域的域名，*代表允许人员域名跨域
//   res.header("Access-Control-Allow-Origin", "*");
//   //允许的header类型
//   res.header("Access-Control-Allow-Headers", allowHeaders);
//   //允许的header类型
//   res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
//   if (req.method.toLowerCase() == 'options')
//     res.send(200);  //让options尝试请求快速结束
//   else
//     next();
// })
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  if (req.method.toLowerCase() == 'options')
    res.status(200).send({message:'OK'});  //让options尝试请求快速结束
  else
    next();
})
// 校验中间件
let auth = async (req, res, next) => {
  // 登录校验
  let token = req.headers.authorization
  if (token === undefined) {
    return res.status(401).send({
      message: 'token不存在,请先登录'
    })
  }
  let { id } = jwt.verify(token, 'hmeet')
  if (!id) {
    return res.status(401).send({
      message: '无效token,请重新登陆'
    })
  }
  req.user = await admin.findById(id)
  if (!req.user) {
    return res.status(401).send({
      message: '请重新登陆'
    })
  }
  await next()
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/home', homeRouter);
// 上传接口
let multer = require('multer')
let upload = multer({ dest: __dirname + '/public/upload' })
app.post('/upload', upload.single('file'), (req, res) => {
  let oldPath = req.file.destination + '/' + req.file.filename
  let newPath = req.file.destination + '/' + req.file.originalname
  fs.rename(oldPath, newPath, () => {
    console.log('upload success')
  })
  let imgUrl = 'https://localhost:3000/upload/' + req.file.originalname
  res.send({imgUrl})
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
