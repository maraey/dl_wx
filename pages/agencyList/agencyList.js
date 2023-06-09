// pages/sellerVip/sellerVip.js
const util = require('../../utils/util')
const app = getApp()
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    page: 1,
    page_size: 10,
    total: 0,
    list: [],
    role:'',
    can_sub:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {
    if(options.role){
      this.setData({
        role:options.role
      })
      if(this.data.role == 'manager'){
        wx.setNavigationBarTitle({
          title: '门店管理',
        })
      }else if(this.data.role=='bd'){
        wx.setNavigationBarTitle({
          title: '地推',
        })
      }else if(this.data.role=='introducer'){
        wx.setNavigationBarTitle({
          title: '渠道商',
        })
      }
    }
    this.setData({
      can_sub:app.globalData.info.can_sub
    })
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
    this.setData({
      keyword: '',
      page: 1,
      list:[]
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log(1);
    let page = this.data.page
    if (this.data.total > this.data.list.length) {
      page += 1
      this.setData({
        page
      })
      this.getList()
    }

  },
  async getList() {
    const {
      keyword,
      page,
      page_size
    } = this.data
      const res = await util.request('marketer/index', {
        keyword,
        page,
        page_size,
        role: this.data.role
      })
      let list = this.data.list
      console.log(res);
      list.push(...res.data.list)
      this.setData({
        list,
        total: res.data.total
      })
  },
  handleName(e) {
    this.setData({
      keyword: e.detail.value
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      this.setData({
        page: 1,
        list: []
      })
      this.getList()
    }, 500)
  },
  toAdd(){
      wx.navigateTo({
        url: '/pages/addAgency/addAgency',
      }) 
  },
  toAddStaff(){
    wx.navigateTo({
      url: '/pages/addStaff/addStaff',
    }) 
  },
  toAddManager(){
    wx.navigateTo({
      url: '/pages/addSellerAccount/addSellerAccount',
    }) 
  },
  toAddIntroducer(){
    wx.navigateTo({
      url: '/pages/addIntroducer/addIntroducer',
    }) 
  },
  detail(e){
    if(util.permissions.indexOf('/marketer/detail')!= -1 ){
      wx.navigateTo({
        url: `/pages/agencyDetail/agencyDetail?id=${e.currentTarget.dataset.id}&role=${this.data.role}`,
      })
    } else {
      wx.showToast({
        title: '无权访问',
        icon: 'error',
        duration: 1000
      })
    }

  }
})