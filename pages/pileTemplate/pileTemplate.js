// pages/pileTemplate/pileTemplate.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'balance',
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getList()
  },

  tab(e){
    this.setData({
      type:e.currentTarget.dataset.type
    })
    this.getList()
  },
  async getList(){
    const res = await util.request('PileDevice/templateList',{
      type:this.data.type
    })
    this.setData({
      list:res.data
    })
  },
  delete(e){
    wx.showModal({
      title: '警告',
      content: '确定要删除吗?',
      success: async (res)=>{
        if (res.confirm) {
          const res =await util.request('PileDevice/templateDelete',{
            id:e.currentTarget.dataset.id
          })
          if(res.code ==1){
            wx.showToast({
              title: res.msg,
              icon:'success'
            })
            this.getList()
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  add(){
    wx.navigateTo({
      url: `/pages/pileSet/pileSet?type=${this.data.type}&isAdd=1`,
    })
  },
  edit(e){
    wx.navigateTo({
      url: `/pages/pileSet/pileSet?type=${this.data.type}&id=${e.currentTarget.dataset.id}&isAdd=1`,
    })
  }
})