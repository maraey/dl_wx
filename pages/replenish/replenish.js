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
    canSub:true,
    is_apply: 0,
    is_replenish: false,
    max_num:0
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
    console.log(1122)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    this.getNum()
    console.log(2211)
    if(this.data.is_apply){
      this.setData({
        is_replenish: true
      })
    } else {
      this.setData({
        is_replenish: false
      })
    }
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
    const res = await util.request('powerbankdevice/replenishStatus')
    this.setData({
      max_num:res.data.max_num,
      is_apply: res.data.is_apply
    })
  },
  log(){
    wx.navigateTo({
      url: '/pages/replenishLog/replenishLog',
    })
  },
  async sub(){
    const {name,phone,address,canSub,num} = this.data
    if(canSub){
      const res = await util.request('powerbankdevice/replenishApply',{
        num,name,phone,address
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
  },
  handleNum(e){
    this.setData({
      num : e.detail.value
    })
    console.log(e)
  }
})