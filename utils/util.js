function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 0; i < 5; i++) {
        if (i < num) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}

function http(url, callback) {
    wx.request({
        url: url,
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { "Content-Type": "json" }, // 这里不能设置为application/json否则会报错,空也不行了，但是可以随便填写任意值
        success: function (res) {
            // 不需要跨域应该是微信把请求放在了自己的后端请求的，然后在返回给前端，你会发现没有header头
            callback(res.data);
        },
        fail: function (res) {
            console.log('error');
        }
    })
}

function convertToCastString(casts) {
    var castsjoin = "";
    for (var idx in casts) {
        castsjoin = castsjoin + casts[idx].name + " / ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
    var castsArray = []
    for (var idx in casts) {
        var cast = {
            img: casts[idx].avatars ? casts[idx].avatars.large : "",
            name: casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}

module.exports = {
    convertToStarsArray: convertToStarsArray,
    http: http,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos
}