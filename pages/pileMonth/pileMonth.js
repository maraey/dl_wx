// pages/pileMonth/pileMonth.js
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    package_enable: '0',
    type: 1,
    max_power: '',
    time: 1,
    amount: '',
    num: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    if (JSON.parse(options.info).type) {
      const {
        amount,
        max_power,
        num,
        package_enable,
        time,
        type
      } = JSON.parse(options.info)
      this.setData({
        amount,
        max_power,
        num,
        package_enable,
        time,
        type
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  change(e) {
    if (e.detail.value) {
      this.setData({
        package_enable: 1
      })
    } else {
      this.setData({
        package_enable: '0'
      })
    }
  },
  radioChange(e) {
    this.setData({
      type: e.detail.value
    })
  },
  handlePower(e) {
    this.setData({
      max_power: e.detail.value
    })
  },
  tabTime(e) {
    this.setData({
      time: e.currentTarget.dataset.time
    })
  },
  handleAmount(e) {
    this.setData({
      amount: e.detail.value
    })
  },
  handleNum(e) {
    this.setData({
      num: e.detail.value
    })
  },
  async btn() {
    const {
      package_enable,
      type,
      max_power,
      time,
      amount,
      num
    } = this.data
    console.log(time);
    const obj = {
      package_enable,
      type,
      max_power,
      time,
      amount,
      num
    }
    const res = await util.request('PileDevice/checkBill', {
      type: 'package',
      package_data: JSON.stringify(obj)
    })
    if (res.code == 1) {
      app.globalData.pileMonth = obj
      wx.navigateBack()
    }
  }
})