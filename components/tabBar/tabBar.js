// components/tabBar.js
const util = require('../../utils/util')
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selected: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    role:'',
    permissions:[]
  },
  attached() {
    this.setData({
      permissions: util.permissions
    })
    wx.getStorage({
      key: 'login_info',
      success: (res)=> {
        this.setData({
          role:res.data.role
        })
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toPage(e) {
      if(e.currentTarget.dataset.selected==this.data.selected){
        return
      }
      this.setData({
        selected: e.currentTarget.dataset.selected
      })
      wx.redirectTo({
        url: `/pages/${e.currentTarget.dataset.selected}/${e.currentTarget.dataset.selected}`
      })
    }
  }
})
