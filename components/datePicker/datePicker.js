// components/datePicker/datePicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String,
      value: '自定义时间'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    start: '',
    end: '',
    dateMax: ''
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      console.log(11);
      const date = new Date()
      const year = date.getFullYear()
      const month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)
      const day = (date.getDate() - 1) < 10 ? ('0' + (date.getDate() - 1)) : (date.getDate() - 1)
      this.setData({
        dateMax: `${year}-${month}-${day}`
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      wx.showModal({
        title: '未确认时间',
        content: '是否确定关闭',
        success: (res) => {
          if (res.confirm) {
            this.triggerEvent('close')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    },
    stop() {

    },
    confirm() {
      const {
        start,
        end
      } = this.data
      if (!start || !end) {
        if (!start) {
          wx.showToast({
            title: '请输入起始时间',
            icon:'none'
          })
        } else {
          wx.showToast({
            title: '请输入结束时间',
            icon:'none'
          })
        }
        return
      }
      this.triggerEvent('confirm', [start, end])
    },
    bindStartDate(e) {
      console.log(e);
      this.setData({
        start: e.detail.value
      })
    },
    bindEndDate(e) {
      this.setData({
        end: e.detail.value
      })
    },
  },

})