// pages/resetPsw/resetPsw.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    old_password: '',
    new_password: '',
    confirm_password: '',
    canSub: true
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

  },
  handleOld(e) {
    this.setData({
      old_password: e.detail.value
    })
  },
  handleNew(e) {
    this.setData({
      new_password: e.detail.value
    })
  },
  handleConfirm(e) {
    this.setData({
      confirm_password: e.detail.value
    })
  },
  async sub() {
    const {
      old_password,
      new_password,
      confirm_password,
      canSub
    } = this.data
    if (canSub) {
      this.setData({
        canSub: false
      })
      if(confirm_password==new_password){
        const res = await util.request('user/password', {
          old_password,
          new_password,
          confirm_password
        })
        if(res.code==200){
          wx.showToast({
            title: res.msg,
            icon:'success'
          })
          
          setTimeout(async ()=>{
            this.setData({
              canSub:true
            })
            const res = await util.request('auth/logout')
            if(res.code == 1){
              wx.clearStorageSync()
              wx.reLaunch({
                url: '/pages/login/login'
              })
            }
          },800)
        }
      }else{
        wx.showToast({
          title: '两次密码不一致',
          icon:'error'
        })
        this.setData({
          canSub:true
        })
      }
      
    }
  }
})