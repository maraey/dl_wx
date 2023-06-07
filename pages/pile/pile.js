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
    showRemarkPopup: false,
    remarks: '',
    bindAgency: false,
    screenStatus: '',
    list: [],
    is_sub: false,
    page: 1,
    page_size: 10,
    status: 'all',
    keyword: '',
    seller: '',
    agency_name: '',
    employee_name: '',
    total: 0,
    status_text: '全部',
    offline_day:'',
    newData: {
      screenStatus: 'all',
      screenMy: false,
      keyword: '',
      seller: '',
      agency_name: '',
      employee_name:'',
      offline_day:'',
    },
    bindType:'bind',
    bindSeller:false,
    info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    let is_sub = false
    if(options.sub==2){
      is_sub=true
    }
    if(options.name){
      this.setData({
        seller:options.name,
        is_sub,
        newData: {
          screenStatus: 'all',
          screenMy: is_sub,
          keyword: '',
          seller: options.name,
          agency_name: '',
          employee_name:'',
          offline_day:'',
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
      employee_name,
      offline_day
    } = this.data
    const res = await util.request('pileDevice/deviceList', {
      is_sub,
      page,
      page_size,
      status,
      keyword,
      seller,
      agency_name,
      employee_name,
      offline_day
    })
    const {
      list
    } = this.data
    list.push(...res.data.list)
    this.setData({
      list,
      total:res.data.total
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
      screenStatus: 'all',
      screenMy: false,
      keyword: '',
      seller: '',
      agency_name: '',
      employee_name:'',
      offline_day:''
    })
  },
  screenReset(){
    this.setData({
      screenStatus: 'all',
      offline_day:'',
      screenMy: false,
      keyword: '',
      seller: '',
      agency_name: '',
      employee_name:'',
      is_sub:false,
      newData: {
        screenStatus: 'all',
        screenMy: false,
        keyword: '',
        seller: '',
        agency_name: '',
        employee_name:'',
        offline_day:''
      },
      status_text:'全部',
      page:1,
      list:[],
      showPopup:false
    })
    this.getList()
  },
  remarks(e) {
    this.setData({
      showRemarkPopup: true,
      device_id:e.currentTarget.dataset.id
    })
  },
  cancle() {
    this.setData({
      showRemarkPopup: false,
      remarks: '',
      device_id:''
    })
  },
  async confirm() {
    const res = await util.request('pileDevice/editRemarks',{
      device_id:this.data.device_id,
      memo:this.data.remarks
    })
    if(res.code == 1){
      this.setData({
        showRemarkPopup: false,
        page:1,
        list:[]
      })
      this.getList()
    }
    
  },
  selectDays(e){
    this.setData({
      offline_day: e.currentTarget.dataset.day
    })
  },
  handleInput(e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  closePopup() {
    this.setData({
      showPopup: false,
      status: 'all',
      screenStatus: 'all',
      screenMy: false,
      keyword: '',
      seller: '',
      agency_name: '',
      employee_name:'',
      offline_day:''
    })
  },
  stop() {

  },
  selectScreenStatus(e) {
    this.setData({
      screenStatus: e.currentTarget.dataset.type
    })
  },
  toDetail(e) {
    wx.navigateTo({
      url: `/pages/pileDetail/pileDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  bindAgency(e) {
    this.setData({
      bindAgency: true,
      device_id:e.currentTarget.dataset.id,
      bindType:'bind'
    })
  },
  changeAgency(e) {
    this.setData({
      bindAgency: true,
      device_id:e.currentTarget.dataset.id,
      bindType:'change'
    })
  },
  async selectAgency(e) {
    console.log(e.detail);
    let res 
    if(this.data.bindType=='bind'){
      res = await util.request('pileDevice/bindAgency',{
        agency_id:e.detail,
        code_type:'sn',
        device_id:this.data.device_id
      })
    }else if(this.data.bindType=='change'){
      res = await util.request('pileDevice/changeAgency',{
        agency_id:e.detail,
        code_type:'sn',
        device_id:this.data.device_id
      })
    }
    if(res.code==200){
      wx.showToast({
        title: res.msg,
      })
      this.setData({
        page:1,
        list:[]
      })
      this.getList()
      this.cancleAgency()
    }
  },
  cancleAgency() {
    this.setData({
      bindAgency: false,
      device_id:''
    })
  },
  async selectSeller(e){
    console.log(e.detail);
    const res = await util.request('pileDevice/bindSeller',{
      seller_id:e.detail,
      code_type:'sn',
      device_id:this.data.device_id
    })
    if(res.code ==1 ){
      wx.showToast({
        title: res.msg,
      })
      this.setData({
        page:1,
        list:[]
      })
      this.getList()
      this.cancleSeller()
    }
  },
  cancleSeller(){
    this.setData({
      bindSeller: false,
      device_id:''
    })
  },
  unbindSeller(e){
    wx.showModal({
      title: '提示',
      content: '确定解绑吗?',
      success: async (res) =>{
        if (res.confirm) {
          const res = await util.request('pileDevice/unbindSeller',{
            device_id:e.currentTarget.dataset.id
          })
          if(res.code==200){
            wx.showToast({
              title: res.msg,
            })
            this.setData({
              page:1,
              list:[]
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
    newData.offline_day = this.data.offline_day
    newData.screenMy = this.data.screenMy
    newData.keyword = this.data.keyword||''
    newData.seller = this.data.seller
    newData.agency_name = this.data.agency_name
    newData.employee_name = this.data.employee_name
    let status_text = ''
    switch(newData.screenStatus){
      case 'all':
        status_text='全部'
        break;
      case 'online':
        status_text='在线'
        break;
      case 'offline':
        status_text='离线'
        break;
      case 'bind':
        status_text='已绑'
        break;
      case 'unbind':
        status_text='未绑'
        break;
      case 'fail':
        status_text='故障'
        break;
    }
    this.setData({
      newData,
      status_text,
      status:newData.screenStatus,
      offline_day:newData.offline_day,
      is_sub:newData.screenMy,
      keyword:newData.keyword,
      seller:newData.seller,
      agency_name:newData.agency_name,
      employee_name:newData.employee_name,
      page:1,
      list:[],
      showPopup:false
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
      seller: e.detail.seller
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
  copy(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.id+'',
    })
  },
  bindSeller(e){
    this.setData({
      bindSeller:true,
      device_id:e.currentTarget.dataset.id
    })
  },
  scanBind(){
    wx.scanCode({
      success:async (res)=>{
        const res1 = await util.request('user/getDeviceCode',{
          url:res.result
        })
        if(res1.data.type=='pile'){
          this.setData({
            keyword: res1.data.code
          })
        }else{
          wx.showToast({
            title: '非充电桩设备',
            icon:'error'
          })
        }
      }
    })
  }
})