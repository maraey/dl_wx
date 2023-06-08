const app = getApp()
const util = require('../../utils/util')
let timer = null
Page({
  data: {
    start:'',
    end:'',
    month:'',
    sortby:'',
    tab_select:'seller',
    placeholder:'请输入门店名称',
    type:'all',
    list:[],
    keyword:'',
    info:'',
    device_types:[],
    selected: '',
    showDatePicker:false
  },
  onLoad(options) {
    let date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth()
    month+=1
    if(month<10){
      month= '0'+month
    }
    let day = date.getDate()
    if(day<10){
      day='0'+day
    }
    date = `${year}-${month}-${day}`
    this.setData({
      date,
      month:`${year}-${month}`
    })
    this.getData()
    this.setData({
      info:app.globalData.info,
      device_types:app.globalData.info.device_types,
    })
    // wx.getStorage({
    //   key: 'login_info',
    //   success: (res)=> {
    //     console.log(res.data)
    //     this.setData({
    //       info:res.data
    //     })
    //   }
    // })
  },
  onShow() {
    
  },
  tabbar(e) {
    const selected = e.currentTarget.dataset.type
    this.setData({
      selected
    })
    if (selected == 'custom') {
      this.setData({
        showDatePicker: true
      })
    } else {
      console.log(this.data.selected)
      this.getData()
    }
  },
  async getData(){
    let res = null
    const {keyword,tab_select,start,end,sortby} = this.data
    const time = this.data.selected
    // if(index==0){
    //   time='all'
    // }else if(index==1){
    //   time='month'
    //   date=month
    // }else if(index==2){
    //   time = 'day'
    //   date=this.data.date
    // }
    if(tab_select=='seller'){
      res= await util.request('index/statStore',{
        start,
        end,
        keyword,
        time,
        sortby
      })
    }else{
      res= await util.request('index/statSub',{
        start,
        end,
        keyword,
        time,
        sortby,
        role:tab_select
      })
    }
    this.setData({
      list:res.data
    })
  },
  bindPickerChange(e){
    this.setData({
      index:e.detail.value
    })
    this.getData()
  },
  bindMonthChange(e){
    this.setData({
      month:e.detail.value
    })
    this.getData()
  },
  bindDateChange(e){
    this.setData({
      date:e.detail.value
    })
    this.getData()
  },
  tabSelect(e){
    const tab_select = e.currentTarget.dataset.type
    let placeholder = ''
    switch(tab_select){
      case 'seller':
        placeholder='请输入门店名称'
        break;
      case 'employee':
        placeholder='请输入地推名称'
        break;
      case 'agency':
        placeholder='请输入代理名称'
        break;
    }
    this.setData({
      tab_select,
      placeholder,
      keyword:'',
      index:0,
      type:'all'
    })
    this.getData()
  },
  tabType(e){
    this.setData({
      type:e.currentTarget.dataset.type
    })
    this.getData()
  },
  copy(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.name,
    })
  },
  handleKeyword(e){
    console.log(e);
    this.setData({
      keyword:e.detail.value
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      this.getData()
    }, 500)
  }
});