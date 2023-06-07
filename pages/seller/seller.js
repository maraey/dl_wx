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
    screenMy: 'all',
    newDataMy: {
      screenMy:'all'
    },
    start_date: '',
    end_date: '',
    newDataScreen:{},
    name: '',
    page: 1,
    page_size: 20,
    list:[],
    screenMyText:false,
    info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    
  },
  scrolltolower(){
    console.log(2);
    if(this.data.total>this.data.list.length){
      this.setData({
        page:this.data.page+1
      })
      this.getList()
    }
  },
  async getList() {
    const {
      name,
      page,
      page_size,
      start_date,
      end_date
    } = this.data
    const res = await util.request('store/index', {
      view_type:this.data.screenMy,
      name,
      page,
      page_size,
      start_date,
      end_date
    })
    this.closePopup()
    console.log(res);
    let list = this.data.list
    list.push(...res.data.list)
    this.setData({
      list,
      total:res.data.total
    })
  },
  addSeller(){
    wx.navigateTo({
      url: '/pages/addSeller/addSeller',
    })
  },
  selectScreen(e) {
    if (e.currentTarget.dataset.type == this.data.selectType) {
      this.setData({
        showPopup: !this.data.showPopup
      })
      if (this.data.showPopup) {
        this.setData(this.data.newDataMy)
        this.setData(this.data.newDataScreen)
      } else {
        this.resetData()
      }
    } else {
      this.resetData()
      this.setData(this.data.newDataMy)
      this.setData(this.data.newDataScreen)
      this.setData({
        selectType: e.currentTarget.dataset.type,
        showPopup: true
      })
    }
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
    console.log(this.data.newDataMy.screenMy)
  },
  closePopup() {
    this.setData({
      showPopup: false,
      screenMy: 'all',
      name: '',
      start_date: '',
      end_date: '',
    })
  },
  screenReset() {
    if (this.data.selectType == 'my') {
      this.setData({
        showPopup: false,
        screenMy: 'all',
        screenMyText:'all',
        newDataMy:{
          screenMy:'all'
        },
        page:1,
        list:[]
      })
      this.getList()
    } else if (this.data.selectType == 'screen') {
      this.setData({
        showPopup: false,
        name: '',
        start_date: '',
        end_date: '',
        newDataScreen:{
          name:"",
          start_date:"",
          end_date:""
        },
        page:1,
        list:[]
      })
      this.getList()
    }
  },
  screenSub() {
    if (this.data.selectType == 'my') {
      this.setData({
        newDataMy:{
          screenMy:this.data.screenMy
        },
        screenMyText:this.data.screenMy,
        page:1,
        list:[]
      })
    } else if (this.data.selectType == 'screen') {
      this.setData({
        newDataScreen:{
          name:this.data.name,
          start_date:this.data.start_date,
          end_date:this.data.end_date
        },
        page:1,
        list:[]
      })
    }
    this.getList()
  },
  bindStartDateChange(e) {
    this.setData({
      start_date: e.detail.value
    })
  },
  bindEndDateChange(e) {
    this.setData({
      end_date: e.detail.value
    })
  },
  handleSeller(e) {
    this.setData({
      name: e.detail.value
    })
  },
  stop() {

  },
  resetData() {
    this.setData({
      screenMy: 'all',
      name: '',
      start_date: '',
      end_date: '',
    })
  },
  toDetail(e){
    if(this.data.info.role=='seller'||this.data.info.role=='introducer'){
      return
    }
    console.log(e);
    let type = 1
    if(this.data.screenMyText){
      type=2
    }
    wx.navigateTo({
      url: `/pages/sellerDetail/sellerDetail?id=${e.currentTarget.dataset.id}&type=${type}`,
    })
  }
})