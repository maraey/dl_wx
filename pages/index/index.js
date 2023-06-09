const util = require('../../utils/util')
const app = getApp()
Page({
  data: {
    amount: {},
    isLogin: false,
    selected: 'today',
    showDatePicker: false,
    datePicker: [],
    app_role: '',
    device_types:[],
    login_info:'',
    shop_grade:1,
    indexInfo:{},
    permissions:[]
  },
  onLoad() {
    try {
      const value = wx.getStorageSync('login_info')
      console.log(value)
      if (value) {
        this.setData({
          permissions: value.permissions,
          app_role:value.role,
          device_types:value.device_types,
          isLogin: true,
          login_info:value
        })
        app.globalData.info=value
      }
    } catch (e) {
      // Do something when catch error
      this.setData({
        isLogin: false
      })
    }
    console.log(this.data.permissions,this.data.isLogin)
  },
  async onShow() {
    this.getData()
    // if (this.data.isLogin) {
    //   this.getAmount()
    //   const res = await util.request('user/index')
    //   this.setData({
    //     shop_grade:res.data.shop_grade
    //   })
    // }
  },
  async getAmount() {
    // const res = await util.request('Index/index')
    // console.log(res);
    // this.setData({
    //   amount: res.data
    // })
  },
  goTo(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.id}/${e.currentTarget.dataset.id}`
    })
  },
  agencyList(e){
    console.log(e.currentTarget.dataset.role)
    wx.navigateTo({
      url: `/pages/agencyList/agencyList?role=${e.currentTarget.dataset.role}`,
    })
  },
  toLogin() {
    wx.showToast({
      title: '请先登录',
      icon: 'error',
      duration: 800
    })
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/welcome/welcome',
      })
    }, 800)
  },
  tabbar(e) {
    const selected = e.currentTarget.dataset.type
    this.setData({
      selected
    })
    if (selected == 'custom') {
      this.setData({
        showDatePicker: true
      })
    } else {
      console.log(this.data.selected)
      this.getData()
    }
  },
  async getData(){
    const res = await util.request('index/index',{
      time: this.data.selected,
      start: this.data.datePicker[0] || '',
      end: this.data.datePicker[1] || ''
    })
    console.log(res)
    this.setData({
      indexInfo: res.data
    })
  },
  closeDatePicker() {
    this.setData({
      showDatePicker: false
    })
  },
  confirmDatePicker(e) {
    this.setData({
      datePicker: e.detail,
      showDatePicker: false
    })
    this.getData()
  },
  scanDevice() {
    wx.scanCode({
      success: async res => {
        console.log(res.result);
        if (res.result.indexOf('https') != -1) {
          const res1 = await util.request('user/getDeviceCode', {
            url: res.result
          })
          if (res1.data.type == 'powerbank') {
            console.log(1);
            wx.navigateTo({
              url: `/pages/batteryDeviceDetail/batteryDeviceDetail?id=${res1.data.code}`
            })
          } else {
            wx.showToast({
              title: '不是充电宝机柜',
              icon: 'error'
            })
          }
        } else {
          console.log(res);
          wx.navigateTo({
            url: `/pages/batteryDeviceDetail/batteryDeviceDetail?id=${res.result}`
          })
        }
      }
    })
  }
})