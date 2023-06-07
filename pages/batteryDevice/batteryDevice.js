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
    store_name: '',
    agent_name: '',
    employee_name: '',
    total: 0,
    status_text: '全部',
    offline_day:'',
    newData: {
      screenStatus: 'all',
      screenMy: 'all',
      keyword: '',
      store_name: '',
      agent_name: '',
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
        store_name:options.name,
        is_sub,
        newData: {
          screenStatus: 'all',
          screenMy: is_sub,
          keyword: '',
          store_name: options.name,
          agent_name: '',
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
      page,
      page_size,
      status,
      keyword,
      store_name,
      agent_name,
      employee_name,
      offline_day
    } = this.data
    const res = await util.request('powerbankDevice/index', {
      page,
      page_size,
      status,
      keyword,
      store_name,
      agent_name,
      employee_name,
      offline_day,
      view_type: this.data.screenMy
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
      screenMy: 'all',
      keyword: '',
      store_name: '',
      agent_name: '',
      employee_name:'',
      offline_day:''
    })
  },
  screenReset(){
    this.setData({
      screenStatus: 'all',
      offline_day:'',
      screenMy: 'all',
      keyword: '',
      store_name: '',
      agent_name: '',
      employee_name:'',
      is_sub:false,
      newData: {
        screenStatus: 'all',
        screenMy: 'all',
        keyword: '',
        store_name: '',
        agent_name: '',
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
    const res = await util.request('powerbankDevice/editRemarks',{
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
      screenMy: 'all',
      keyword: '',
      store_name: '',
      agent_name: '',
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
      url: `/pages/batteryDeviceDetail/batteryDeviceDetail?id=${e.currentTarget.dataset.id}`
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
      res = await util.request('powerbankDevice/bindSub',{
        sub_id:e.detail,
        code_type:'sn',
        device_id:this.data.device_id
      })
    }else if(this.data.bindType=='change'){
      res = await util.request('powerbankDevice/changeSub',{
        sub_id:e.detail,
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
    const res = await util.request('powerbankDevice/bindStore',{
      store_id:e.detail,
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
          const res = await util.request('powerbankDevice/unbindStore',{
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
    newData.store_name = this.data.store_name
    newData.agent_name = this.data.agent_name
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
      case 'replenish':
        status_text='补宝'
        break;
    }
    this.setData({
      newData,
      status_text,
      status:newData.screenStatus,
      offline_day:newData.offline_day,
      is_sub:newData.screenMy,
      keyword:newData.keyword,
      store_name:newData.store_name,
      agent_name:newData.agent_name,
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
      store_name: e.detail.value
    })
  },
  handleAgency(e) {
    this.setData({
      agent_name: e.detail.value
    })
  },
  handleEmployee(e) {
    this.setData({
      employee_name: e.detail.value
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
      success: async (res)=>{
        console.log(res.result)
        if(res.result.indexOf('https')!=-1){
          const res1 = await util.request('user/getDeviceCode',{
            url:res.result
          })
          if(res1.data.type=='battery'){
            console.log(1);
            this.setData({
              keyword:res1.data.code
            })
          }else{
            wx.showToast({
              title: '不是充电宝机柜',
              icon: 'error'
            })
          }
        }else{
          this.setData({
            keyword:res.result
          })
        }
      }
    })
  }
})