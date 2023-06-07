// pages/orderProfit/orderProfit.js
const util = require('../../utils/util')
let timer = null //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    date: '',
    order_no: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      type: options.type
    })
    if (options.type == 1) {
      this.setData({
        date: options.date
      })
    } else if (options.type == 2) {
      this.setData({
        order_no: options.order
      })
    }
    this.getList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  async getList() {
    const {
      date,
      order_no,
      type
    } = this.data
    if (type == 1) {
      const res = await util.request('user/brokerageLog', {
        month: date,
        order_no,
        is_list: 1
      })
      this.setData({
        list: res.data.list
      })
    } else {
      const res = await util.request('user/brokerageLog', {
        order_no
      })
      this.setData({
        list: res.data.list
      })
    }

  },
  handleOrder(e) {
    this.setData({
      order_no: e.detail.value
    })
  },
  handleOrder(e) {
    this.setData({
      order_no: e.detail.value
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      this.getList()
    }, 500)
  }
})