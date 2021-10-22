import fetch from "./fetch";

// 登录接口
export const login = (data) => {
    return fetch(
        "/login/login",
        {
            username: data.username,
            password: data.password,
        },
        "POST"
    );
}

// 发送验证码接口
export const sendCode = (data) => {
    return fetch(
        "/login/forget",
        {
            email: data.email,
        },
        "GET"
    );
}

// 验证码校验接口
export const forget = (data) => {
    return fetch(
        "/login/forget",
        {
            email: data.email,
            checkCode: data.checkCode,
        },
        "POST"
    );
}

// 重置密码接口
export const reset = (data) => {
    return fetch(
        "/login/reset",
        {
            username: data.username,
            password: data.password,
        },
        "POST"
    );
}

// 加入会议接口
export const joinMeet = (data) => {
    return fetch(
        "/home/join",
        {
            number: data.number,
            name: data.name,
            username:data.username
        },
        "POST"
    );
}

// 快速会议接口
export const quicklyMeet = (data) => {
    return fetch(
        "/home/quickly",
        {
            name: data.name,
            number:data.number,
            meetName:data.meetName,
            username:data.username
        },
        "POST"
    );
}

// 退出会议接口
export const outMeet = (data) => {
    return fetch(
        "/home/out",
        {
            name: data.name,
            number:data.number,
            username:data.username
        },
        "POST"
    );
}

// 结束会议接口
export const closeMeet = (data) => {
    return fetch(
        "/home/close",
        {
            number:data.number,
            name:data.name
        },
        "POST"
    );
}

// 修改信息接口
export const modify = (data) => {
    return fetch(
        "/home/modify",
        {   
            avator:data.avator,
            nickname:data.nickname,
            password:data.password,
            username:data.username
        },
        "POST"
    );
}

// 历史会议接口
export const getHistory = (data) => {
    return fetch(
        "/home/history",
        {   
            username:data.username
        },
        "POST"
    );
}