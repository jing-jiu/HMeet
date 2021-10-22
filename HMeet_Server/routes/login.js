var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
let HMeetUser = require('../model/HMeetUser')
let CheckCode = require('../model/CheckCode')
let sendMail = require('../utils/sendMail')
let code, email;
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// 登录接口
router.post('/login', async function (req, res, next) {
  let { username, password } = req.body
  let user = await HMeetUser.findOne({ username }).select('+password')
  // 检验用户名
  if (!user) {
    // 注册用户
    let info = {
      username:req.body.username,
      password:req.body.password,
      nickname:'用户',
      onlyCode:Math.floor(Math.random()*1000000),
      avator:'https://i02piccdn.sogoucdn.com/3a85f4c7f64ff351',
      historyMeet:[],
    }
    let {nickname,onlyCode,avator,_id,username} = await HMeetUser.create(info)

    let data = {nickname,onlyCode,avator,username,message: `新建用户${username}`}
    let jwt = require('jsonwebtoken')
    let token = jwt.sign({ id: _id }, 'hmeet')
    return res.status(200).send({
      token,
      data,
      status: 200,
    })
  }
  // 检验密码
  let isValid = require('bcrypt').compareSync(password, user.password)
  if (!isValid) {
    return res.status(422).send({
      message: '用户名或密码错误',
      status: 422
    })
  }
  // 返回token
  let jwt = require('jsonwebtoken')
  let token = jwt.sign({ id: user._id }, 'hmeet')
  let {nickname,onlyCode,avator,_id} = user
  let data = {nickname,onlyCode,avator,username,message: `欢迎${username}`}
  res.send({
    token,
    data,
    status: 200
  })
});

// 发送验证码接口
router.get('/forget', async (req, res, next) => {
  let code = await CheckCode.create({
    email:req.query.email,
    code:sendMail(email),
    createAt: Date.now()
  })
  if (code) {
    res.status(200).send({
      message: '发送成功！',
      status: 200
    })
  } else {
    res.status(422).send({
      message: '发送失败，请重新获取！',
      status: 422
    })
  }
})

//验证码校验接口 
router.post('/forget', async (req, res, next) => {
  let code = await HMeetUser.findOne({ email:req.body.email })
  if (code && code.code == req.body.checkCode) {
    res.status(200).send({
      message: '验证成功',
      status: 200,
      code
    })
  } else {
    res.status(422).send({
      message: '验证失败',
      status: 422
    })
  }
})

// 重置密码登录接口
router.post('/reset', async function (req, res, next) {
  let { username, password } = req.body
  let { _id } = await HMeetUser.findOne({ username })
  let update = await HMeetUser.findByIdAndUpdate(_id, {password},{ new: true })
  if (!update) {
    res.status(200).send({
      message: `重置${username}密码失败`,
      status: 422
    })
  } else {
    // 返回token
    let jwt = require('jsonwebtoken')
    let token = jwt.sign({ id: update._id }, 'hmeet')

    let {nickname,onlyCode,avator,_id} = update
    let data = {nickname,onlyCode,avator,message: `欢迎${username}`}
    res.send({
      token,
      data,
      status: 200
    })
  }
});
module.exports = router;
