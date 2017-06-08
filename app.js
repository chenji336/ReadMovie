App({
  // 这个就是全局的，就算我子页面关闭了，但是这个值还是在的，有些时候使用缓存就过了，使用这种全局的变量就好
  globalData:{
      isPlaying:false,
      playIndex:-1,
      doubanBaseUrl:'https://api.douban.com'
  },
  onLaunch: function () {
    
  },
  onShow: function () {
    
  },
  onHide: function () {
    // 在后台运行的时候可以看到，在最左边栏目有个后台，可以点击模拟
  },
  onError: function (msg) {
  }
})