// pages/batteryList/batteryList.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    page:1,
    page_size:10,
    store_name:'',
    list:[],
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      type,
      name
    } = options
    this.setData({
      type,
      name
    })
    switch(type){
      case 'offline1_3' :
        wx.setNavigationBarTitle({
          title: '1～3天断电'
        })
        break;
      case 'offline3_5' :
        wx.setNavigationBarTitle({
          title: '3～5天断电'
        })
        break;
      case 'offline5' :
        wx.setNavigationBarTitle({
          title: '5天以上断电'
        })
        break;
      case 'active1_3' :
        wx.setNavigationBarTitle({
          title: '1～3天不活跃'
        })
        break;
      case 'active3_7' :
        wx.setNavigationBarTitle({
          title: '3～7天不活跃'
        })
        break;
      case 'empty' :
        wx.setNavigationBarTitle({
          title: '全天空仓机柜'
        })
        break;
    }
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
    this.getList()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const {page,list,total}=this.data
    if(list.length<total){
      page+=1
      this.getList()
    }
  },
  async getList(){
    const {page,page_size,store_name,type} = this.data
    const res = await util.request('powerbankDevice/searchList',{
      page,page_size,store_name,type
    })
    const listOld = this.data.list
    if(page==1){
      this.setData({
        list:res.data.list,
        total:res.data.total
      })
    }else{
      listOld.push(...res.data.list)
      this.setData({
        list:listOld,
        total:res.data.total
      })
    }
  },
  copy(e){
    const text = e.currentTarget.dataset.text
    wx.setClipboardData({
      data: text
    })
  },
  search(e){
    this.setData({
      store_name:e.detail.value,
      page:1,
      list:[]
    })
    this.getList()
  },
  toDetail(e) {
    wx.navigateTo({
      url: `/pages/batteryDeviceDetail/batteryDeviceDetail?id=${e.currentTarget.dataset.id}`
    })
  }
})