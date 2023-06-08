// pages/login/login.js
const util = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {},

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
  handlePhone(e) {
    this.setData({
      phone: e.detail.value
    })
    console.log(e)
  },
  handlePsw(e) {
    this.setData({
      password: e.detail.value
    })
  },
  async login() {
    const res = await util.request('Auth/login', {
      phone: this.data.phone,
      password: this.data.password
    })
    console.log(res);
    if (res.code == 200) {
      wx.setStorage({
        key: "login_info",
        data: res.data
      })
      app.globalData.info = res.data
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
  },
  forget() {
    wx.navigateTo({
      url: '/pages/forget/forget',
    })
  }
})