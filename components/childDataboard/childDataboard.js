// components/childDataboard/childDataboard.js
const util = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    child: {
      type: Array,
      value: []
    },
    type: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    async loadSub(e) {
      const {
        type,
        child
      } = this.data
      const sub = e.currentTarget.dataset.sub
      if (sub) {
        const sub_id = e.currentTarget.dataset.id
        const index = e.currentTarget.dataset.index
        const res = await util.request('powerbankDevice/searchList', {
          type,
          sub_id
        })
        child[index].children=res.data
        this.setData({
          child
        })
      }

    },
    batteryList(e){
      const id = e.currentTarget.dataset.id
      const name = e.currentTarget.dataset.name
      const {type}=this.data
      wx.navigateTo({
        url: `/pages/batteryList/batteryList?id=${id}&type=${type}&name=${name}`,
      })
    }
  }
})