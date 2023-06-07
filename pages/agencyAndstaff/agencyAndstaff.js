// pages/agencyAndstaff/agencyAndstaff.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screen_type:'agency'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {

  },
  screen(e){
    this.setData({
      screen_type: e.currentTarget.dataset.type
    })
  }
})