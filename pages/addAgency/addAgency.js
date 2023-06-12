const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_sub:false,
    is_self: 1,
    name: '',
    phone: '',
    password: '',
    can_sub:1,
    status: 1,
    can_popup: 1,
    brokerage:'',
    id:'',
    info:'',
    disable:false,
    self:true,
    can_withdrawal:1,
    can_pass: 0
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
        title: '修改代理',
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
          is_self:info.is_self,
          name:info.name,
          brokerage:info.brokerage,
          can_sub:info.can_sub,
          can_popup:info.can_popup,
          status:info.status,
          can_withdrawal:info.can_withdrawal,
          can_pass:info.can_pass
        })
        if(info.is_self==1){
          this.setData({
            self:false
          })
        }
      }
    }
    try {
      const value = wx.getStorageSync('login_info')
      console.log(value)
      if (value) {
        this.setData({
          is_sub: value.can_sub,
        })
        app.globalData.info=value
      }
    } catch (e) {
      // Do something when catch error
      this.setData({
        can_sub: false
      })
    }
    console.log(this.data.is_sub)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(){

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){

  },
  bindIsSelf(e) {
    this.setData({
      is_self: e.detail.value
    })
  },
  handleName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  handlePhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  handlePsw(e) {
    this.setData({
      password: e.detail.value
    })
  },
  handleRate(e) {
    this.setData({
      brokerage: e.detail.value
    })
  },
  canSub(e){
    let can_sub = e.detail.value
    if(can_sub){
      can_sub = 1
    }else{
      can_sub = 0
    }
    this.setData({
      can_sub
    })
  },
  openLock(e){
    let can_popup = e.detail.value
    if(can_popup){
      can_popup = 1
    }else{
      can_popup = 0
    }
    this.setData({
      can_popup
    })
  },
  handleWithdrawal(e){
    let can_withdrawal = e.detail.value
    if(can_withdrawal){
      can_withdrawal = 1
    }else{
      can_withdrawal = 0
    }
    this.setData({
      can_withdrawal
    })
  },
  handlePass(){
    let can_pass = e.detail.value
    if(can_pass){
      can_pass = 1
    }else{
      can_pass = 0
    }
    this.setData({
      can_pass
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
        name: this.data.name,
        type: this.data.is_self,
        can_sub:this.data.can_sub,
        status:this.data.status,
        can_popup: this.data.can_popup,
        brokerage:this.data.brokerage,
        can_withdrawal:this.data.can_withdrawal,
        can_pass:this.data.can_pass
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
    }else{
      const res = await util.request('marketer/addAgent',{
        type: this.data.is_self,
        name: this.data.name,
        phone:this.data.phone,
        password:this.data.password,
        can_sub:this.data.can_sub,
        status:this.data.status,
        can_popup: this.data.can_popup,
        brokerage:this.data.brokerage,
        can_withdrawal:this.data.can_withdrawal,
        can_pass:this.data.can_pass
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