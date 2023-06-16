// pages/pileSet/pileSet.js
const util = require('../../utils/util.js')
const app = getApp()
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: [{
      time: 1,
      select: false
    }, {
      time: 2,
      select: false
    }, {
      time: 3,
      select: false
    }, {
      time: 4,
      select: false
    }, {
      time: 5,
      select: false
    }, {
      time: 6,
      select: false
    }, {
      time: 7,
      select: false
    }, {
      time: 8,
      select: false
    }, {
      time: 9,
      select: false
    }, {
      time: 10,
      select: false
    }, {
      time: 11,
      select: false
    }, {
      time: 12,
      select: false
    }],
    saveTemplate: false,
    selectTemplate: false,
    type: '',
    intelligent_enable: '0',
    intelligent_time: 12,
    time_num: 0,
    bill_set: 3,
    table_item_simple: [{
      power_start: '0',
      power_end: '220',
      amount: '0.66',
      sale_price: '3'
    }, {
      power_start: '221',
      power_end: '320',
      amount: '0.96',
      sale_price: '3'
    }, {
      power_start: '321',
      power_end: '500',
      amount: '1.50',
      sale_price: '3'
    }, {
      power_start: '501',
      power_end: '1000',
      amount: '3.00',
      sale_price: '3'
    }, {
      power_start: '1001',
      power_end: '2000',
      amount: '6.00',
      sale_price: '3'
    }, {
      power_start: '2001',
      power_end: '3000',
      amount: '9.09',
      sale_price: '3'
    }],
    table_item_detailed: [{
      power_start: '0',
      power_end: '120',
      amount: '0.36',
      sale_price: '3'
    }, {
      power_start: '121',
      power_end: '150',
      amount: '0.45',
      sale_price: '3'
    }, {
      power_start: '151',
      power_end: '180',
      amount: '0.54',
      sale_price: '3'
    }, {
      power_start: '181',
      power_end: '220',
      amount: '0.66',
      sale_price: '3'
    }, {
      power_start: '221',
      power_end: '300',
      amount: '0.90',
      sale_price: '3'
    }, {
      power_start: '301',
      power_end: '400',
      amount: '1.20',
      sale_price: '3'
    }, {
      power_start: '401',
      power_end: '500',
      amount: '1.5',
      sale_price: '3'
    }, {
      power_start: '501',
      power_end: '600',
      amount: '1.80',
      sale_price: '3'
    }, {
      power_start: '601',
      power_end: '800',
      amount: '2.40',
      sale_price: '3'
    }, {
      power_start: '801',
      power_end: '1000',
      amount: '3.00',
      sale_price: '3'
    }, {
      power_start: '1001',
      power_end: '1200',
      amount: '3.61',
      sale_price: '3'
    }, {
      power_start: '1201',
      power_end: '2000',
      amount: '6.00',
      sale_price: '3'
    }, {
      power_start: '2001',
      power_end: '3000',
      amount: '9.09',
      sale_price: '3'
    }],
    table_item_custom: [{
      power_start: '0',
      power_end: '100',
      amount: '',
      sale_price: ''
    }],
    table_item: [],
    template: 'simple',
    name: '',
    id: '',
    recharge: [1, 2, 3, 4, 5, 6],
    isAdd: '',
    balance_enable: 0,
    temporary_enable: 0,
    pile: '',
    is_save: false,
    templateList: [],
    templateId: '',
    templateName: '',
    templateText: '自定义'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      type: options.type,
      isAdd: options.isAdd,
      table_item: this.data.table_item_simple,
      id: options.id || ''
    })
    if (options.id) {
      this.getInfo()
    }
    if (options.pile) {
      this.setData({
        pile: options.pile
      })
    }
    if (this.data.type == 'balance') {
      wx.setNavigationBarTitle({
        title: '单次充电'
      })
      if (!options.info) {
        return
      }
      if (JSON.parse(options.info).times) {
        const {
          balance_enable,
          bill_set,
          bill_type,
          intelligent_enable,
          intelligent_time,
          shortcut_amount,
          times
        } = JSON.parse(options.info)
        const option = this.data.options
        let template = ''
        if (bill_type == 1) {
          template = 'simple'
        } else if (bill_type == 2) {
          template = 'detailed'
        } else if (bill_type == 3) {
          template = 'custom'
        }
        option.forEach(item => {
          if (times.indexOf(item.time) != -1) {
            item.select = true
          }
        })
        this.setData({
          balance_enable,
          table_item: bill_set,
          template,
          intelligent_enable,
          intelligent_time,
          bill_set: shortcut_amount,
          options: option
        })
      }
    } else if (this.data.type == 'temporary') {
      wx.setNavigationBarTitle({
        title: '临时充电'
      })
      if (!options.info) {
        return
      }
      if (JSON.parse(options.info).recharge) {
        const {
          bill_set,
          bill_type,
          recharge,
          shortcut_amount,
          temporary_enable
        } = JSON.parse(options.info)
        let template = ''
        if (bill_type == 1) {
          template = 'simple'
        } else if (bill_type == 2) {
          template = 'detailed'
        } else if (bill_type == 3) {
          template = 'custom'
        }
        this.setData({
          temporary_enable,
          recharge,
          template,
          bill_set: shortcut_amount,
          table_item: bill_set
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  async getInfo() {
    console.log(1);
    const {
      id,
      type,
      options
    } = this.data
    const res = await util.request('PileDevice/templateDetail', {
      id,
      type
    })
    if (type == 'balance') {
      const {
        times,
        intelligent_enable,
        intelligent_time,
        shortcut_amount,
        bill_type,
        bill_set
      } = res.data
      options.forEach(item=>{
        item.select = false
      })
      let time_num= 0
      options.forEach(item => {
        if (times.indexOf(item.time) != -1) {
          item.select = true
          time_num+=1
        }
      })
      let template = 'simple'
      switch (bill_type) {
        case 1:
          template = 'simple'
          break;
        case 2:
          template = 'detailed'
          break;
        case 3:
          template = 'custom'
          break;
      }
      this.setData({
        options,
        intelligent_enable,
        intelligent_time,
        bill_set: shortcut_amount,
        template,
        table_item: bill_set,
        time_num
      })
      this.setSync()
    } else {
      let template = 'simple'
      const {
        bill_set,
        bill_type,
        recharge,
        shortcut_amount
      } = res.data
      switch (bill_type) {
        case 1:
          template = 'simple'
          break;
        case 2:
          template = 'detailed'
          break;
        case 3:
          template = 'custom'
          break;
      }
      this.setData({
        recharge,
        bill_set: shortcut_amount,
        template,
        table_item: bill_set
      })
      this.setSync()
    }

  },
  openSaveTemplate() {
    this.setData({
      saveTemplate: true
    })
  },
  openSaveTemplate1() {
    this.setData({
      saveTemplate: true,
      is_save: true
    })
  },
  async openSelectTemplate() {
    const {
      type
    } = this.data
    const res = await util.request('PileDevice/templateList', {
      type
    })
    this.setData({
      templateList: res.data,
      selectTemplate: true
    })
  },
  cancelSaveTemplate() {
    this.setData({
      saveTemplate: false
    })
  },
  cancelSelectTemplate() {
    this.setData({
      templateId: '',
      templateName: '',
      selectTemplate: false
    })
  },
  stop() {

  },
  intelligent(e) {
    console.log(e);
    const val = e.detail.value
    if (val) {
      this.setData({
        intelligent_enable: 1
      })
    } else {
      this.setData({
        intelligent_enable: 0
      })
    }
  },
  intelligentTime(e) {
    if (e.detail.value > 24) {
      wx.showToast({
        title: '最大24小时',
        icon: 'error'
      })
      this.setData({
        intelligent_time: 24
      })
    } else {
      this.setData({
        intelligent_time: e.detail.value
      })
    }
  },
  optionsSelect(e) {
    const {
      index
    } = e.currentTarget.dataset
    const {
      options
    } = this.data
    if (this.data.time_num >= 6&&!options[index].select) {
      wx.showToast({
        title: '最多选择6个',
        icon: 'none'
      })
      return
    }
    let time_num = 0
    options[index].select = !options[index].select
    console.log(options);
    options.forEach(item => {
      if (item.select) {
        time_num += 1
      }
    })
    this.setData({
      options,
      time_num
    })
  },
  
  billSet(e) {
    clearTimeout(timer)
    if (!e.detail.value) {
      this.setData({
        bill_set: ''
      })
      return
    }
    timer = setTimeout(() => {
      wx.showModal({
        title: '提示',
        content: '功率区间价格将会变动',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
            this.setData({
              bill_set: e.detail.value
            })
            this.newAmount(this.data.table_item, e.detail.value)
          } else if (res.cancel) {
            console.log('用户点击取消')
            this.setData({
              bill_set: this.data.bill_set
            })
          }
        }
      })
    }, 500)
  },
  newAmount(val, amount) {
    const {
      bill_set
    } = this.data
    val.forEach(item => {
      const num = 1000 / (item.power_end)
      if (bill_set) {
        item.amount = (bill_set / (num.toFixed(2))).toFixed(2)
      } else {
        item.amount = ''
      }

      item.sale_price = amount
    })
    this.setData({
      table_item: val
    })
    this.setSync()
  },
  setSync() {
    if (this.data.template == 'simple') {
      this.setData({
        table_item_simple: this.data.table_item
      })
    } else if (this.data.template == 'detailed') {
      this.setData({
        table_item_detailed: this.data.table_item
      })
    } else if (this.data.template == 'custom') {
      this.setData({
        table_item_custom: this.data.table_item
      })
    }
  },
  template(e) {
    wx.showModal({
      title: '提示',
      content: '已修改功率区间将不会保存',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            template: e.currentTarget.dataset.type
          })
          let table_item = this.data.table_item
          if (this.data.template == 'simple') {
            table_item = this.data.table_item_simple
          } else if (this.data.template == 'detailed') {
            table_item = this.data.table_item_detailed
          } else if (this.data.template == 'custom') {
            table_item = this.data.table_item_custom
          }
          this.setData({
            table_item
          })
          this.newAmount(this.data.table_item, this.data.bill_set)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  amountSet(e) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const table_item = this.data.table_item
      table_item[e.currentTarget.dataset.index].amount = e.detail.value
      table_item[e.currentTarget.dataset.index].sale_price = (1000 / (table_item[e.currentTarget.dataset.index].power_end) * e.detail.value).toFixed(2)
      this.setData({
        table_item
      })
      this.setSync()
    }, 500)
  },
  priceSet(e) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const table_item = this.data.table_item
      table_item[e.currentTarget.dataset.index].sale_price = e.detail.value
      table_item[e.currentTarget.dataset.index].amount = ((e.detail.value) / (1000 / (table_item[e.currentTarget.dataset.index].power_end))).toFixed(2)
      this.setData({
        table_item
      })
      this.setSync()
    }, 500)
  },
  powerSet(e) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      let index = e.currentTarget.dataset.index
      const table_item = this.data.table_item
      if ((index + 1) < table_item.length) {
        wx.showToast({
          title: '不可修改当前项',
          icon: 'error'
        })
      } else {
        table_item[index].power_end = e.detail.value
        const sale_price = table_item[index].sale_price
        if (sale_price) {
          table_item[index].amount = ((sale_price) / (1000 / (e.detail.value))).toFixed(2)
        } else {
          table_item[index].amount = ''
        }

      }
      this.setData({
        table_item
      })
      this.setSync()
    }, 500)
  },
  addSection() {
    const table_item = this.data.table_item
    console.log(table_item[table_item.length - 1].amount);
    console.log(table_item[table_item.length - 1].sale_price);
    if (!table_item[table_item.length - 1].amount || !table_item[table_item.length - 1].sale_price) {
      wx.showToast({
        title: '请设置当前区间',
        icon: 'error'
      })
      return
    }
    const power_start = table_item[table_item.length - 1].power_end * 1 + 1
    const power_end = power_start + 49
    const sale_price = this.data.bill_set || ''
    let amount = ''
    if (sale_price) {
      amount = (sale_price / (1000 / power_end)).toFixed(2)
    } else {
      amount = ''
    }
    const obj = {
      power_start,
      power_end,
      amount,
      sale_price
    }
    table_item.push(obj)
    this.setData({
      table_item
    })
    this.setSync()
  },
  deleteSection() {
    let table_item = this.data.table_item
    if (table_item.length > 1) {
      table_item.pop()
      this.setData({
        table_item
      })
      this.setSync()
    } else {
      wx.showToast({
        title: '必须留一个区间',
        icon: 'none'
      })
    }
  },
  async saveTemplate() {
    const {
      name,
      type,
      options,
      intelligent_enable,
      intelligent_time,
      template,
      bill_set,
      table_item,
      id,
      recharge
    } = this.data
    let times = [],
      bill_type = 1,
      balance_data = {},
      temporary_data = {}

    options.forEach(item => {
      if (item.select) {
        times.push(item.time)
      }
    })
    console.log(times);
    if (template == 'simple') {
      bill_type = 1
    } else if (template == 'detailed') {
      bill_type = 2
    } else if (template == 'custom') {
      bill_type = 3
    }
    balance_data = {
      times,
      intelligent_enable,
      intelligent_time,
      bill_type,
      shortcut_amount: bill_set,
      bill_set: table_item
    }
    temporary_data = {
      recharge,
      bill_type,
      shortcut_amount: bill_set,
      bill_set: table_item
    }
    if (type == 'balance') {
      temporary_data = {}
    } else if (type == 'temporary') {
      balance_data = {}
    }
    let res = null
    if (id&&!this.data.is_save) {
      res = await util.request('PileDevice/templateEdit', {
        id,
        name,
        type,
        balance_data: JSON.stringify(balance_data),
        temporary_data: JSON.stringify(temporary_data)
      })
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
          icon: 'success'
        })
        this.setData({
            saveTemplate: false
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 800)
      }
    } else {
      res = await util.request('PileDevice/templateAdd', {
        name,
        type,
        balance_data: JSON.stringify(balance_data),
        temporary_data: JSON.stringify(temporary_data)
      })
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
          icon: 'success'
        })
        if (!this.data.is_save) {
          setTimeout(() => {
            wx.navigateBack()
          }, 800)
        } else {
          this.setData({
            saveTemplate: false
          })
        }
      }
    }
  },
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  setMoney(e) {
    const recharge = this.data.recharge
    recharge[e.currentTarget.dataset.index] = e.detail.value * 1
    this.setData({
      recharge
    })
  },
  cancle() {
    wx.navigateBack()
  },
  changeBalance(e) {
    console.log(e);
    let balance_enable = 1
    if (e.detail.value) {
      balance_enable = 1
    } else {
      balance_enable = 0
    }
    this.setData({
      balance_enable
    })
  },
  changeTemporary(e) {
    let temporary_enable = 1
    if (e.detail.value) {
      temporary_enable = 1
    } else {
      temporary_enable = 0
    }
    this.setData({
      temporary_enable
    })
  },
  async backInfo() {
    const {
      balance_enable,
      temporary_enable,
      options,
      intelligent_enable,
      intelligent_time,
      template,
      type,
      table_item,
      bill_set,
      recharge
    } = this.data
    let times = [],
      bill_type = 1
    options.forEach(item => {
      if (item.select) {
        times.push(item.time)
      }
    })
    if (template == 'simple') {
      bill_type = 1
    } else if (template == 'detailed') {
      bill_type = 2
    } else if (template == 'custom') {
      bill_type = 3
    }
    const obj = {
      balance_enable,
      times,
      intelligent_enable,
      intelligent_time,
      bill_type,
      shortcut_amount: bill_set,
      bill_set: table_item
    }
    const objT = {
      temporary_enable,
      recharge,
      bill_type,
      shortcut_amount: bill_set,
      bill_set: table_item
    }
    if (this.data.pile == 1) {
      const res = await util.request('PileDevice/checkBill', {
        type,
        balance_data: JSON.stringify(obj)
      })
      if (res.code == 200) {
        app.globalData.pileBalance = obj
      }
    } else if (this.data.pile == 2) {
      const res = await util.request('PileDevice/checkBill', {
        type,
        temporary_data: JSON.stringify(objT)
      })
      if (res.code == 200) {
        app.globalData.pileTemporary = objT
      }
    }
    wx.navigateBack()
  },
  selectTemplate(e) {
    console.log(e);
    this.setData({
      templateId: e.currentTarget.dataset.id,
      templateName: e.currentTarget.dataset.name
    })
  },
  confirmTemplate() {
    this.setData({
      id: this.data.templateId
    })
    this.getInfo()
    this.setData({
      selectTemplate: false,
      templateText: this.data.templateName
    })
  }
})