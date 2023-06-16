// pages/sellerVip/sellerVip.js
const util = require('../../utils/util')
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    page: 1,
    page_size: 10,
    total: 0,
    list: [],
    sub_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {
    if(options.id||options.id===0){
      this.setData({
        sub_id:options.id
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
      name: '',
      page: 1,
      page_size:10,
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
    const {name,
      page,
      page_size,
    list,sub_id} = this.data
    const res = await util.request('store/index',{
      view_type:'all',
      name,
      page,
      page_size,
      sub_id
    })
    list.push(...res.data.list)
    this.setData({
      list,
      total:res.data.total
    })
  },
  handleName(e) {
    this.setData({
      name: e.detail.value
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
})