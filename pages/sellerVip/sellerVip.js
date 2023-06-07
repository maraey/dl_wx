// pages/sellerVip/sellerVip.js
const util = require('../../utils/util')
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    page: 1,
    page_size: 10,
    sid: '',
    total: 0,
    list: [],
    info:{},
    editType:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {
    if (options.info) {
      this.setData({
        info: JSON.parse(options.info),
        sid: JSON.parse(options.info).id
      })
    }
    if(options.type){
      this.setData({
        editType:options.type
      })
    }
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
      page_size,
      sid
    } = this.data
    if(sid){
      const res = await util.request('vip/index', {
        keyword,
        page,
        page_size,
        sid
      })
      let list = this.data.list
      console.log(res);
      list.push(...res.data.list)
      this.setData({
        list,
        total: res.data.total
      })
    }else{
      const res = await util.request('vip/index', {
        keyword,
        page,
        page_size
      })
      let list = this.data.list
      console.log(res);
      list.push(...res.data.list)
      this.setData({
        list,
        total: res.data.total
      })
    }
    
  },
  handleKeyword(e) {
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
    if(this.data.info.id||this.data.info.id===0){
      wx.navigateTo({
        url: `/pages/addVip/addVip?info=${JSON.stringify(this.data.info)}`,
      })
    }else{
      wx.navigateTo({
        url: '/pages/addVip/addVip',
      })
    }
    
  },
  delete(e){
    wx.showModal({
      title: '警告',
      content: '是否确定要删除',
      success: async (res)=> {
        if (res.confirm) {
          if(this.data.info.id){
            const res= await util.request('vip/delete',{
              uid:e.currentTarget.dataset.id,
              sid:this.data.info.id
            })
            console.log(res);
          }else{
            const res= await util.request('vip/delete',{
              uid:e.currentTarget.dataset.id
            })
            console.log(res);
          }
          this.setData({
            page:1,
            keyword:'',
            list:[]
          })
          this.getList()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  detail(e){
    wx.navigateTo({
      url: `/pages/vipDetail/vipDetail?uid=${e.currentTarget.dataset.uid}&id=${e.currentTarget.dataset.id}`,
    })
  },
  editVip(e){
    console.log(e.currentTarget.dataset.uid);
    wx.navigateTo({
      url: `/pages/addVip/addVip?type=2&uid=${e.currentTarget.dataset.uid}&memberId=${e.currentTarget.dataset.id}`
    })
  },
  editVip1(e){
    console.log(e.currentTarget.dataset.uid);
    const info = e.currentTarget.dataset.info
    info.name = 'name'
    wx.navigateTo({
      url: `/pages/addVip/addVip?type=1&info=${JSON.stringify(info)}&memberId=${e.currentTarget.dataset.id}`
    })
  },
})