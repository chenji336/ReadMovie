// pages/welcome/welcome.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log("onLoad");
  },
  onReady:function(){
    // 页面渲染完成
    console.log("onReady");
  },
  onShow:function(){
    // 页面显示
    console.log("onShow");
  },
  onTap:function(){
    console.log("tap");

    // redirectTo是页面直接的跳转，不会出现返回按钮
    // 这个触发onUnload，是被卸载了，因为没有返回按钮
    // redirectTo是不能跳转到tab页面的，需要使用switchTab
    wx.switchTab({
      url: '../posts/post',
      success: function(res){
        console.log('redirectTo success');
      },
      fail: function(res) {
        // fail
        console.log('redirectTo fail');
      },
      complete: function(res) {
        // complete
        console.log('redirectTo complete');
      }
    })

    // navigateTo是向子集跳转，会出现返回按钮，而且最多不能子集嵌套五层，这个是小程序为了简洁性
    // 这个会触发onHide，因为有返回按钮，所以这个页面还是存在的，只是隐藏起来了
    // wx.navigateTo({
    //   url: '../posts/post',
    //   success: function(res){
    //     console.log('navigateTo success');
    //   },
    //   fail: function(res) {
    //     // fail
    //     console.log('navigateTo fail');
    //   },
    //   complete: function(res) {
    //     // complete
    //     console.log('navigateTo complete');
    //   }
    // })
  },
  onHide:function(){
    // 页面隐藏
    console.log("onHide");
  },
  onUnload:function(){
    // 页面关闭
    console.log("onUnload");
  }
})