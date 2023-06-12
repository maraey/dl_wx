// pages/dataBoardDetail/dataBoardDetail.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sub_id: '',
    type: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      type: options.type
    })
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
    this.getTree()
  },

  async getTree() {
    const {
      type,
      sub_id
    } = this.data
    const res = await util.request('powerbankDevice/searchList', {
      type,
      sub_id
    })
    this.setData({
      list: res.data
    })
  },
  async loadSub(e) {
    const sub = e.currentTarget.dataset.sub
    if (sub) {
      const index = e.currentTarget.dataset.index
      const id = e.currentTarget.dataset.id
      const {
        type,
        list
      } = this.data
      const res = await util.request('powerbankDevice/searchList', {
        type,
        sub_id: id
      })
      list[index].children = res.data
      this.setData({
        list
      })
    }
  },
  batteryList(e){
    const id = e.currentTarget.dataset.id
    const name = e.currentTarget.dataset.name
    const {type}=this.data
    wx.navigateTo({
      url: `/pages/batteryList/batteryList?id=${id}&type=${type}&name=${name}`,
    })
  }
})