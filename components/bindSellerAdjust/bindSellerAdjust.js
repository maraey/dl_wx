// components/bindAgency/bindAgency.js
const util = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    del: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    total: 0,
    page: 1,
    pageSize: 10,
    selected: '',
    keyword: '',
    list: [],
    sList: [],
    showPag: false,
    is_adjust: '1',
    nList:[]
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      console.log(this.data.selected);
      console.log(this.data.del);
      this.getInfo()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async getInfo() {
      const {
        page,
        keyword,
        is_adjust
      } = this.data
      const res = await util.request('seller/sellerList', {
        page,
        page_size: this.data.pageSize,
        keyword,
        is_adjust
      })
      const list = []
      res.data.list.forEach(item => {
        if(is_adjust == 1){
          if (this.data.del.indexOf(item.seller_id) == -1 ) {
            const obj = {}
            obj.id = item.seller_id
            obj.name = item.name
            if (is_adjust == 1) {
              obj.checked = true
            } else {
              obj.checked = false
            }
            list.push(obj)
          }else{
            const nList = this.data.nList
            const obj = {}
            obj.id = item.seller_id
            obj.name = item.name
            obj.checked = false
            nList.push(obj)
            this.setData({
              nList
            })
          }
        }else{
          const obj = {}
            obj.id = item.seller_id
            obj.name = item.name
            if (is_adjust == 1) {
              obj.checked = true
            } else {
              obj.checked = false
            }
            list.push(obj)
        }
      });
      if(is_adjust == 2){
        list.push(...this.data.nList)
      }
      this.setData({
        list,
        total: res.data.total
      })
      if (this.data.total / this.data.pageSize > 1) {
        this.setData({
          showPag: true
        })
      }
    },
    handlePage(e) {
      this.setData({
        page: e.detail
      })
      this.getInfo()
    },
    handleSelectNew(e) {
      const list = this.data.list
      list[e.currentTarget.dataset.index].checked = !list[e.currentTarget.dataset.index].checked
      this.setData({
        list
      })
    },
    sub() {
      if (this.data.is_adjust == 1) {
        console.log(111);
        const sList = this.data.sList
        this.data.list.forEach(item => {
          if (!item.checked) {
            sList.push(item)
          }
        })
        console.log(sList);
        const totals = this.data.total * 1 - sList.length
        this.triggerEvent('selected', {
          list: sList,
          type: 1,
          total: totals
        })
      } else {
        console.log(222);
        const sList = this.data.sList
        this.data.list.forEach(item => {
          if (item.checked) {
            sList.push(item)
          }
        })
        this.triggerEvent('selected', {
          list: sList,
          type: 2
        })
      }
      this.cancle()
    },
    cancle() {
      this.triggerEvent('cancle')
    },
    handleInput(e) {
      this.setData({
        keyword: e.detail.value,
        page: 1
      })
      this.getInfo()
    },
    screen(e) {
      this.setData({
        is_adjust: e.currentTarget.dataset.type,
        page: 1,
        sList: []
      })
      this.getInfo()
    }
  }
})