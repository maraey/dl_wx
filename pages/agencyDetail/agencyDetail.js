// pages/agencyDetail/agencyDetail.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: '',
    info: '',
    battery: '',
    wired: '',
    pile: '',
    role: '',
    permissions:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      permissions: util.permissions
    })
    console.log(this.data.permissions)
    if (options.id || options.id == 0) {
      this.setData({
        user_id: options.id
      })
    }
    if (options.role) {
      this.setData({
        role: options.role
      })
      if (options.role == 'manager') {
        wx.setNavigationBarTitle({
          title: '门店账户详情',
        })
      } else if (options.role == 'bd') {
        wx.setNavigationBarTitle({
          title: '地推人员详情',
        }) 
      } else if (options.role == 'introducer') {
          wx.setNavigationBarTitle({
            title: '渠道商详情',
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
    this.getInfo()
  },
  async getInfo() {
    const res = await util.request('marketer/detail', {
      id: this.data.user_id
    })
    // const res1 = await util.request('role/device', {
    //   role_id: this.data.user_id
    // })
    // const {
    //   battery,
    //   wired,
    //   pile
    // } = res1.data
    this.setData({
      info: res.data,
      // battery,
      // wired,
      // pile
    })
  },
  delete(e) {
    wx.showModal({
      title: '提示',
      content: '是否确定要删除',
      success: async (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          const res = await util.request('role/delete', {
            id: this.data.user_id
          })
          if (res.code == 1) {
            wx.showToast({
              title: res.msg,
              icon: 'success',
              duration: 1000
            });
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/agencyList/agencyList',
              })
            }, 1000)
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  edit() {
    wx.navigateTo({
      url: `/pages/addAgency/addAgency?id=${this.data.user_id}&info=${JSON.stringify(this.data.info)}`,
    })
  },
  editSeller() {
    wx.navigateTo({
      url: `/pages/addSellerAccount/addSellerAccount?id=${this.data.user_id}&info=${JSON.stringify(this.data.info)}`,
    })
  },
  editEmployee() {
    wx.navigateTo({
      url: `/pages/addStaff/addStaff?id=${this.data.user_id}&info=${JSON.stringify(this.data.info)}`,
    })
  },
  sellerList() {
    wx.navigateTo({
      url: `/pages/sellerList/sellerList?id=${this.data.user_id}`,
    })
  },
  bind(){
    console.log(111);
    wx.scanCode({
      success: async (res) => {
        const result = res.result
        const {
          user_id
        } = this.data
        if (result.indexOf('https') != -1) {
          const obj = util.returnQrcode(result)
          let res = null
          switch (obj.type) {
            case 'Lease':
              res = await util.request('batteryDevice/bindAgency', {
                agency_id:user_id,
                code_type: 'qrcode',
                qrcode: obj.qrcode
              })
              break;
            case 'Xc':
              res = await util.request('WiredDevice/bindAgency', {
                agency_id:user_id,
                qrcode: obj.qrcode
              })
              break;
            case 'Pile':
              res = await util.request('PileDevice/bindAgency', {
                agency_id:user_id,
                code_type: 'qrcode',
                qrcode: obj.qrcode
              })
              break;
          }
          if (res.code == 1) {
            wx.showToast({
              title: '绑定成功',
              icon: 'success '
            })
          }
        } else {
          const res = await util.request('batteryDevice/bindAgency', {
            agency_id:user_id,
            code_type: 'sn',
            device_id: result
          })
          if (res.code == 1) {
            wx.showToast({
              title: '绑定成功',
              icon: 'success '
            })
          }
        }
      }
    })
  }
})