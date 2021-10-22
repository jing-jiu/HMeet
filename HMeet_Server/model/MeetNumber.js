const mongoose = require('mongoose')
const schma = new mongoose.Schema({
    creater: { type: String },//创建者
    meetType: { type: String },//会议类型  快速会议/预定会议
    meetNumber: { type: String },//会议号
    meetName: { type: String },//会议名称
    joinTime: { type: String },//入会时间
    startTime: { type: String },//开始时间
    endTime: { type: String },//结束时间
    selfJoinTime: { type: String },//参会时长
    joiner: [
        {
            user: { type: String },
            joinTime: { type: String },
            outTime: { type: String },
            avator: { type: String },
        }
    ], // 参会成员
    record: { type: String }, //聊天记录
    selfNote: { type: String },//个人笔记
    activer: [
        {
            user: { type: String },
            avator: { type: String },
        }
    ]//用joiner收集所有参加会议成员 用activer收集当前在线人数
})

module.exports = mongoose.model('MeetNumber', schma)