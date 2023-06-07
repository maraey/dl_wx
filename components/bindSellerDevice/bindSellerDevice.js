// components/bindAgency/bindAgency.js
const util = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectedList: {
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
    pageSize: 20,
    selected: '',
    keyword: '',
    list: [],
    showPag: false,
    type: 'all',
    seller_id:''
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      this.getList()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async getList() {
      const {keyword,page,pageSize} = this.data
      const res = await util.request('seller/sellerList',{
        is_sub:false,
        keyword,
        page,
        page_size:pageSize
      })
      const {list,total} = res.data
      if(total/pageSize>1){
        this.setData({
          showPag:true
        })
      }
      this.setData({
        list,
        total
      })
    },
    handleSelect(e){
      this.setData({
        seller_id:e.currentTarget.dataset.id
      })
    },
    handlePage(e) {
      this.setData({
        page: e.detail,
        showPag:false
      })
      this.getList()
    },
    sub() {
      this.triggerEvent('selected', this.data.seller_id)
    },
    cancle() {
      this.triggerEvent('cancle')
    },
    handleInput(e) {
      this.setData({
        keyword: e.detail.value,
        page: 1,
        showPag:false
      })
      this.getList()
    },
  }
})