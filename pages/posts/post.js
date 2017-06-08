// 只能使用相对路径，绝对路径报错
var postData = require("../../data/posts-data.js");

// pages/posts/post.js
Page({
  data: {
    // 这样进行绑定也可以
    //  data_key:postData.postData
  },
  onPostTab: function (event) {
    var target = event.currentTarget;
    var postId = target.dataset.postid;
    // console.log('postID: '+postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  onSwiperTap: function (event) {
    // 因为我利用了委托事件的方法，所以这里需要点击子孙来进行触发，所以使用target
    var target = event.target;
    var postId = target.dataset.postid;
    // console.log('postID: '+postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  onLoad: function (options) {
    // data文件夹相当于模仿数据库中的文件
    // 也相当于数据模块化了
    this.setData({
      data_key: postData.postData
    });

    // 下面的方法是很早版本才有效的，现在不考虑
    // this.data.data_key=postData.postData;
  },
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