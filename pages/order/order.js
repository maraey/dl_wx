// pages/order/order.js
const app = getApp()
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    selectType: 'my',
    screenStatus: 'all', //订单状态
    type: 'battery', //订单类型
    screenMy: 'all', //我的数据
    is_refund: '0', //退款订单
    is_lose: '0', //丢宝订单
    order_no: '', //订单编号
    member_id: '', //会员ID
    seller: '', //门店名
    screenStartDate: '', //起始时间
    screenEndDate: '', //结束时间
    screenMyText:false,
    newData: {
      screenStatus: 'all',
      type: 'battery',
      screenMy: 'all',
      is_refund: '0',
      is_lose: '0',
      order_no: '',
      member_id: '',
      seller: '',
      screenStartDate: '',
      screenEndDate: '',
    },
    newDataMy: {
      screenMy:'all'
    },
    list: [],
    total: 0,
    page: 1,
    page_size: 10,
    info:'',
    device_types:[],
    can_sub:false,
    permissions:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    if (month < 10) {
      month = '0' + month
    }
    let day = date.getDate()
    if (day < 10) {
      day = '0' + day
    }
    console.log(year, month, day);
    const {
      newData
    } = this.data
    newData.screenStartDate = `${year}-${month}-01`
    newData.screenEndDate = `${year}-${month}-${day}`
    this.setData({
      newData
    })
    this.getList()
    this.setData({
      info:app.globalData.info,
      device_types:app.globalData.info.device_types,
      permissions: util.permissions
    })
    // wx.getStorage({
    //   key: 'login_info',
    //   success: (res)=> {
    //     console.log(res.data)
    //     this.setData({
    //       info:res.data
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const can_sub = wx.getStorageSync('login_info').can_sub
    this.setData({
      can_sub,
    })
    console.log(this.data.can_sub)
  },
  async getList() {
    const {
      newData,
      page,
      page_size
    } = this.data
    const {
      screenStatus,
      type,
      screenMy,
      is_refund,
      is_lose,
      order_no,
      member_id,
      seller,
      screenStartDate,
      screenEndDate
    } = newData
    const res = await util.request('order/index', {
      order_no,
      member_id,
      start_date: screenStartDate,
      end_date: screenEndDate,
      page,
      page_size,
      seller,
      status: screenStatus,
      type,
      is_sub: screenMy,
      is_refund,
      is_lose
    })
    const oldList = this.data.list
    oldList.push(...res.data.list)
    this.setData({
      list: oldList,
      total: res.data.total
    })
  },
  selectScreen(e) {
    if (e.currentTarget.dataset.type == this.data.selectType) {
      this.setData({
        showPopup: !this.data.showPopup
      })
      if (this.data.showPopup) {
        this.setData(this.data.newDataMy)
        this.setData(this.data.newData)
      } else {
        this.resetData()
      }
    } else {
      this.resetData()
      this.setData(this.data.newDataMy)
      this.setData({
        selectType: e.currentTarget.dataset.type,
        showPopup: true
      })
    }
  },
  selectScreenStatus(e) {
    this.setData({
      screenStatus: e.currentTarget.dataset.type
    })
  },
  selectScreenType(e) {
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },
  selectScreenMy(e) {
    if (e.currentTarget.dataset.type == 'all') {
      this.setData({
        screenMy: 'all'
      })
    } else if(e.currentTarget.dataset.type == 'self'){
      this.setData({
        screenMy: 'self'
      })
    } else {
      this.setData({
        screenMy: 'sub'
      })
    }
    console.log(this.data.screenMy)
    // console.log(this.data.newDataMy.screenMy)
  },
  closePopup() {
    this.setData({
      showPopup: false,
      screenStatus: 'all',
      type: 'battery',
      screenMy: 'all',
      is_refund: '0',
      is_lose: '0',
      order_no: '',
      member_id: '',
      seller: '',
      screenStartDate: '',
      screenEndDate: '',
    })
  },
  reset() {
    const newData = {
        screenStatus: 'all',
        type: 'battery',
        screenMy: 'all',
        screenMyText:'all',
        is_refund: '0',
        is_lose: '0',
        order_no: '',
        member_id: '',
        seller: '',
        screenStartDate: '',
        screenEndDate: '',
        newDataMy:{
          screenMy:'all'
        },
      }
    const date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    if (month < 10) {
      month = '0' + month
    }
    let day = date.getDate()
    if (day < 10) {
      day = '0' + day
    }
    newData.screenStartDate = `${year}-${month}-01`
    newData.screenEndDate = `${year}-${month}-${day}`
    this.setData({
      newData,
      page:1,
      list:[],
      total:0,
      showPopup:false
    })
    this.getList()
  },
  screenSub() {
    const {
      screenStatus,
      type,
      screenMy,
      is_refund,
      is_lose,
      order_no,
      member_id,
      seller,
      screenStartDate,
      screenEndDate
    } = this.data
    const newData = {
      screenStatus,
      type,
      screenMy,
      is_refund,
      is_lose,
      order_no,
      member_id,
      seller,
      screenStartDate,
      screenEndDate
    }
    this.setData({
      newDataMy:{
        screenMy:this.data.screenMy
      },
      screenMyText:this.data.screenMy,
      newData,
      page:1,
      list:[],
      total:0
    })
    this.getList()
    this.closePopup()
  },
  bindStartDateChange(e) {
    this.setData({
      screenStartDate: e.detail.value
    })
  },
  bindEndDateChange(e) {
    this.setData({
      screenEndDate: e.detail.value
    })
  },
  handleDeviceId(e) {
    this.setData({
      order_no: e.detail.value
    })
  },
  handleVipId(e) {
    this.setData({
      member_id: e.detail.value
    })
  },
  handleSeller(e) {
    this.setData({
      seller: e.detail.value
    })
  },
  stop() {

  },
  resetData() {
    this.setData({
      screenStatus: 'all',
      type: 'battery',
      screenMy: 'all',
      is_refund: '0',
      is_lose: '0',
      order_no: '',
      member_id: '',
      seller: '',
      screenStartDate: '',
      screenEndDate: '',
    })
  },
  checkDetail(e) {
    if(this.data.info.role=='seller'||this.data.info.role=='introducer'){
      return
    }
    if(util.permissions.indexOf('/order/detail')!= -1){
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?id=' + e.currentTarget.dataset.id
      })
    } else{
      wx.showToast({
        title: '无权访问',
        icon:'error',
        duration: 1000
      })
    }

  },
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.id + ''
    })
  },
  endOrder(e) {
    wx.navigateTo({
      url: '/pages/endOrder/endOrder?id=' + e.currentTarget.dataset.id
    })
  },
  isRefund() {
    let {
      is_refund
    } = this.data
    if (is_refund == 1) {
      is_refund = '0'
    } else if (is_refund == 0) {
      is_refund = 1
    }
    this.setData({
      is_refund
    })
  },
  isLose() {
    let {
      is_lose
    } = this.data
    if (is_lose == 1) {
      is_lose = '0'
    } else if (is_lose == 0) {
      is_lose = 1
    }
    this.setData({
      is_lose
    })
  },
  bindscrolltolower() {
    if (this.data.total > this.data.list.length) {
      let {
        page
      } = this.data
      page += 1
      this.setData({
        page
      })
      this.getList()
    }
  }
})