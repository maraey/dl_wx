const app = getApp()
const util =require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    total: '',
    list: [],
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {
    this.getList()
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
   * 生命周期函数--监听页面隐藏
   */
  onHide () {

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {

  },
  async getList() {
    const res = await util.request('marketer/index', {
      page: 1,
      page_size: 15,
      role: 'manager',
      keyword: this.data.name
    })
    console.log(res);
    this.setData({
      list: res.data.list
    })
  },
  sub() {
    app.globalData.seller = {
      name: this.data.info.name,
      user_id: this.data.info.user_id,

    }
    app.globalData.bd = {
      bd_id: this.data.info.bd_id,
      bd_name: this.data.info.bd_name
    }
    wx.navigateBack({
      delta: 1
    })
  },
  cancle() {
    app.globalData.seller = {
      name: '',
      user_id: 0,
    }
    app.globalData.bd = {
      bd_id: '',
      bd_name: ''
    }
    wx.navigateBack({
      delta: 1
    })
  },
  selectInfo(e) {
    console.log(e);
    if (this.data.info.user_id == e.currentTarget.dataset.item.user_id) {
      this.setData({
        info: {}
      })
    } else {
      this.setData({
        info: e.currentTarget.dataset.item
      })
    }
  },
  handleInput(e) {
    this.setData({
      name: e.detail.value
    })
    this.getList()
  }
})