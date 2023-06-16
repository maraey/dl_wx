// pages/editWithdrawal/editWithdrawal.js
const util = require('../../utils/util')
let Interval = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    popup_image: '',
    image_code: '',
    image_code_key: '',
    showError: false,
    showCountTime: false,
    count_time: '',
    pay_type: '',
    real_name: '',
    code: '',
    phone: '',
    bank: '',
    bank_branch: '',
    accountName: '',
    img: '',
    img_url: '',
    types:[],
    isEdit:false,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.type=='add'){
      wx.setNavigationBarTitle({
        title: '添加提现信息',
      })
    }
    this.getInfo()
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
  async getInfo(){
    const res = await util.request('user/withdrawalAccount')
    if(res.code == 301){
      this.setData({
        pay_type:res.data.types[0].id,
        phone: res.data.phone,
        types:res.data.types,
        isEidt:false
      })
    }else if(res.code==200){
      this.setData({
        pay_type:res.data.types[0].id,
        phone: res.data.phone,
        types:res.data.types,
        isEdit:true,
        id:res.data.id
      })
    }
  },
  getUSerInfo() {
    console.log(1);
    wx.login({
      success: async (res) => {
        const res1 = await util.request('auth/agency', {
          code: res.code
        })
        this.setData({
          accountName: res1.data.openid
        })
      }
    })
  },
  getCodePopup() {
    this.getImageCode()
    this.setData({
      showPopup: true
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
      popup_image: util.config.host + 'misc/captcha?key=' + key + '&ocode=' + util.config.ocode,
      image_code_key: key
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
  handleRealName(e) {
    console.log(e);
    this.setData({
      real_name: e.detail.value
    })
  },
  handlePayType(e) {
    this.setData({
      pay_type: e.detail.value
    })
  },
  handleCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  handlePhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  handleBank(e) {
    this.setData({
      bank: e.detail.value
    })
  },
  handleBankBranch(e) {
    this.setData({
      bank_branch: e.detail.value
    })
  },
  handleAccName(e) {
    this.setData({
      accountName: e.detail.value
    })
  },
  async sendSms() {
    wx.showToast({
      title: '正在发送',
      icon: 'none'
    })
    const {
      phone,
      image_code,
      image_code_key
    } = this.data
    const res = await util.request('auth/sms', {
      code: image_code,
      phone,
      key: image_code_key,
      ocode: util.config.ocode,
      type: 'bank'
    })
    wx.showToast({
      title: res.msg,
      icon: 'none'
    })
    if (res.msg == '验证码错误') {
      this.setData({
        showError: true
      })
    }
    if (res.code == 200) {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      })
      this.setData({
        showCountTime: true,
        showPopup: false
      })
      this.setCountDown(res.data.time)
    } else if (res.code == 301) {
      wx.showToast({
        title: '发送频繁,请' + res.data.time + '秒后再发送',
        icon: 'none'
      })
    }
  },
  uploadImage() {
    wx.chooseImage({
      count: 1,
      success: async (res) => {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0]);
        let img = await util.uploadImage(tempFilePaths[0])
        img = JSON.parse(img.data)
        if (img.code == 1) {
          this.setData({
            img: img.data.id,
            img_url: tempFilePaths[0]
          })
        }
      }
    })
  },
  async sub() {
    wx.showToast({
      title: '请稍后...',
      icon: 'none'
    })
    const {
      pay_type,
      bank,
      real_name,
      accountName,
      bank_branch,
      phone,
      code,
      img
    } = this.data
    if(!this.data.isEdit){
      const res = await util.request('user/accountAdd', {
        pay_type,
        bank,
        real_name,
        account:accountName,
        bank_branch,
        phone,
        code,
        img
      })
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      clearInterval(Interval)
      if(res.code == 1){
        setTimeout(()=>{
          wx.redirectTo({
            url:'/pages/Withdrawal/Withdrawal'
          })
        },800)
      }
    }else{
      const res = await util.request('user/accountEdit', {
        id:this.data.id,
        pay_type,
        bank,
        real_name,
        account:accountName,
        bank_branch,
        phone,
        code,
        img
      })
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      clearInterval(Interval)
      if(res.code == 1){
        setTimeout(()=>{
          wx.redirectTo({
            url:'/pages/Withdrawal/Withdrawal'
          })
        },800)
      }
    }
    
  }
})