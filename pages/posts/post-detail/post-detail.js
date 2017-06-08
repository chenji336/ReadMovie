// 只能使用相对路径，绝对路径报错
var postData = require("../../../data/posts-data.js");
// 获取app.js里面的全局变量数据
var app=getApp();

// pages/posts/post-detail/post-detail.js
Page({
  data: {
    isPlaying: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('optionsID: ' + options.id);
    var postId = options.id
    this.setData({
      postData: postData.postData[postId]
    });

    // 这个主要是为了能在后面的事件中调用到postId，否则调用不到
    this.setData({
      postId: postId
    });

    // 对文件搜藏进行操作，一般要考虑清楚，else就算没有什么操作最好也不要省略，比如={}，如果没有的话，在后面有些地方就要进行判断了
    var postsCollection = wx.getStorageSync('post_collect');
    if (postsCollection) {
      var collected = postsCollection[postId];
      this.setData({
        collected: collected
      });
    } else {
      postsCollection = {};
      wx.setStorageSync('post_collect', postsCollection)
    }
   
    this.setAudioMonitor();
  },
  setAudioMonitor: function () {
    // 音乐播放出现的一个问题，就是当你微信框架弹出的总开关进行开关的时候，我们自己的程序图标没有改变
    // 要解决这个问题就需要让框架来调用我们的代码，这就需要进行事件的监听了
    // 这里面可以放在playBGM事件中，但是建议放在onload里面，这样一进来就可以进行监听的
    var global=app.globalData;
    var g_isPlaying=global.isPlaying;
    var g_playIndex=global.playIndex;
    if(g_isPlaying&&g_playIndex===this.data.postId){
      this.setData({
        isPlaying:true
      });
    }
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlaying: true
      });
      global.isPlaying=true;
      global.playIndex=that.data.postId;
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlaying: false
      });
      global.isPlaying=false;
    })
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlaying: false
      });
      global.isPlaying=false;
    })
  },
  onCollectionTap: function (event) {
    // ************对缓存的测试**********************
    // wx.setStorageSync('key', {
    //   暴雪游戏名称2: 'dota'
    // })
    // wx.setStorageSync('key1', {
    //   拳头: 'lol'
    // })
    // ************对缓存的测试**********************

    // 这里建议使用同步，因为数据量也不是很大，没有必要使用异步
    this.getPostCollectionSyn();
    // this.getPostCollectionAsyn();
  },
  getPostCollectionSyn: function () {
    // 同步的取数据
    var postsCollection = wx.getStorageSync('post_collect');
    var postId = this.data.postId;
    //  搜藏的操作，已搜藏变成未搜藏，未搜藏变成已搜藏
    postsCollection[postId] = !postsCollection[postId];
    var collected = postsCollection[postId];
    // 对函数进行包装，这里更适合使用showToast
    this.showToast(postsCollection, collected);
    // this.showModal(postsCollection,collected);
  }
  ,
  getPostCollectionAsyn: function () {
    // 异步取数据，比如ajax就是异步取数据，异步的使用需要结合业务来，一般能用同步就不要使用异步
    // 异步一般使用在需要进行长时间等候的时候才会使用到，但是不好调试，太多可能会产生异步的回调地狱
    var that = this;
    var postsCollection = wx.getStorage({
      key: 'post_collect',
      success: function (res) {
        var postsCollection = res.data;
        var postId = that.data.postId;
        postsCollection[postId] = !postsCollection[postId];
        var collected = postsCollection[postId];
        // 对函数进行包装，这里更适合使用showToast
        that.showToast(postsCollection, collected);
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    });
  }
  ,
  onShareTap: function (event) {
    // ************对缓存的测试**********************
    // wx.removeStorageSync('key');
    // wx.clearStorageSync();
    // ************对缓存的测试**********************

    var that = this;
    var itemList = ['分享到朋友圈', '分享到QQ', '分享到空间'];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function (res) {
        wx.showModal({
          title: '分享',
          content: '我' + itemList[res.tapIndex] + "---" + res.cancel
        });
      }
    });
  },
  showToast: function (postsCollection, collected) {
    // 要进行更新，否则前台无法更换
    this.setData({
      collected: collected
    });
    wx.setStorageSync('post_collect', postsCollection)

    // 提示框
    wx.showToast({
      title: collected ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: 'success'
    });
  },
  showModal: function (postsCollection, collected) {
    // 之前对这个还不是很熟悉，现在已经很了解了，this代表上下文，如果进入了一个别的方法函数什么的有可能会改变上下文
    var that = this;
    wx.showModal({
      title: '搜藏',
      content: collected ? '是否搜藏？' : '是否取消搜藏？',
      showCancel: true,
      confirmText: '确定',// 就算把确定放在了前面界面上还是确定在右边，不过这个是合理的，一般右手玩手机
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          // 要进行更新，否则前台无法更换
          that.setData({
            collected: collected
          });
          wx.setStorageSync('post_collect', postsCollection)
        }
      }
    });
  },
  onPlayBGM: function () {
    if (this.data.isPlaying) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlaying: false
      });
    } else {
      // 如果你定义了postData，然后在去使用的话，会把最上面定义的postData给覆盖掉
      var postData = this.data.postData;
      var music = postData.music;
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg
      });
      this.setData({
        isPlaying: true
      });
    }

  }
  ,
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})