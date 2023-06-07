// pages/endOrder/endOrder.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    info: {},
    remark: '',
    is_lose: '0',
    amount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getInfo()
  },
  async getInfo() {
    const res = await util.request('order/detail', {
      order_no: this.data.id
    })
    this.setData({
      info: res.data
    })
  },
  amount(e) {
    this.setData({
      amount: e.detail.value
    })
  },
  remark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  changeRadio(e){
    this.setData({
      is_lose:e.detail.value
    })
  },
  async end(){
    const {info,is_lose,amount,remark} = this.data
    const res = await util.request('order/endOrder',{
      order_type:info.order_type,
      is_lose,
      amount,
      remark,
      order_no:info.order_no
    })
    if(res.code==200){
      wx.showToast({
        title: res.msg,
        icon:'success'
      })
      setTimeout(()=>{
        wx.navigateBack()
      },1000)
    }
  }
})