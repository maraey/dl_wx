// pages/adjustPrice/adjustPrice.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    week: [{
        week: '周一',
        select: false,
        value: '1'
      },
      {
        week: '周二',
        select: false,
        value: '2'
      },
      {
        week: '周三',
        select: false,
        value: '3'
      },
      {
        week: '周四',
        select: false,
        value: '4'
      },
      {
        week: '周五',
        select: false,
        value: '5'
      },
      {
        week: '周六',
        select: false,
        value: '6'
      },
      {
        week: '周日',
        select: false,
        value: '7'
      },
    ],
    device_rate: '',
    bindSeller: false,
    seller: [],
    sellerNew: [],
    delList: [],
    addList: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  async getDetail() {
    const res = await util.request('seller/adjustDetail')
    const {
      start_time,
      start_date,
      end_time,
      end_date,
      device_rate,
      weeks,
      seller
    } = res.data
    const week = this.data.week
    week.forEach(item => {
      if (weeks.indexOf(item.value) != -1) {
        item.select = true
      }
    })
    const nSeller = []
    seller.forEach(item => {
      nSeller.push(item.id)
    })
    this.setData({
      start_time,
      start_date,
      end_time,
      end_date,
      device_rate,
      week,
      seller: nSeller
    })
  },
  bindStartDate(e) {
    this.setData({
      start_date: e.detail.value
    })
  },
  bindEndDate(e) {
    this.setData({
      end_date: e.detail.value
    })
  },
  bindStartTime(e) {
    this.setData({
      start_time: e.detail.value
    })
  },
  bindEndChange(e) {
    this.setData({
      end_time: e.detail.value
    })
  },
  bindDeviceRate(e) {
    this.setData({
      device_rate: e.detail.value
    })
  },
  selectWeek(e) {
    if (e.target.dataset.week || e.target.dataset.week == 0) {
      const week = this.data.week
      week[e.target.dataset.week].select = !week[e.target.dataset.week].select
      this.setData({
        week
      })
    }
  },
  cancleSeller() {
    this.setData({
      bindSeller: false
    })
  },
  bindSeller() {
    this.setData({
      bindSeller: true
    })
  },
  selectSeller(e) {
    const list = e.detail.list
    const seller = this.data.seller
    const nList = []
    list.forEach(item => {
      nList.push(item.id)
    })
    console.log(list);
    console.log(nList);
    if (e.detail.type == 1) {
      console.log(111);
      nList.forEach(item => {
        if (seller.indexOf(item) != -1) {
          seller.splice(seller.indexOf(item), 1)
        }
      })
      console.log(nList);
      const delList = this.data.delList
      delList.push(...nList)
      const ndelList = [...new Set(delList)]
      this.setData({
        delList: ndelList
      })
    } else if (e.detail.type == 2) {
      console.log(222);
      nList.forEach(item => {
        if (seller.indexOf(item) == -1) {
          seller.push(item)
        }
      })
      const addList = this.data.addList
      addList.push(...nList)
      const naddList = [...new Set(addList)]
      this.setData({
        addList: naddList
      })
    }
    this.setData({
      seller
    })
    this.cancleSeller()
  },
  async sub() {
    const weeks = []
    this.data.week.forEach(item => {
      if (item.select) {
        weeks.push(item.value)
      }
    })
    const {
      start_date,
      start_time,
      end_date,
      end_time,
      device_rate
    } = this.data
    const res = await util.request('seller/setAdjustPrice', {
      start_date,
      start_time,
      end_date,
      end_time,
      device_rate,
      weeks: JSON.stringify(weeks),
      seller: JSON.stringify(this.data.seller)
    })
    wx.showToast({
      title: res.msg,
      icon: 'success'
    })
    setTimeout(() => {
      wx.navigateBack()
    }, 800)
  }
})