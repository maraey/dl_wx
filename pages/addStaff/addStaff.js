const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    password: '',
    open_lock: 1,
    status: 1,
    id:'',
    info:'',
    disable:false,
    brokerage:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad  (options) {
    if(options.id||options.id===0){
      this.setData({
        id:options.id
      })
      wx.setNavigationBarTitle({
        title: '修改地推',
      })
    }
    if(options.info){
      const info = JSON.parse(options.info)
      if(info.id||info.id===0){
        this.setData({
          info,
          phone:info.phone,
          password:'******',
          disable:true,
          name:info.name,
          open_lock:info.open_lock,
          status:info.status,
          brokerage:info.brokerage
        })
      }
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

  },
  handleRate(e) {
    this.setData({
      brokerage: e.detail.value
    })
  },
  handleName(e){
    this.setData({
      name: e.detail.value
    })
  },
  handlePhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  handlePsw(e){
    this.setData({
      password: e.detail.value
    })
  },
  openLock(e){
    let open_lock = e.detail.value
    if(open_lock){
      open_lock = 1
    }else{
      open_lock = 0
    }
    this.setData({
      open_lock
    })
  },
  handleStatus(e){
    let status = e.detail.value
    if(status){
      status = 2
    }else{
      status = 1
    }
    this.setData({
      status
    })
  },
  async sub(){
    if(this.data.info.id||this.data.info.id===0){
      const res = await util.request('marketer/edit',{
        id:this.data.id,
        type:3,
        name: this.data.name,
        status:this.data.status,
        open_lock: this.data.open_lock,
        brokerage:this.data.brokerage
      })
      if(res.code == 1){
        wx.showToast({
          title: res.msg,
          icon:'success',
          duration:1000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      }
    }else{
      const res = await util.request('marketer/addBd',{
        name: this.data.name,
        phone:this.data.phone,
        password:this.data.password,
        status:this.data.status,
        can_popup: this.data.open_lock,
        brokerage:this.data.brokerage
      })
      if(res.code == 200){
        wx.showToast({
          title: res.msg,
          icon:'success',
          duration:1000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      }
    }
  }
})