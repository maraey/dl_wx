// components/bindAgency/bindAgency.js
const util = require('../../utils/util')
let timer = null
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
    total:0,
    page:1,
    pageSize:20,
    selected:'',
    name: '',
    list: [],
    role:'agency'
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      this.getInfo()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async getInfo(){
      const {name,page,pageSize,role} = this.data
      const res = await util.request('role/list',{
        name,
        page,
        page_size:pageSize,
        role
      })
      this.setData({
        list:res.data.list,
        total:res.data.total
      })
    },
    selectRole(e){
      this.setData({
        role: e.currentTarget.dataset.role,
        page:1
      })
      this.getInfo()
    },
    handleName(e){
      this.setData({
        name:e.detail.value
      })
      clearTimeout(timer)
      timer = setTimeout(()=>{
        this.setData({
          page:1
        })
        this.getInfo()
      },300)
      
    },
    handlePage(e){
      console.log(e.detail);
      this.setData({
        page:e.detail
      })
      this.getInfo()
    },
    handleSelect(e){
      this.setData({
        selected:e.currentTarget.dataset.id
      })
    },
    sub(){
      this.triggerEvent('selected',this.data.selected)
    },
    cancle(){
      this.triggerEvent('cancle')
    }
  }
})
