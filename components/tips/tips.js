// components/tips/tips.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    isShow(){
      this.setData({
        isShow: !this.data.isShow
      })
    }
  }
})
