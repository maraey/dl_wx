// pages/addVip/addVip.js
const util = require('../../utils/util')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    type: 2,
    powerbank_type: 1,
    powerbank_num: '',
    powerbank_every_time: '',
    powerbank_free: '',
    confirmData: {
      powerbank_type: 1,
      powerbank_num: '',
      powerbank_every_time: '',
      powerbank_free: ''
    },
    array: ["9折", "8折", "7折", "6折", "5折", "4折", "3折", "2折", "1折"],
    index: '',
    disabled: false,
    showSearch: false,
    member_id: '',
    user_info: {},
    uid: '',
    discount: '',
    bindSeller: false,
    selectedSellerList: [],
    wired_free: '',
    info: {},
    device_types: [],
    editType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    if (options.type == 1) {
      const info = JSON.parse(options.info)
      if (options.memberId) {
        this.setData({
          member_id: options.memberId
        })
        info.member_id = options.memberId
      }
      const {
        array
      } = this.data
      let discount = ''
      if (info.powerbank_discount) {
        discount = array.indexOf(`${info.powerbank_discount}折`)
      }
      const confirmData = {
        powerbank_type: 1,
        powerbank_num: '',
        powerbank_every_time: '',
        powerbank_free: ''
      }
      confirmData.powerbank_type = info.powerbank_type
      confirmData.powerbank_num = info.powerbank_num
      confirmData.powerbank_every_time = info.powerbank_every_time
      confirmData.powerbank_free = info.powerbank_free
      this.setData({
        info,
        uid: info.uid,
        type: info.vip_type,
        wired_free: info.wired_free,
        index:discount,
        discount:info.powerbank_discount,
        confirmData,
        powerbank_type:info.powerbank_type,
        editType: options.type,
        powerbank_num:info.powerbank_num,
        powerbank_every_time:info.powerbank_every_time
      })
      wx.setNavigationBarTitle({
        title: '修改门店vip',
      })
    } else if (options.type == 2) {
      const info = {
        member_id: options.memberId,
        name:'name'
      }
      this.setData({
        uid: options.uid,
        editType: options.type,
        info
      })
      wx.setNavigationBarTitle({
        title: '修改门店vip',
      })
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
    console.log(app.globalData.info);
    this.setData({
      device_types: app.globalData.info.device_types
    })
  },
  bindType(e) {
    this.setData({
      type: e.detail.value
    })
  },
  openPopup() {
    this.setData({
      showPopup: true
    })
  },
  closePopup() {
    const {
      confirmData
    } = this.data
    const {
      powerbank_type,
      powerbank_num,
      powerbank_every_time,
      powerbank_free
    } = confirmData
    this.setData({
      powerbank_type,
      powerbank_num,
      powerbank_every_time,
      powerbank_free,
      showPopup: false
    })
  },
  confirmRule() {
    const {
      confirmData
    } = this.data
    const {
      powerbank_type,
      powerbank_num,
      powerbank_every_time,
      powerbank_free
    } = this.data
    if (powerbank_type == 1) {
      console.log(1);
      if (!powerbank_num) {
        console.log(2);
        wx.showToast({
          title: '请输入免费次数',
          icon: 'error'
        })
        return
      }
      if (!powerbank_every_time) {
        wx.showToast({
          title: '请输入免费时长',
          icon: 'error'
        })
        return
      }
      confirmData.powerbank_num = powerbank_num
      confirmData.powerbank_every_time = powerbank_every_time
      confirmData.powerbank_free = ''
    } else {
      if (!powerbank_free) {
        wx.showToast({
          title: '请输入免费时长',
          icon: 'error'
        })
        return
      }
      confirmData.powerbank_num = ''
      confirmData.powerbank_every_time = ''
      confirmData.powerbank_free = powerbank_free
    }
    confirmData.powerbank_type = powerbank_type
    this.setData({
      confirmData,
      showPopup: false
    })
  },
  selectType(e) {
    this.setData({
      powerbank_type: e.detail.value
    })
  },
  batteryNUm(e) {
    this.setData({
      powerbank_num: e.detail.value
    })
  },
  batteryEveryTime(e) {
    this.setData({
      powerbank_every_time: e.detail.value
    })
  },
  batteryFree(e) {
    this.setData({
      powerbank_free: e.detail.value
    })
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
      discount: 9 - e.detail.value
    })
    console.log(this.data.discount)
  },
  handleUserId(e) {
    this.setData({
      member_id: e.detail.value
    })
  },
  async searchUser() {
    const res = await util.request('vip/searchUser', {
      member_id: this.data.member_id
    })
    console.log(res.data);
    if (res.data.id) {
      this.setData({
        user_info: res.data,
        showSearch: true
      })
    } else {
      wx.showToast({
        title: '未查询到会员',
        icon: 'error'
      })
    }
  },
  vipConfirm() {
    this.setData({
      uid: this.data.user_info.id,
      disabled: true,
      showSearch: false
    })
  },
  searchDelete() {
    this.setData({
      member_id: '',
      uid: '',
      disabled: false,
      user_info: {}
    })
  },
  bindSeller() {
    this.setData({
      bindSeller: true
    })
    wx.setNavigationBarTitle({
      title: '选择门店',
    })
  },
  cancleSeller() {
    this.setData({
      bindSeller: false
    })
    wx.setNavigationBarTitle({
      title: '添加门店VIP',
    })
  },
  selectSeller(e) {
    console.log(e.detail);
    this.setData({
      selectedSellerList: e.detail,
      bindSeller: false
    })
    wx.setNavigationBarTitle({
      title: '添加门店VIP',
    })
  },
  handleWired(e) {
    this.setData({
      wired_free: e.detail.value
    })
  },
  async sub() {
    const {
      uid,
      type,
      selectedSellerList,
      wired_free,
      confirmData,
      discount
    } = this.data
    const {
      powerbank_type,
      powerbank_num,
      powerbank_free,
      powerbank_every_time
    } = confirmData
    const store_ids = []
    selectedSellerList.forEach(item => {
      store_ids.push(item.id)
    })
    const res = await util.request('vip/add', {
      uid,
      vip_type: type,
      powerbank_type,
      powerbank_num,
      powerbank_free,
      powerbank_every_time,
      wired_free,
      powerbank_discount: discount,
      store_ids: store_ids.join()
    })
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1000
    })
    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  },
  async edit1() {
    const {
      info,
      type,
      wired_free,
      discount,
      confirmData
    } = this.data
    const {
      powerbank_type,
      powerbank_num,
      powerbank_free,
      powerbank_every_time
    } = confirmData
    const res = await util.request('vip/editInfo', {
      id: info.id,
      vip_type:type,
      wired_free,
      powerbank_discount: discount,
      powerbank_type,
      powerbank_num,
      powerbank_free,
      powerbank_every_time
    })
    if (res.code == 200) {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    }
  },
  async edit2() {
    const {
      uid,
      type,
      wired_free,
      confirmData,
      discount
    } = this.data
    const {
      powerbank_type,
      powerbank_num,
      powerbank_free,
      powerbank_every_time
    } = confirmData
    const res = await util.request('vip/editUser',{
      uid,
      vip_type: type,
      powerbank_type,
      powerbank_num,
      powerbank_free,
      powerbank_every_time,
      wired_free,
      powerbank_discount: discount
    })
    if(res.code==200){
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    }
  }
})