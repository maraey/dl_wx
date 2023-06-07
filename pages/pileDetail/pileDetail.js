const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screen_type: 'manage',
    array: [],
    index: 0,
    device_id: '',
    info: {},
    volume: '',
    tabType:'year',
    tabList:[],
    date:'',
    totalAmount:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      device_id: options.id
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
    const date = new Date()
    const year = date.getFullYear()
    console.log(year);
    let month = date.getMonth()+1
    console.log(date);
    const array = []
    for (let i = 2022; i <= year; i++) {
      array.unshift(i)
    }
    console.log(array);
    if(month<10){
      month = '0'+month
    }
    this.setData({
      array,
      date:`${year}-${month}`
    })
    this.getInfo()
    this.getData('year')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  async getInfo() {
    const res = await util.request('PileDevice/detail', {
      device_id: this.data.device_id
    })
    this.setData({
      info: res.data
    })
  },
  screen(e) {
    this.setData({
      screen_type: e.currentTarget.dataset.type
    })
  },
  return () {
    wx.navigateBack({
      delta: 1
    })
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
    this.getData('year')
  },
  bindDateChange(e){
    let date = e.detail.value
    if(date.slice(0,4)<2022){
      wx.showToast({
        title: '只可看2022年后',
        icon:'error'
      })
      return
    }
    if(date[5]=='0'){
      date = `${date.slice(0,5)}${date.slice(6,7)}`
    }
    this.setData({
      date
    })
    this.getData('month')
  },
  selectYear(e){
    const tabType = e.currentTarget.dataset.type
    this.setData({
      tabType
    })
    this.getData(tabType)
  },
  async getData(type){
    let res = null
    if(type=='year'){
      res = await util.request('pileDevice/statYear',{
        device_id:this.data.device_id,
        year:this.data.array[this.data.index]
      })
    }else if(type=='month'){
      res = await util.request('pileDevice/statMonth',{
        device_id:this.data.device_id,
        year:this.data.date.slice(0,4),
        month:this.data.date.slice(5,6)
      })
    }
    this.setData({
      tabList:res.data.list,
      totalAmount:res.data.total_amount
    })
  },
  setError() {
    wx.showModal({
      title: '警告',
      content: '确定要设为故障吗?',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后',
          })
          await util.request('PileDevice/setFault', {
            device_id: this.data.info.device_id,
            is_fault:1
          })
          wx.hideLoading()
          this.getInfo()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  async cancelError() {
    wx.showLoading({
      title: '请稍后',
    })
    await util.request('PileDevice/setFault', {
      device_id: this.data.info.device_id,
      is_fault:'0'
    })
    wx.hideLoading()
    this.getInfo()
  }
})