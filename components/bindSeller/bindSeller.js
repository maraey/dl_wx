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
    pageSize: 10,
    selected: '',
    keyword: '',
    list: [],
    showPag: false,
    type: 'all'
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      console.log(this.data.selected);
      this.getInfo()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async getInfo() {
      const res = await util.request('vip/searchStore', {
        page: this.data.page,
        page_size: this.data.pageSize,
        keyword: this.data.keyword
      })
      console.log(11);
      const list = res.data.list
      const selectedList = this.data.selectedList
      console.log(selectedList);
      let oldList = []
      let oldSelected = []
      list.forEach(item => {
        oldList.push(item.id)
      })
      if (selectedList) {
        selectedList.forEach(item => {
          oldSelected.push(item.id)
        })
      }
      oldList.forEach((item, index) => {
        if (oldSelected.indexOf(item) != -1) {
          list[index].checked = true
        }
      })
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
      console.log(e.detail);
      this.setData({
        page: e.detail
      })
      this.getInfo()
    },
    handleSelect(e) {
      const list = this.data.list
      const index = e.currentTarget.dataset.index
      const selectedList = this.data.selectedList
      let oldSelected = []
      selectedList.forEach(item => {
        oldSelected.push(item.id)
      })
      if (list[index].checked) {
        list[index].checked = false
        if (oldSelected.indexOf(list[index].id) != -1) {
          console.log(oldSelected.indexOf(list[index].id));
          selectedList.splice(oldSelected.indexOf(list[index].id), 1)
          console.log(selectedList);
          this.setData({
            selectedList
          })
        }
      } else {
        list[index].checked = true
        if (oldSelected.indexOf(list[index].id) == -1) {
          selectedList.push(list[index])
          this.setData({
            selectedList
          })
        }
      }
      this.setData({
        list
      })
    },
    handleSelectNew(e){
      const list = this.data.list
      const index = e.currentTarget.dataset.index
      const selectedList = this.data.selectedList
      
      list.forEach(item=>{
        if(item.id==selectedList[index].id){
          item.checked = false
        }
      })
      selectedList[index].checked=false
      this.setData({
        selectedList,
        list
      })
    },
    sub() {
      const selectedListOld = this.data.selectedList
      let selectedList= []
      selectedListOld.forEach(item=>{
        if(item.checked){
          selectedList.push(item)
        }
      })
      this.triggerEvent('selected', selectedList)
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
        type: e.currentTarget.dataset.type
      })
    }
  }
})