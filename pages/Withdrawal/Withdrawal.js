// pages/Withdrawal/Withdrawal.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply: {},
    amount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getInfo()
  },
  edit() {
    wx.navigateTo({
      url: '/pages/editWithdrawal/editWithdrawal',
    })
  },
  async getInfo() {
    const res = await util.request('user/withdrawalAccount')
    if (res.code == 1) {
      this.setData({
        apply: res.data
      })
    } else if (res.code == 301) {
      wx.showToast({
        title: '请添加提现信息',
        icon:'none'
      })
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/editWithdrawal/editWithdrawal?type=add',
        })
      },1000)
      
    }
  },
  handleAmount(e) {
    this.setData({
      amount: e.detail.value
    })
  },
  async sub() {
    const res = await util.request('user/withdrawalApply', {
      amount: this.data.amount,
      account_id: this.data.apply.id
    })
    if (res.code == 1) {
      wx.showToast({
        title: '发送提现申请成功',
        icon: 'success'
      });
      setTimeout(() => {
        wx.navigateBack()
      }, 800)
    }
  }
})