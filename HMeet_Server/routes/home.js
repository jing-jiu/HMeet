var express = require('express');
var moment = require('moment');

var router = express.Router();
let MeetNumber = require('../model/MeetNumber')
let HMeetUser = require('../model/HMeetUser')

function delActive(arr, id, tag) {
  let res = []
  arr.forEach((e) => {
    if (e[tag] != id) {
      res.push(e)
    }
  })
  return res
}

function updateJoin(arr, user, tag, key, value) {
  arr.forEach((e, i) => {
    if (e[tag] == user) {
      arr[i][key] = value
    }
  })
}
// 当前正在进行的会议
router.post('/', async function (req, res, next) {
  res.send('respond with a resource');
});

// 历史会议
router.post('/history', async function (req, res, next) {
  let {username} = req.body
  let {historyMeet} = await HMeetUser.findOne({username})
  res.send(historyMeet);
});

// 修改信息接口
router.post('/modify', async function (req, res, next) {
  let {username,nickname,password,avator} = req.body
  await HMeetUser.findOneAndUpdate({ username }, { nickname, avator,password }, { new: true })
});

// 加入会议接口
router.post('/join', async function (req, res, next) {
  let { number, name,username } = req.body
  let user = await MeetNumber.findOne({ meetNumer: number })
  if (!user) {
    return res.status(422).send({
      message: "无效会议号",
      status: 422,
      user
    })
  } else {
    let {historyMeet} =  await HMeetUser.findOne({ username })
    historyMeet.push(`${number}--${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}`)
    historyMeet = Array.from(new Set(historyMeet))
    await HMeetUser.findOneAndUpdate({ username }, { historyMeet }, { new: true })
    return res.status(200).send({
      message: "正在进入会议",
      status: 200
    })
  }
});

// 创建/快速会议接口
router.post('/quickly', async function (req, res, next) {
  // 获取用户昵称及会议号
  let { number, name, meetName, username } = req.body
  // 增加信息
  let { avator } = await HMeetUser.findOne({ username })
  let meetNumber = {
    creater: name,
    meetNumber: number,
    meetName,
    meetType: '0',
    startTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    endTime: null,
    joiner: [
      {
        user: name,
        joinTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        outTime: null,
        avator,
      }
    ],
  }
  let user = await MeetNumber.findOne({ meetNumber: number })
  if (user) {
    return res.status(422).send({
      message: "已创建会议",
      status: 422,
    })
  } else {
    let { creater, meetNumer, meetType, startTime, endTime, joiner } = await MeetNumber.create(meetNumber)
    let data = { creater, meetNumer, meetType, startTime, root: 1 }
    let {historyMeet} =  await HMeetUser.findOne({ username })
    historyMeet.push(`${meetNumer}--${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}`)
    historyMeet = Array.from(new Set(historyMeet))
    await HMeetUser.findOneAndUpdate({ username }, { historyMeet }, { new: true })
    return res.status(200).send({
      message: "创建成功",
      status: 200,
      data
    })
  }
});

// 退出会议接口
router.post('/out', async function (req, res, next) {
  let { name, number } = req.body
  // 根据number查到对应会议号 将这个用户从activer中删除 并更新joiner中这个用户的endTime
  let { activer, joiner } = await MeetNumber.findOne({ meetNumer: number })

  activer = delActive(activer, name, 'user')
  // 更新退出时间
  updateJoin(joiner, name, 'user', 'outTime', moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'))
  // 更新数据库中的activer,joiner
  let user = await MeetNumber.findOneAndUpdate({ meetNumber: number }, { activer, joiner }, { new: true })
  return res.status(200).send({
    message: "退出成功",
    status: 200,
  })
});

// 结束会议接口
router.post('/close', async function (req, res, next) {
  let { number, name } = req.body
  // 根据number查到对应会议号 将这个用户从activer中删除 并更新joiner中这个用户的endTime
  let { activer, joiner, meetNumber } = await MeetNumber.findOne({ meetNumer: number })

  activer = delActive(activer, name, 'user')
  // 更新退出时间
  updateJoin(joiner, name, 'user', 'outTime', moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'))
  // 更新数据库中的activer,joiner
  let user = await MeetNumber.findOneAndUpdate({ meetNumber: number }, { meetNumber: `${meetNumber}--${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}`, activer, joiner }, { new: true })
  return res.status(200).send({
    message: "结束会议",
    status: 200,
  })
});

module.exports = router;
