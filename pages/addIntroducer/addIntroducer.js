const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    password: '',
    status: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  handleName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  handlePhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  handlePsw(e) {
    this.setData({
      password: e.detail.value
    })
  },
  handleStatus(e) {
    let status = e.detail.value
    if (status) {
      status = 2
    } else {
      status = 1
    }
    this.setData({
      status
    })
  },
  async sub() {
    const res = await util.request('marketer/addIntroducer', {
      name: this.data.name,
      phone: this.data.phone,
      password: this.data.password,
      status: this.data.status
    })
    if (res.code == 200) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 1000
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }, 1000);
    }
  }
})