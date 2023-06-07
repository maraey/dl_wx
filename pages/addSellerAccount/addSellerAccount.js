const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerArray: ['普通', '显示订单金额', '隐藏日收益'],
    pickerIndex: '',
    name: '',
    phone: '',
    password: '',
    open_lock: 1,
    status: 1,
    shop_grade: '',
    disable: false,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id || options.id == 0) {
      this.setData({
        id: options.id
      })
      wx.setNavigationBarTitle({
        title: '修改门店账户',
      })
    }
    if (options.info) {
      const info = JSON.parse(options.info)
      if (info.id || info.id == 0) {
        this.setData({
          info,
          shop_grade:info.shop_grade,
          pickerIndex: info.shop_grade - 1 + '',
          name: info.name,
          phone: info.phone,
          password: '******',
          disable: true,
          open_lock: info.open_lock,
          status: info.status
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
  bindPickerChange(e) {
    this.setData({
      pickerIndex: e.detail.value,
      shop_grade: e.detail.value * 1 + 1
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
  openLock(e) {
    let open_lock = e.detail.value
    if (open_lock) {
      open_lock = 1
    } else {
      open_lock = 0
    }
    this.setData({
      open_lock
    })
  },
  handleStatus(e) {
    let status = e.detail.value
    if (status) {
      status = 2
    } else {
      status = 1
    }
    this.setData({
      status
    })
  },
  async sub() {
    // if (!this.data.shop_grade) {
    //   wx.showToast({
    //     title: '请选择门店等级',
    //     icon: 'error',
    //     duration: 1000
    //   })
    //   return
    // }
    if (this.data.id) {
      const res = await util.request('marketer/edit', {
        id:this.data.id,
        name: this.data.name,
        status: this.data.status,
        open_lock: this.data.open_lock,
      })
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      }
    } else {
      const res = await util.request('marketer/addManager', {
        name: this.data.name,
        phone: this.data.phone,
        password: this.data.password,
        status: this.data.status,
        open_lock: this.data.open_lock,
      })
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      }
    }
  }
})