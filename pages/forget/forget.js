const util = require('../../utils/util')
let Interval = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    phone: '',
    new_password: '',
    confirm_password: '',
    code: '',
    popup_image: '',
    image_code: '',
    image_code_key: '',
    count_time: '',
    showError: false,
    showCountTime: false
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {

  },
  handlePhone(e) {
    console.log();
    this.setData({
      phone: e.detail.value
    })
  },
  handleCode(e) {
    this.setData({
      code: e.detail.value
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
  randomString(length) {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
      result += str[Math.floor(Math.random() * str.length)];
    return result;
  },
  getImageCode() {
    const key = this.randomString(6)
    this.setData({
      popup_image: util.config.host + 'misc/captcha?key=' + key,
      image_code_key: key
    })
  },
  getCodePopup() {
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'error',
        duration: 1000
      })
      return
    }
    this.getImageCode()
    this.setData({
      showPopup: true
    })
  },
  handleImageCode(e) {
    if (this.data.showError) {
      this.setData({
        showError: false
      })
    }
    this.setData({
      image_code: e.detail.value
    })
  },
  closePopup() {
    this.setData({
      showPopup: false
    })
  },
  setCountDown(time) {
    Interval = setInterval(() => {
      if (time > 0) {
        time--
        this.setData({
          count_time: time
        })
      } else {
        this.setData({
          showCountTime: false
        })
        clearInterval(Interval)
      }
    }, 1000);
  },
  async sendSms() {
    const res = await util.request('auth/sms', {
      ocode: util.config.ocode,
      code: this.data.image_code,
      phone: this.data.phone,
      key: this.data.image_code_key,
      type: 'password'
    })
    console.log(res);
    if (res.msg == '验证码错误') {
      this.setData({
        showError: true
      })
    }
    if (res.code == 1) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 1000
      })
      this.setData({
        showCountTime: true,
        showPopup: false
      })
      this.setCountDown(res.data.time)
    }
  },
  async resetPsw(){
    if(!this.data.code||!this.data.new_password||!this.data.confirm_password||!this.data.phone){
      wx.showToast({
        title: '请填写完所有相关信息',
        icon: 'error',
        duration: 1000
      })
      return
    }
    const res = await util.request('Auth/resetPassword',{
      ocode: util.config.ocode,
      code: this.data.code,
      new_password:this.data.new_password,
      confirm_password: this.data.confirm_password,
      phone: this.data.phone
    })
    console.log(res);
    if(res.code==200){
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 1000
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }, 1000);
    }
  }
})