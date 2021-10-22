var socketio = {};
var socket_io = require('socket.io');
var moment = require('moment');
// 导入模型
let MeetNumber = require('../model/MeetNumber')
let HMeetUser = require('../model/HMeetUser')
// 对象数组去重
function unique(objArr, name) {
    let result = {};
    let finalResult = [];
    for (let i = 0; i < objArr.length; i++) {
        result[objArr[i][name]] = objArr[i];
    }
    for (i in result) {
        finalResult.push(result[i]);
    }
    return finalResult;
}
//获取io 
socketio.getSocketio = function (server) {
    var io = socket_io(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    const USERCOUNT = 3
    //通过of()设置命名空间
    io
        .of('/chat')
        .on('connection', function (socket) {
            socket.on('sendMeet', async (meet,root) => {
                let { name, number, username } = meet
                // 加入一个房间  以便后期广播使用
                socket.join(number);
                // 加入joiner,avator
                // 根据username拿到avator
                let { avator } = await HMeetUser.findOne({ username })

                let { joiner, activer } = await MeetNumber.findOne({ meetNumber: number })

                joiner.push(
                    {
                        user: name,
                        joinTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                        outTime: null,
                        avator,
                    }
                )
                activer.push(
                    {
                        user: name,
                        avator,
                    }
                )
                // 去重
                joiner = unique(joiner, 'user')
                activer = unique(activer, 'user')
                // 更新
                let user = await MeetNumber.findOneAndUpdate({ meetNumber: number }, { joiner, activer }, { new: true })
                if(root && root == 1){
                    io.of('/chat').to(number).emit('root', meet)
                }
                io.of('/chat').to(number).emit('receiveMeet', user.activer)
            })
            socket.on('user_leave', (data) => {
                console.log('====================================');
                console.log(data);
                console.log('====================================');
            })
        });
    io.sockets.on('connection', function (socket) {
        //加入房间     socket.join(name);    前端发送加入房间请求   后端允许才能真正加入到房间
        socket.on('join', function (room, name) {
            socket.join(room);
            console.log(`${name} 加入房间 ${room}`);
            let myRoom = io.sockets.adapter.rooms.get(room)
            let users = [...myRoom] || []
            console.log(users);
            // 人数限制
            if (users.length < USERCOUNT) {
                //io.in(room).emit('joined',{
                //     id:name,
                //     room:room
                // })
                // 谁访问给谁发
                socket.emit('joined', room, name)
                if (users.length > 1) {
                    // 第二个加入的用户 给其他人发消息 提示用户进入
                    socket.to(room).emit('otherjoin', room, name)
                }
            } else {
                // 大于等于三 提示房间人数已满 让其离开
                socket.leave(room)
                socket.emit('full', room, name)
            }
        });
        socket.on('leave', (room, name) => {
            let myRoom = io.sockets.adapter.rooms.get(room)
            let users = [...myRoom] || []
            console.log(users);
            // 给其他人发送bye 给自己发送leave
            socket.emit('leaved', room)
            socket.to(room).emit('bye', room, name)
        })
        socket.on('message', function (room, data) {
            // io.in(data.room).emit('message',data)
            // 给房间其他人做中转
            socket.to(room).emit('message', room, data)
        });
    });
};

module.exports = socketio;