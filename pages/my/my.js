// pages/my/page.js
const app = getApp()
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    login_info:'',
    device_types:[],
    scroll_right: false,
    scroll_left: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {
    this.setData({
      login_info:app.globalData.info,
      device_types:app.globalData.info.device_types
    })
    // wx.getStorage({
    //   key: 'login_info',
    //   success: (res)=> {
    //     console.log(res.data)
    //     this.setData({
    //       login_info:res.data
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
    this.getInfo()
  },
  async getInfo(){
    const res = await util.request('user/index')
    this.setData({
      info:res.data
    })
  },
  logout(){
    wx.showModal({
      title: '警告',
      content: '确定要退出账号吗?',
      success: async (res)=> {
        if (res.confirm) {
          const res = await util.request('Auth/logout')
          wx.showToast({
            title: res.msg
          })
          if(res.code==200){
            wx.clearStorageSync()
            setTimeout(()=>{
              wx.reLaunch({
                url: '/pages/index/index',
              })
            },1000)
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  sellerVip(){
    wx.navigateTo({
      url: '/pages/sellerVip/sellerVip',
    })
  },
  agencyList(e){
    wx.navigateTo({
      url: `/pages/agencyList/agencyList?role=${e.currentTarget.dataset.role}`,
    })
  },
  resetPsw(){
    wx.navigateTo({
      url: '/pages/resetPsw/resetPsw',
    })
  },
  replenish(){
    wx.navigateTo({
      url: '/pages/replenish/replenish',
    })
  },
  WithdrawalLog(){
    wx.navigateTo({
      url: '/pages/WithdrawalLog/WithdrawalLog',
    })
  },
  adjustPrice(){
    wx.navigateTo({
      url: '/pages/adjustPrice/adjustPrice',
    })
  },
  pileTemplate(){
    wx.navigateTo({
      url: '/pages/pileTemplate/pileTemplate',
    })
  },
  scrollRight(e){
    console.log(e)
    this.setData({
      scroll_right: true,
      scroll_left: false
    })
    console.log(this.data.scroll_right)
  },
  scrollLeft(e){
    console.log(e)
    this.setData({
      scroll_right: false,
      scroll_left: true
    })
    console.log(this.data.scroll_left)
  }
})