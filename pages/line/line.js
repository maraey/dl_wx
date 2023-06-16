// pages/batteryDevice/batteryDevice.js
const app = getApp()
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    selectType: 'online',
    remarks: '',
    bindAgency: false,
    screenStatus: '',
    list: [],
    is_sub: false,
    page: 1,
    page_size: 10,
    status: 'bind',
    keyword: '',
    seller: '',
    agency_name: '',
    employee_name: '',
    total: 0,
    status_text: '已绑',
    newData: {
      screenStatus: 'bind',
      screenMy: false,
      keyword: '',
      seller: '',
      agency_name: '',
      employee_name: ''
    },
    bindType: 'bind',
    bindSeller: false,
    info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    let is_sub = false
    if (options.sub == 2) {
      is_sub = true
    }
    if (options.name) {
      this.setData({
        seller: options.name,
        is_sub,
        newData: {
          screenStatus: 'bind',
          screenMy: is_sub,
          keyword: '',
          seller: options.name,
          agency_name: '',
          employee_name: ''
        },
      })
    }
    this.getList()
    this.setData({
      info:app.globalData.info
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

  },
  async getList() {
    const {
      is_sub,
      page,
      page_size,
      status,
      keyword,
      seller,
      agency_name,
      employee_name
    } = this.data
    const res = await util.request('wiredDevice/deviceList', {
      is_sub,
      page,
      page_size,
      status,
      qrcode: keyword,
      seller,
      agency_name,
      employee_name
    })
    const {
      list
    } = this.data
    list.push(...res.data.list)
    this.setData({
      list,
      total: res.data.total
    })
  },
  scrolltolower() {
    console.log(2);
    if (this.data.total > this.data.list.length) {
      this.setData({
        page: this.data.page + 1
      })
      this.getList()
    }
  },
  selectScreen(e) {
    if (e.currentTarget.dataset.type == this.data.selectType) {
      this.setData({
        showPopup: !this.data.showPopup
      })
      if (this.data.showPopup) {
        this.setData(this.data.newData)
      } else {
        this.resetData()
      }
    } else {
      if (!this.data.showPopup) {
        this.setData(this.data.newData)
      }
      this.setData({
        selectType: e.currentTarget.dataset.type,
        showPopup: true
      })
    }
  },
  resetData() {
    this.setData({
      screenStatus: 'bind',
      screenMy: false,
      keyword: '',
      seller: '',
      agency_name: '',
      employee_name: '',
    })
  },
  screenReset() {
    this.setData({
      screenStatus: 'bind',
      screenMy: false,
      keyword: '',
      seller: '',
      agency_name: '',
      employee_name: '',
      is_sub:false,
      newData: {
        screenStatus: 'bind',
        screenMy: false,
        keyword: '',
        seller: '',
        agency_name: '',
        employee_name: ''
      },
      status_text: '已绑',
      page: 1,
      list: [],
      showPopup: false
    })
    this.getList()
  },
  closePopup() {
    this.setData({
      showPopup: false,
      status: 'bind',
      screenStatus: 'bind',
      screenMy: false,
      keyword: '',
      seller: '',
      agency_name: '',
      employee_name: ''
    })
  },
  stop() {

  },
  selectScreenStatus(e) {
    this.setData({
      screenStatus: e.currentTarget.dataset.type
    })
  },
  setError(e) {
    wx.showModal({
      title: '警告',
      content: '确定设为故障吗?',
      success: async (res) => {
        if (res.confirm) {
          await util.request('WiredDevice/setFault', {
            qrcode: e.currentTarget.dataset.id,
            status: '0'
          })
          this.setData({
            page: 1,
            list: []
          })
          this.getList()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  async resetError(e) {
    await util.request('WiredDevice/setFault', {
      qrcode: e.currentTarget.dataset.id,
      status: '1'
    })
    this.setData({
      page: 1,
      list: []
    })
    this.getList()
  },
  bindAgency(e) {
    this.setData({
      bindAgency: true,
      device_id: e.currentTarget.dataset.id,
      bindType: 'bind'
    })
  },
  changeAgency(e) {
    this.setData({
      bindAgency: true,
      device_id: e.currentTarget.dataset.id,
      bindType: 'change'
    })
  },
  async selectAgency(e) {
    console.log(e.detail);
    let res
    if (this.data.bindType == 'bind') {
      res = await util.request('WiredDevice/bindAgency', {
        agency_id: e.detail,
        qrcode: this.data.device_id
      })
    } else if (this.data.bindType == 'change') {
      res = await util.request('WiredDevice/changeAgency', {
        agency_id: e.detail,
        qrcode: this.data.device_id
      })
    }
    if (res.code == 200) {
      wx.showToast({
        title: res.msg,
      })
      this.setData({
        page: 1,
        list: []
      })
      this.getList()
      this.cancleAgency()
    }
  },
  cancleAgency() {
    this.setData({
      bindAgency: false,
      device_id: ''
    })
  },
  async selectSeller(e) {
    console.log(e.detail);
    const res = await util.request('WiredDevice/bindSeller', {
      seller_id: e.detail,
      code_type: 'qrcode',
      qrcode: this.data.device_id
    })
    if (res.code == 200) {
      wx.showToast({
        title: res.msg,
      })
      this.setData({
        page: 1,
        list: []
      })
      this.getList()
      this.cancleSeller()
    }
  },
  cancleSeller() {
    this.setData({
      bindSeller: false,
      device_id: ''
    })
  },
  unbindSeller(e) {
    wx.showModal({
      title: '提示',
      content: '确定解绑吗?',
      success: async (res) => {
        if (res.confirm) {
          const res = await util.request('WiredDevice/unbindSeller', {
            qrcode: e.currentTarget.dataset.id
          })
          if (res.code == 200) {
            wx.showToast({
              title: res.msg,
            })
            this.setData({
              page: 1,
              list: []
            })
            this.getList()
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  screenSub() {
    const newData = this.data.newData
    newData.screenStatus = this.data.screenStatus
    newData.screenMy = this.data.screenMy
    newData.keyword = this.data.keyword || ''
    newData.seller = this.data.seller
    newData.agency_name = this.data.agency_name
    newData.employee_name = this.data.employee_name
    let status_text = ''
    switch (newData.screenStatus) {
      case 'bind':
        status_text = '已绑'
        break;
      case 'unbind':
        status_text = '未绑'
        break;
      case 'fail':
        status_text = '故障'
        break;
    }
    this.setData({
      newData,
      status_text,
      status: newData.screenStatus,
      is_sub: newData.screenMy,
      keyword: newData.keyword,
      seller: newData.seller,
      agency_name: newData.agency_name,
      employee_name: newData.employee_name,
      page: 1,
      list: [],
      showPopup: false
    })
    this.getList()
  },
  handleDeviceId(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  handleSeller(e) {
    this.setData({
      seller: e.detail.value
    })
  },
  handleAgency(e) {
    this.setData({
      agency_name: e.detail.value
    })
  },
  handleEmployee(e) {
    this.setData({
      employee_name: e.detail.value
    })
  },
  selectScreenMy(e) {
    if (e.currentTarget.dataset.type == 'my') {
      this.setData({
        screenMy: false
      })
    } else {
      this.setData({
        screenMy: true
      })
    }
  },
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.id + '',
    })
  },
  bindSeller(e) {
    this.setData({
      bindSeller: true,
      device_id: e.currentTarget.dataset.id
    })
  },
  scanBind() {
    wx.scanCode({
      success: async (res) => {
        // if (res1.indexOf('Xc')) {
        //   res1 = res1.replace('https://qrcode.w-dian.cn/Xc?o=ng==&&t=', '')
        //   console.log(res1);
        //   this.setData({
        //     keyword: res1
        //   })
        // }else{
        //   wx.showToast({
        //     title: '非密码线',
        //     icon:'error'
        //   })
        // }
        const res1 = await util.request('user/getDeviceCode',{
          url:res.result
        })
        if(res1.data.type=='wired'){
          this.setData({
            keyword: res1.data.code
          })
        }else{
          wx.showToast({
            title: '非充电线设备',
            icon:'error'
          })
        }
      }
    })
  }
})