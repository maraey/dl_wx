// pages/my/page.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone:'',
    address:'',
    num:'',
    canSub:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {

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
    this.getNum()
  },
  handleName(e){
    this.setData({
      name:e.detail.value
    })
  },
  handleAddress(e){
    this.setData({
      address:e.detail.value
    })
  },
  handlePhone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  async getNum(){
    const res = await util.request('batteryDevice/replenishStatus')
    this.setData({
      num:res.data.is_apply
    })
  },
  log(){
    wx.navigateTo({
      url: '/pages/replenishLog/replenishLog',
    })
  },
  async sub(){
    const {name,phone,address,canSub} = this.data
    if(canSub){
      const res = await util.request('batteryDevice/replenishApply',{
        name,phone,address
      })
      if(res.code==200){
        wx.showToast({
          title: '申请成功',
          icon:'success'
        })
        setTimeout(()=>{
          wx.navigateBack()
        },800)
      }
    }
  }
})