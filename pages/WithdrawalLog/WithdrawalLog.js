// pages/WithdrawalLog/WithdrawalLog.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upDown: false,
    page: 1,
    page_size: 10,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.getLog()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log(1);
    if(this.data.list.length<this.data.total){
      let {page} = this.data
      page+=1
      this.setData({
        page
      })
      this.getLog()
    }
  },
  upDown(e) {
    console.log(e.currentTarget.dataset.index);
    const index = e.currentTarget.dataset.index
    const list = this.data.list
    list[index].upDown = !list[index].upDown
    this.setData({
      list
    })
  },
  async getLog() {
    const {
      page,
      page_size
    } = this.data
    const res = await util.request('user/withdrawalLog', {
      page,
      page_size
    })
    const {
      list,
      total
    } = res.data
    list.forEach(item=>{
      item.upDown=false
    })
    const oldList = this.data.list
    oldList.push(...list)
    this.setData({
      list:oldList,
      total
    })
  }
})