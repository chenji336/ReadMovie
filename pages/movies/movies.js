var app = getApp();
var util=require('../../utils/util.js');
var baseUrl = app.globalData.doubanBaseUrl;
// pages/movies/movies.js
Page({
  data: {
    // 这里还是先需要添加的，因为ajax是异步的，如果下面没有没申明的话会报错
    inTheater:{},
    comeSoon:{},
    top250:{},
    searchResult:{},
    containerShow:true,
    searchPanelShow:false
  },
  onLoad: function (options) {
    var inTheater = baseUrl + '/v2/movie/in_theaters?start=0&count=3';
    var comeSoon = baseUrl + '/v2/movie/coming_soon?start=0&count=3';
    var top250 = baseUrl + '/v2/movie/top250?start=0&count=3';
    // 页面初始化 options为页面跳转所带来的参数
    this.getMovieListData(inTheater,'inTheater','正在热映');
    this.getMovieListData(comeSoon,'comeSoon','即将上映');
    this.getMovieListData(top250,'top250','豆瓣Top250');

  },
  getMovieListData: function (url,settedKey,categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "Content-Type": "json" }, // 这里不能设置为application/json否则会报错,空也不行了，但是可以随便填写任意值
      success: function (res) {
        // 不需要跨域应该是微信把请求放在了自己的后端请求的，然后在返回给前端，你会发现没有header头
        console.log(res);
        that.processDoubanData(res.data,settedKey,categoryTitle);
      },
      fail: function (res) {
        console.log('error');
        console.log(res);
      }
    })
  },
  processDoubanData: function (moviesDouban,settedKey,categoryTitle) {
    var movies = [];
    var subjects = moviesDouban.subjects;
    for (var idx in subjects) {
      var subject = subjects[idx];
      var title = subject.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }
    var readyData={};
    readyData[settedKey]={movies:movies,categoryTitle:categoryTitle};
    this.setData(readyData);
  },
  onMoreTap:function(event){
    // 不知道为什么wxml用categoryTitle就报错，不能使用了
    var categoryTitle=event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'movie-more/movie-more?category='+categoryTitle
    })
    console.log(categoryTitle);
  },
  onMovieTap:function(event){
    var movieId=event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId
    })
  },
  onBindFocus:function(){
    this.setData({
      containerShow:false,
      searchPanelShow:true
    });
  },
  onBindConfirm:function(event){
    var searchText=event.detail.value;
    // console.log(name);
    var searchResult = baseUrl + '/v2/movie/search?q='+searchText;
    this.getMovieListData(searchResult,'searchResult',''); 
  },
  onCancelImageTap:function(){
    this.setData({
      containerShow:true,
      searchPanelShow:false
    });
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