// pages/orderDetail/orderDetail.js
const app = getApp()
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '',
    info:{},
    login_info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {
    console.log(options);
    this.setData({
      order_id: options.id,
      login_info:app.globalData.info
    })
    // wx.getStorage({
    //   key: 'login_info',
    //   success: (res)=> {
    //     console.log(res.data)
    //     this.setData({
    //       login_info:res.data
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    this.getInfo()
  },
  async getInfo() {
    const res = await util.request('order/detail', {
      order_no: this.data.order_id
    })
    this.setData({
      info:res.data
    })
  }
})