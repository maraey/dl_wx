const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screen_type: 'manage',
    array: [],
    index: 0,
    device_id: '',
    info: {},
    volume: '',
    tabType: 'year',
    tabList: [],
    date: '',
    totalAmount: '',
    permissions:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      device_id: options.id,
      permissions: util.permissions
    })
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
    const date = new Date()
    const year = date.getFullYear()
    console.log(year);
    let month = date.getMonth() + 1
    console.log(date);
    const array = []
    for (let i = 2022; i <= year; i++) {
      array.unshift(i)
    }
    console.log(array);
    if (month < 10) {
      month = '0' + month
    }
    this.setData({
      array,
      date: `${year}-${month}`
    })
    this.getInfo()
    this.getData('year')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  async getInfo() {
    const res = await util.request('powerbankDevice/detail', {
      device_id: this.data.device_id
    })

    res.data.img = util.config.host + 'misc/showQrcode?type=device&text=' + res.data.qrcode_text
    this.setData({
      info: res.data
    })
  },
  handleVolume(e) {
    this.setData({
      volume: e.detail.value
    })
  },
  screen(e) {
    this.setData({
      screen_type: e.currentTarget.dataset.type
    })
  },
  return () {
    wx.showModal({
      title: '提示',
      content: '确定将设备退回上级代理？退回后设备将解绑所归属门店。',
      success: async (res) => {
        if (res.confirm) {
          const res = await util.request('powerbankDevice/backParent', {
            device_id: this.data.device_id
          })
          if (res.code == 1) {
            wx.showToast({
              title: res.msg,
              icon: 'success',
              duration: 1000
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/index/index',
              })
            }, 1000)
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
    this.getData('year')
  },
  bindDateChange(e) {
    let date = e.detail.value
    if (date.slice(0, 4) < 2022) {
      wx.showToast({
        title: '只可看2022年后',
        icon: 'error'
      })
      return
    }
    if (date[5] == '0') {
      date = `${date.slice(0,5)}${date.slice(6,7)}`
    }
    this.setData({
      date
    })
    this.getData('month')
  },
  async openAll() {
    wx.showLoading({
      title: '请稍后',
    })
    const res = await util.request('batteryDevice/operate', {
      device_id: this.data.info.device_id,
      type: 'openAll',
    })
    wx.hideLoading()
    if (res.code == 1) {
      this.getInfo()
    }
  },
  async reset() {
    wx.showLoading({
      title: '请稍后',
    })
    const res = await util.request('batteryDevice/operate', {
      device_id: this.data.info.device_id,
      type: 'restart',
    })
    wx.hideLoading()
    if (res.code == 1) {
      this.getInfo()
    }
  },
  async openLock(e) {
    wx.showLoading({
      title: '请稍后',
    })
    const res = await util.request('batteryDevice/operate', {
      device_id: this.data.info.device_id,
      type: 'open',
      val: e.currentTarget.dataset.lock
    })
    wx.hideLoading()
    if (res.code == 1) {
      this.getInfo()
    }
  },
  setError() {
    wx.showModal({
      title: '警告',
      content: '确定要设为故障吗?',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后',
          })
          await util.request('batteryDevice/operate', {
            device_id: this.data.info.device_id,
            type: 'fault',
            val: '1'
          })
          wx.hideLoading()
          this.getInfo()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  async cancelError() {
    wx.showLoading({
      title: '请稍后',
    })
    await util.request('batteryDevice/operate', {
      device_id: this.data.info.device_id,
      type: 'fault',
      val: '0'
    })
    wx.hideLoading()
    this.getInfo()
  },
  async setVolume() {
    const res = await util.request('batteryDevice/operate', {
      device_id: this.data.info.device_id,
      type: 'volume',
      val: this.data.volume
    })
    if (res.code == 1) {
      wx.showToast({
        title: res.msg,
        icon: 'success'
      })
    }
  },
  selectYear(e) {
    const tabType = e.currentTarget.dataset.type
    this.setData({
      tabType
    })
    this.getData(tabType)
  },
  async getData(type) {
    let res = null
    // if (type == 'year') {
    //   res = await util.request('batteryDevice/statYear', {
    //     device_id: this.data.device_id,
    //     year: this.data.array[this.data.index]
    //   })
    // } else if (type == 'month') {
    //   res = await util.request('batteryDevice/statMonth', {
    //     device_id: this.data.device_id,
    //     year: this.data.date.slice(0, 4),
    //     month: this.data.date.slice(5, 6)
    //   })
    // }
    this.setData({
      tabList: res.data.list,
      totalAmount: res.data.total_amount
    })
  }
})