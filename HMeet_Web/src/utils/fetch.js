const baseUrl = "https://localhost:3000";

export default async (url = "", data = {}, type = "GET", method = "fetch") => {
    // 字符全部转为大写
    type = type.toUpperCase()
    // 拼接url地址
    url = baseUrl + url
    // GET方法封装
    if (type === 'GET') {
        // 拼接参数
        let dataStr = ''
        Object.keys(data).forEach((e) => {
            dataStr = dataStr + `${e}=${data[e]}&`
        })
        dataStr = dataStr.substr(0, dataStr.length - 1)
        url = `${url}?${dataStr}`
    }
    if (window.fetch) {
        let reqConfig = {
            method: type,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            mode: "cors",
            cache: "no-cache", //不缓存请求
        }
        if (type == "POST") {
            Object.defineProperty(reqConfig, "body", {
                value: JSON.stringify(data),
            });
        }
        try {
            const res = await fetch(url, reqConfig);
            const resJson = await res.json();
            return resJson;
        } catch (error) {
            throw new Error(error);
        }
    } else {
        return new Promise((resolve, reject) => {
            let res;
            // 向下兼容处理
            if (window.XMLHttpRequest) {
                res = new XMLHttpRequest();
            } else {
                res = new ActiveXObject();
            }
            let data = "";
            if (type == "POST") {
                data = JSON.stringify(data);
            }
            res.open(type, url, true);
            res.setRequestHeader(
                "Content-type",
                "application/x-www-form-urlencoded"
            );
            res.send(data);
            res.onreadystatechange = () => {
                if (res.readyState == 4) {
                    if (res.status == 200) {
                        let obj = res.response;
                        if (typeof obj !== "object") {
                            obj = JSON.parse(obj);
                        }
                        resolve(obj);
                    } else {
                        reject(res);
                    }
                }
            };
        });
    }
};