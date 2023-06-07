// pages/vipDetail/vipDetail.js
const util = require('../../utils/util')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    member_id:'',
    list:[],
    device_types:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.uid){
      this.setData({
        uid:options.uid
      })
    }
    if(options.id){
      this.setData({
        member_id:options.id
      })
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
    console.log(app.globalData.info);
    this.setData({
      device_types:app.globalData.info.device_types
    })
    this.getList()
  },

  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {

  },
  async getList(){
    const res = await util.request('vip/userStores',{
      uid:this.data.uid
    })
    console.log(res);
    this.setData({
      list:res.data.list
    })
  },
  delete(e){
    console.log(e.currentTarget.dataset.id)
    wx.showModal({
      title: '提示',
      content: '是否确定要删除',
      success: async (res) =>{
        if (res.confirm) {
          console.log('用户点击确定')
          await util.request('vip/deleteInfo',{
            id:e.currentTarget.dataset.id
          })
          this.getList()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  edit(e){
    const info = e.currentTarget.dataset.info
    wx.navigateTo({
      url: `/pages/addVip/addVip?type=1&info=${JSON.stringify(info)}&memberId=${this.data.member_id}`,
    })
  }
})