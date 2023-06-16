const app = getApp()
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seller_id: '',
    info: {},
    showBatch: false,
    start: '',
    end: '',
    is_sub: '',
    login_info: '',
    device_types: [],
    permissions: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      permissions: util.permissions
    })
    console.log(options.id);
    this.setData({
      seller_id: options.id,
      is_sub: options.type,
      login_info: app.globalData.info,
      device_types: app.globalData.info.device_types
    })
    // wx.getStorage({
    //   key: 'login_info',
    //   success: (res)=> {
    //     console.log(res.data)
    //     this.setData({
    //       login_info:res.data
    //     })
    //   }
    // })
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
    this.getInfo()
  },
  async getInfo() {
    const res = await util.request('store/detail', {
      id: this.data.seller_id
    })
    console.log(res);
    let info = res.data
    if (info.wired_text) {
      let length = info.wired_text.length
      let wired_text_new = []
      length = Math.ceil(length / 2)
      for (let i = 0; i < length; i++) {
        wired_text_new.push(info.wired_text.splice(0, 2).toString().replace(',', ' | '))
      }

      info.wired_text_new = wired_text_new
    }
    this.setData({
      info
    })
  },
  navi() {
    wx.openLocation({
      latitude: this.data.info.latitude * 1,
      longitude: this.data.info.longitude * 1,
      scale: 18,
      name: this.data.info.name
    })
  },
  toVipList() {
    wx.navigateTo({
      url: `/pages/sellerVip/sellerVip?info=${JSON.stringify(this.data.info)}`
    })
  },
  toStatistics() {
    wx.navigateTo({
      url: `/pages/statisticsSeller/statisticsSeller?info=${JSON.stringify(this.data.info)}`
    })
  },
  delete() {
    wx.showModal({
      title: '提示',
      content: '是否确定要删除',
      success: async (res) => {
        if (res.confirm) {
          await util.request('seller/delete', {
            seller_id: this.data.seller_id
          })
          wx.redirectTo({
            url: '/pages/seller/seller'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  edit() {
    wx.navigateTo({
      url: `/pages/addSeller/addSeller?id=${this.data.seller_id}`,
    })
  },
  bindDevice() {
    wx.scanCode({
      success: async (res) => {
        const result = res.result
        const {
          seller_id
        } = this.data
        if (result.indexOf('https') != -1) {
          const obj = util.returnQrcode(result)
          let res = null
          switch (obj.type) {
            case 'Lease':
              res = await util.request('batteryDevice/bindSeller', {
                seller_id,
                code_type: 'qrcode',
                qrcode: obj.qrcode
              })
              break;
            case 'Xc':
              res = await util.request('WiredDevice/bindSeller', {
                seller_id,
                code_type: 'qrcode',
                qrcode: obj.qrcode
              })
              break;
            case 'Pile':
              res = await util.request('pileDevice/bindSeller', {
                seller_id,
                code_type: 'qrcode',
                qrcode: obj.qrcode
              })
              break;
          }
          if (res.code == 200) {
            wx.showToast({
              title: '绑定成功',
              icon: 'success '
            })
          }
        } else {
          const res = await util.request('batteryDevice/bindSeller', {
            seller_id,
            code_type: 'sn',
            device_id: result
          })
          if (res.code == 200) {
            wx.showToast({
              title: '绑定成功',
              icon: 'success '
            })
          }
        }
      }
    })
  },
  batchLine() {
    this.setData({
      showBatch: true
    })
  },
  getStart(e) {
    this.setData({
      start: e.detail.value
    })
  },
  getEnd(e) {
    this.setData({
      end: e.detail.value
    })
  },
  cancel() {
    this.setData({
      showBatch: false
    })
  },
  stop() {

  },
  async confirm() {
    const {
      seller_id,
      start,
      end
    } = this.data
    const res = await util.request('wired/batchBindSeller', {
      sid: seller_id,
      start,
      end,
      code_type: 'qrcode'
    })
    if (res.code == 200) {
      wx.showToast({
        title: '绑定成功',
        icon: 'success'
      })
      setTimeout(() => {
        this.setData({
          showBatch: false,
          start: '',
          end: ''
        })
      }, 1000)
    }
  },
  batteryDevice() {
    wx.navigateTo({
      url: `/pages/batteryDevice/batteryDevice?name=${this.data.info.name}&sub=${this.data.is_sub}`,
    })
  },
  lineDevice() {
    wx.navigateTo({
      url: `/pages/line/line?name=${this.data.info.name}&sub=${this.data.is_sub}`,
    })
  },
  pileDevice() {
    wx.navigateTo({
      url: `/pages/pile/pile?name=${this.data.info.name}&sub=${this.data.is_sub}`,
    })
  }
})