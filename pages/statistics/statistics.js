const app = getApp()
const util = require('../../utils/util')
let timer = null
Page({
  data: {
    array:['全部','月度','日度'],
    index:0,
    date:'',
    month:'',
    tab_select:'seller',
    placeholder:'请输入门店名称',
    type:'all',
    list:[],
    keyword:'',
    info:'',
    device_types:[]
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
  async getData(){
    let res = null,time=null,date=''
    const {keyword,tab_select,index,month,type} = this.data
    if(index==0){
      time='all'
    }else if(index==1){
      time='month'
      date=month
    }else if(index==2){
      time = 'day'
      date=this.data.date
    }
    if(tab_select=='seller'){
      res= await util.request('index/statSeller',{
        keyword,
        time,
        date,
        type
      })
    }else{
      res= await util.request('index/statBranch',{
        keyword,
        time,
        date,
        type,
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