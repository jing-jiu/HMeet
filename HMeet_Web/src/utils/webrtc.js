import io from 'socket.io-client';
let socket;
let state = 'init';
let localStream;
// 本地PeerConnection
let pc;
let pcConfig = {
    "iceServers": [
        {
            "urls": ["turn:stun.al.learningrtc.cn:3478"],
            "username": "garrylea",
            "credential": "mypasswd"
        }
    ]
};
let localVideo,localAudio;
let _this;
export {
    socket, state, localStream, pc, pcConfig
}
// 媒体协商
export function call() {
    // 在joined_conn才能调用
    if (state === 'joined_conn' && pc) {
        // 接收远端视频&音频
        let options = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        }
        pc.createOffer(options).then(getOffer).catch(handleOfferError)
    }
}
export function start(self,constraints) {
    _this = self
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(getStream).catch(handleError)
    } else {
        console.error('浏览器不支持getDisplayMedia');
    }
}
export function share(self,constraints) {
    _this = self
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia(constraints).then(getStream).catch(handleError)
    } else {
        console.error('浏览器不支持getDisplayMedia');
    }
}
export function conn() {
    socket = io('https://localhost:3000');
    socket.on('connect', () => {
        console.log('连接成功');
    })
    //首先进入房间
    socket.on('joined', (room, id) => {
        state = 'joined'
        createPeerConnection();
        console.log(`首先进入房间-${room}-${id}---state--${state}`);
    })
    // 其他用户进入房间 进行通知
    socket.on('otherjoin', (room, id) => {
        if (state === 'joined_unbind') {
            createPeerConnection();
        }
        state = 'joined_conn';
        call(); //进行媒体协商
        console.log(`otherjoin-${room}-${id}---state--${state}`);
        // 媒体协商
    })
    // 房间人数已满
    socket.on('full', (room, id) => {
        // 收到full说明当前用户无法加入
        state = 'leaved'
        socket.disconnect();

        console.log(`full-${room}-${id}---state--${state}`);
    })
    // 离开房间
    socket.on('leaved', (room) => {
        state = 'leaved'
        socket.disconnect();
        console.log(`leaved-${room}---state--${state}`);
    })
    // 通知对方该用户离开
    socket.on('bye', (room, id) => {
        state = 'join_unbind';
        // 对方用户退出  则关闭PeerConnection
        closePeerConnection();

        console.log(`bye-${room}-${id}---state--${state}`);
    })
    // 收到消息
    socket.on('message', (room, data) => {
        console.log(`message-${room}`);

        if (data.type === 'offer') {
            pc.setRemoteDescription(new RTCSessionDescription(data));
            pc.createAnswer().then(getAnswer).catch(handleAnswerError)
        } else if (data.type === 'answer') {
            pc.setRemoteDescription(new RTCSessionDescription(data));
        } else if (data.type === 'candidate') {
            let candidate = new RTCIceCandidate({
                sdpMLineIndex: data.label,
                candidate: data.candidate
            })
            pc.addIceCandidate(candidate);
        } else {
            console.error(data);
        }
    })
    // 加入房间 
    socket.emit('join', _this.$store.state.meet.number,_this.$store.state.meet.name)
    return;
}
export function closeLocalMedia() {
    if (localStream && localStream.getTracks()) {
        localStream.getTracks().forEach((t) => {
            t.stop()
        })
    }
    localStream = null;
}
export function sendMessage(room, data) {
    console.log('send message to other client', room);
    if (!socket) {
        console.log('socket is null');
    }
    socket.emit('message', room, data);
}
export function createPeerConnection() {
    //如果是多人的话，在这里要创建一个新的连接.
    //新创建好的要放到一个map表中。
    //key=userid, value=peerconnection
    console.log('create RTCPeerConnection!');
    // 本地PeerConnection是否存在
    if (!pc) {
        pc = new RTCPeerConnection(pcConfig);
        pc.onicecandidate = (e) => {
            console.log('onicecandidate');
            if (e.candidate) {
                console.log(e.candidate);
                // 创建SDP数据 发送消息给远端
                sendMessage(_this.$store.state.meet.number, {
                    type: 'candidate',
                    label: e.candidate.sdpMLineIndex,
                    id: e.candidate.sdpMid,
                    candidate: e.candidate.candidate
                });
            } else {
                console.log('this is the end candidate');
            }
        }
        pc.ontrack = getRemoteStream;
    } else {
        console.warning('the pc have be created!');
    }
    console.log('bind tracks into RTCPeerConnection!');

    if (localStream === null || localStream === undefined) {
        console.error('localstream is null or undefined!');
        return false;
    }
    //add all track into peer connection
    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });
    return true;
}
export function closePeerConnection() {
    if (pc) {
        pc.close();
        pc = null;
    }
}
export function getStream(stream) {
    // 等待媒体流获取完毕后进行连接
    if (_this.isVideo || _this.isShare) {
        _this.$refs.localVideo.srcObject = stream;
        localStream = stream;
    }
    if (_this.isAudio) {
        _this.$refs.localAudio.srcObject = stream;
        localStream = stream;
    }
    conn();
}
export function handleError(err) {
    console.error(err.name + ':' + err.message);
}
export function getRemoteStream(e) {
    if (_this.isVideo) {
        _this.$refs.remoteVideo.srcObject = e.streams[0];
      }
      if (_this.isAudio) {
        _this.$refs.remoteAudio.srcObject = e.streams[0];
      }
    //   _this.$refs.remoteVideo.srcObject = e.streams[0];
}
export function getOffer(desc) {
    // 设置本地的描述信息，添加到peerconnection
    pc.setLocalDescription(desc)
    sendMessage(_this.$store.state.meet.number, desc)
}
export function getAnswer(desc) {
    // 收集候选者
    // 远端设置本地描述信息
    pc.setLocalDescription(desc)
    //发送描述信息SDP到signal信令服务端，与pc1进行交换
    sendMessage(_this.$store.state.meet.number, desc)
}
export function handleOfferError(err) {
    console.log('创建offer失败' + err);
}
export function handleAnswerError(err) {
    console.log('创建answer失败' + err);
}