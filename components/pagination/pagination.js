// components/pagination/pagination.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    total:{
      type:Number,
      value:0
    },
    pageSize:{
      type:Number,
      value:20
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pageNum:[],
    page:1,
    scrollInto:"id0"
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      const num = Math.ceil(this.data.total/this.data.pageSize)
      let pageNum = []
      for(let i=0; i< num;i++){
        pageNum.push(1)
      }
      this.setData({
        pageNum
      })
    },
    detached () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindFirst(){
      this.setPage(1)
      this.setData({
        scrollInto:'id1'
      })
    },
    bindLast(){
      this.setPage(Number(this.data.pageNum.length))
      this.setData({
        scrollInto:`id${Number(this.data.pageNum.length)-1}`
      })
    },
    previous(){
      if(this.data.page>1){
        this.setPage(this.data.page-1)
        this.setData({
          scrollInto:`id${Number(this.data.page)-1}`
        })
      }
    },
    next(){
      if(this.data.page<this.data.pageNum.length){
        this.setPage(Number(this.data.page)+1)
        this.setData({
          scrollInto:`id${Number(this.data.page)-1}`
        })
      }
    },
    setPage(page){
      this.setData({
        page
      })
      this.triggerEvent('newPage', this.data.page)
    },
    bindPage(e){
      this.setPage(e.currentTarget.dataset.index)
    }
  }
})
