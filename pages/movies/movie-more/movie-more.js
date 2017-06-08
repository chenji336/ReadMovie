var app = getApp();
var util = require('../../../utils/util.js');

// pages/movies/movie-more/movie-more.js
Page({
  data: {
    movies: [],
    requestUrl: "",
    totalCount: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var categoryTitle = options.category;
    this.setData({
      category: categoryTitle
    });

    var baseUrl = app.globalData.doubanBaseUrl;
    var dataUrl = "";
    switch (categoryTitle) {
      case '正在热映':
        dataUrl = baseUrl + '/v2/movie/in_theaters';
        break;
      case '即将上映':
        dataUrl = baseUrl + '/v2/movie/coming_soon';
        break;
        break;
      case '豆瓣Top250':
        dataUrl = baseUrl + '/v2/movie/top250';
        break;
    }
    util.http(dataUrl, this.processDoubanData);
    this.setData({
      requestUrl: dataUrl
    });
  },
  onReady: function () {
    // 页面渲染完成
    // setNavigationBarTitle只能在onReady以及之后才能有效果，否则不会显示
    wx.setNavigationBarTitle({
      title: this.data.category
    })
  },
  onScrollToLower: function () {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onReachBottom: function () {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh: function () {
    this.setData({
      movies: [],
      totalCount: 0
    });
    var url = this.data.requestUrl + '?start=0&count=20';
    util.http(this.data.requestUrl, this.processDoubanData);
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
  processDoubanData: function (moviesDouban) {
    // 这部分当然也是可以抽取出来的，看自己是否需要抽取
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
    var totalCount = this.data.totalCount;
    var totalMovies = this.data.movies;
    totalCount += 20;
    totalMovies = totalMovies.concat(movies);
    this.setData({
      totalCount: totalCount
    });
    this.setData({ movies: totalMovies });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
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