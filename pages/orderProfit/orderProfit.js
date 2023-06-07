// pages/orderProfit/orderProfit.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '', //当前日期 2022-04
    month: '', //当前月份 04
    total: '', //总金额
    year: '',
    order_no: '',
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let month = new Date().getMonth()+1
    if (month < 10) {
      month = "0" + (month)
    }
    this.setData({
      date: `${new Date().getFullYear()}-${month}`,
      month,
      year: `${new Date().getFullYear()}`
    })
    this.getInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  async getInfo() {
    const res = await util.request('user/brokerageMonth', {
      month: this.data.date
    })
    this.setData({
      list:[],
      total:0
    })
    const {
      list,
      total
    } = res.data
    this.setData({
      list,
      total
    })
  },
  bindDateChange(e) {
    console.log(e.detail.value);
    console.log(e.detail.value.slice(-2));
    console.log( typeof(e.detail.value) );
    this.setData({
      date: e.detail.value,
      month:e.detail.value.slice(-2)
    })
    this.getInfo()
  },
  handleOrder(e) {
    this.setData({
      order_no: ''
    })
    wx.navigateTo({
      url: `/pages/orderProfitDetail/orderProfitDetail?type=2&order=${e.detail.value}`,
    })
  },
  orderProfitDetail(e) {
    let date = e.currentTarget.dataset.date
    date = date.replace('月', '-')
    date = date.replace('日', '')
    date = `${this.data.year}-${date}`
    wx.navigateTo({
      url: `/pages/orderProfitDetail/orderProfitDetail?type=1&date=${date}`,
    })
  }
})