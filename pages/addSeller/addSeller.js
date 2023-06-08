// pages/addSeller/addSeller.js
import cityData from '../../utils/city.js';
const app = getApp()
const util = require('../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pickerRegionIndex: ['广东省', '深圳市', '宝安区'],
    multiArray: [
      ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
      ['中式餐饮', '西式餐饮', '简餐轻餐', '其他']
    ],
    industry_id: 0,
    multiIndex: [0, 0],
    start_time: '09:00',
    end_time: '22:00',
    showPopup: false,
    switchTypeBattery: true,
    switchTypeLine: false,
    switchTypePile: false,
    switchType: '',
    selectLineTime: '3',
    name: '',
    address: '',
    store_brokerage: '',
    store_rate: '',
    brokerage_show: '',
    cost_amount: '',
    tel: '',
    province_code: '440000',
    city_code: '440300',
    district_code: '440306',
    latitude: '',
    longitude: '',
    area: '广东省深圳市宝安区',
    introducer_data: [],
    introducer_select: {},
    seller_select: {},
    bd_select: {
      bd_id: 0,
      bd_name:''
    },
    introducer: [],
    industryList: [],
    divide: '',
    depreciation: '',
    picture: '',
    picture_url: '',
    logo: '',
    logo_url:'',
    status: 1,
    is_adjust: 1,
    battery_amount: {},
    wired_amount: {},
    isShowPlaceholderBattery: true,
    isShowPlaceholderLine: true,
    isShowPlaceholderPile: true,
    showPopupType: '',
    device_types: {
      powerbank: true,
      wired: false,
      pile: false
    },
    seller_id: '',
    cost_pile: '',
    card_enable: 0,
    getBalance: {},
    getTemporary: {},
    getMonth: {},
    pile_amount: {
      getBalance: {},
      getTemporary: {},
      getMonth: {}
    },
    login_info_devices: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      login_info_devices: app.globalData.info.device_types
    })
    if (options.id) {
      this.setData({
        seller_id: options.id
      })
      wx.setNavigationBarTitle({
        title: '修改门店',
      })
    }
    this.getIndustryList()
    this.getBilling()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (app.globalData.introducer) {
      console.log(app.globalData.introducer);
      const introducer_select = app.globalData.introducer
      this.setData({
        introducer_select
      })
      app.globalData.introducer = ''
    }
    if (app.globalData.seller) {
      console.log(app.globalData.seller);
      const seller_select = app.globalData.seller
      this.setData({
        seller_select
      })
      console.log(this.data.seller_select);
      app.globalData.seller = ''
    }
    if (app.globalData.bd) {
      console.log(app.globalData.bd);
      const bd_select = app.globalData.bd
      this.setData({
        bd_select
      })
      console.log(this.data.bd_select);
      app.globalData.bd = ''
    }
    if (app.globalData.pileBalance) {
      console.log(app.globalData.pileBalance);
      this.setData({
        getBalance: app.globalData.pileBalance
      })
      app.globalData.pileBalance = ''
    }
    if (app.globalData.pileTemporary) {
      console.log(app.globalData.pileTemporary);
      this.setData({
        getTemporary: app.globalData.pileTemporary
      })
      app.globalData.pileTemporary = ''
    }
    if (app.globalData.pileMonth) {
      console.log(app.globalData.pileMonth);
      this.setData({
        getMonth: app.globalData.pileMonth
      })
      app.globalData.pileMonth = ''
    }
    console.log(this.data.battery_amount)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  async getBilling() {
    const res = await util.request('store/init')
    console.log(res);
    if (this.data.showPopup) {
      if (this.data.showPopupType == 'battery') {
        this.setData({
          battery_amount: res.data.powerbank_billing,
          showPopup: false,
          isShowPlaceholderBattery: true
        })
      } else if (this.data.showPopupType == 'line') {
        this.setData({
          wired_amount: res.data.wired_amount,
          showPopup: false,
          isShowPlaceholderLine: true
        })
      } else {
        this.setData({
          showPopup: false,
          isShowPlaceholderLine: true
        })
      }
    } else {
      this.setData({
        battery_amount: res.data.powerbank_billing,
        wired_amount: res.data.wired_amount
      })
    }
    // 修改门店信息获取
    if (this.data.seller_id) {
      this.getInfo()
    }
  },
  async getIndustryList() {
    const res = await util.request('store/getIndustry')
    this.setData({
      industryList: res.data
    })
  },
  async getInfo() {
    const res = await util.request('store/detail', {
      id: this.data.seller_id
    })
    const {
      name,
      address,
      store_brokerage,
      bd_brokerage,
      store_rate,
      brokerage_show,
      cost_amount,
      tel,
      shop_start,
      shop_end,
      picture,
      logo,
      status,
      is_adjust,
      device_types,
      wired_amount,
      pile_amount,
      introducer_data,
      manager_id,
      manager_name,
      bd_id,
      bd_name,
      latitude,
      longitude,
      area,
      province_code,
      city_code,
      district_code,
      industry_id
    } = res.data
    const battery_amount = res.data.billing_set.powerbank
    const reg = /.+?(省|市|自治区|自治州|县|区|街道)/g;
    let region = area.match(reg)
    let pickerRegionIndex = []
    console.log(1);
    console.log(region);
    if (region) {
      console.log(region.length);
      if (region.length < 3) {
        region.unshift(region[0])
      }
      pickerRegionIndex = [region[0], region[1], region[2]]
    }
    const seller_select = {
      name: manager_name,
      user_id: manager_id
    }
    const bd_select = {
      bd_name: bd_name,
      bd_id: bd_id
    }
    console.log(this.data.bd_select);
    const {
      powerbank,
      wired,
      pile
    } = device_types
    console.log(powerbank);
    let isShowPlaceholderBattery = true,
      isShowPlaceholderLine = true,
      isShowPlaceholderPile = true
    if (powerbank) {
      isShowPlaceholderBattery = false
    } else {
      isShowPlaceholderBattery = true
    }
    if (wired) {
      isShowPlaceholderLine = false
    } else {
      isShowPlaceholderLine = true
    }
    if (pile) {
      isShowPlaceholderPile = false
    } else {
      isShowPlaceholderPile = true
    }
    let cost= {}
    let card_enable=0
    let balance_data={}
    let temporary_data={}
    let package_data={}
    if(pile_amount){
      const {
        balance_enable,
        temporary_enable,
        package_enable
      } = pile_amount
      cost=pile_amount.cost
      card_enable=pile_amount.card_enable
      balance_data=pile_amount.balance_data
      if (balance_data) {
        if (balance_enable) {
          console.log(1);
          console.log(balance_enable);
          balance_data.balance_enable = balance_enable
          console.log(2);
        } else {
          console.log(3);
          balance_data.balance_enable = '0'
        }
      }
      if (temporary_data) {
        if (temporary_enable) {
          temporary_data.temporary_enable = temporary_enable
        } else {
          temporary_data.temporary_enable = '0'
        }
      }
      if (package_data) {
        if (package_enable) {
          package_data.package_enable = package_enable
        } else {
          package_data.package_enable = '0'
        }
      }
    }

    const cost_pile = cost
    console.log('11111')
    this.setData({
      name,
      address,
      store_brokerage,
      bd_brokerage,
      store_rate,
      brokerage_show,
      cost_amount,
      tel,
      start_time: shop_start,
      end_time: shop_end,
      picture_url: picture,
      logo_url:logo,
      status,
      is_adjust,
      device_types: device_types,
      switchTypeBattery: powerbank,
      switchTypeLine: wired,
      switchTypePile: pile,
      battery_amount,
      pile_amount,
      getBalance: balance_data,
      getTemporary: temporary_data,
      getMonth: package_data,
      cost_pile,
      card_enable,
      isShowPlaceholderBattery,
      isShowPlaceholderLine,
      isShowPlaceholderPile,
      wired_amount,
      introducer: introducer_data,
      seller_select,
      bd_select,
      latitude,
      longitude,
      area,
      pickerRegionIndex,
      province_code,
      city_code,
      district_code,
      industry_id
    })
    console.log(this.data.bd_select)
    this.industry(industry_id)
  },
  industry(num) {
    switch (true) {
      case num == 6:
        this.setData({
          multiIndex: [0, 0]
        })
        break;
      case num == 5:
        this.setData({
          multiIndex: [0, 1]
        })
        break;
      case num == 4:
        this.setData({
          multiIndex: [0, 2]
        })
        break;
      case num == 7:
        this.setData({
          multiIndex: [0, 3]
        })
        break;
      case num == 8:
        this.setData({
          multiIndex: [1, 0],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['KTV', '酒吧夜店', '休闲会所', '酒店', '旅游景点', '其他']
          ],
        })
        break;
      case num == 9:
        this.setData({
          multiIndex: [1, 1],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['KTV', '酒吧夜店', '休闲会所', '酒店', '旅游景点', '其他']
          ],
        })
        break;
      case num == 10:
        this.setData({
          multiIndex: [1, 2],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['KTV', '酒吧夜店', '休闲会所', '酒店', '旅游景点', '其他']
          ],
        })
        break;
      case num == 11:
        this.setData({
          multiIndex: [1, 3],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['KTV', '酒吧夜店', '休闲会所', '酒店', '旅游景点', '其他']
          ],
        })
        break;
      case num == 12:
        this.setData({
          multiIndex: [1, 4],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['KTV', '酒吧夜店', '休闲会所', '酒店', '旅游景点', '其他']
          ],
        })
        break;
      case num == 13:
        this.setData({
          multiIndex: [1, 5],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['KTV', '酒吧夜店', '休闲会所', '酒店', '旅游景点', '其他']
          ],
        })
        break;
      case num == 14:
        this.setData({
          multiIndex: [2, 0],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['医院社康', '教育培训', '生活门店', '学校', '行政机构', '机场车站', '其他']
          ],
        })
        break;
      case num == 15:
        this.setData({
          multiIndex: [2, 1],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['医院社康', '教育培训', '生活门店', '学校', '行政机构', '机场车站', '其他']
          ],
        })
        break;
      case num == 17:
        this.setData({
          multiIndex: [2, 2],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['医院社康', '教育培训', '生活门店', '学校', '行政机构', '机场车站', '其他']
          ],
        })
        break;
      case num == 18:
        this.setData({
          multiIndex: [2, 3],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['医院社康', '教育培训', '生活门店', '学校', '行政机构', '机场车站', '其他']
          ],
        })
        break;
      case num == 16:
        this.setData({
          multiIndex: [2, 4],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['医院社康', '教育培训', '生活门店', '学校', '行政机构', '机场车站', '其他']
          ],
        })
        break;
      case num == 20:
        this.setData({
          multiIndex: [2, 5],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['医院社康', '教育培训', '生活门店', '学校', '行政机构', '机场车站', '其他']
          ],
        })
        break;
      case num == 21:
        this.setData({
          multiIndex: [2, 6],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['医院社康', '教育培训', '生活门店', '学校', '行政机构', '机场车站', '其他']
          ],
        })
        break;
      case num == 23:
        this.setData({
          multiIndex: [3, 0],
          multiArray: [
            ['餐饮美食', '娱乐休闲', '生活服务', '车载充电'],
            ['车载充电']
          ],
        })
        break;
    }
  },
  handleName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  handleAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },
  handleBrokerage(e) {
    this.setData({
      store_brokerage: e.detail.value
    })
  },

  handleBrokerage_bd(e) {
    this.setData({
      bd_brokerage: e.detail.value
    })
  },
  handleBrokerageRate(e) {
    this.setData({
      store_rate: e.detail.value
    })
  },
  handleBrokerageShow(e) {
    this.setData({
      brokerage_show: e.detail.value
    })
  },
  handleCostAmount(e) {
    this.setData({
      cost_amount: e.detail.value
    })
  },
  handleTel(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  changeLoca() {
    let that = this
    wx.chooseLocation({
      success(res) {
        console.log(res);
        let reg = /.+?(省|市|自治区|自治州|县|区)/g;
        let region = res.address.match(reg)
        console.log(region);
        if (region.length) {
          if (region.length < 3) {
            region.unshift(region[0])
          }
        }

        that.handleCityCode(region)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          area: region[0] + region[1] + region[2],
          address: res.name,
          pickerIndustryIndex: region
        })
      }
    })
  },
  handleCityCode(arr) {
    let that = this
    let codeArr = []
    for (let item of cityData) {
      if (item.name == arr[0]) {
        codeArr.push(item.code)
        for (let items of item.cityList) {
          if (items.name == arr[1]) {
            codeArr.push(items.code)
            for (let itemss of items.areaList) {
              if (itemss.name == arr[2]) {
                codeArr.push(itemss.code)
                that.setData({
                  province_code: codeArr[0],
                  city_code: codeArr[1],
                  district_code: codeArr[2]
                })
              }
            }
          }
        }
      }
    }
  },
  bindPickerRegionChange(e) {
    this.setData({
      pickerRegionIndex: e.detail.value,
      area: e.detail.value[0] + e.detail.value[1] + e.detail.value[2],
      province_code: e.detail.code[0],
      city_code: e.detail.code[1],
      district_code: e.detail.code[2]
    })
  },
  bindStartTimeChange(e) {
    this.setData({
      start_time: e.detail.value
    })
  },
  bindEndTimeChange(e) {
    this.setData({
      end_time: e.detail.value
    })
  },
  showPopupType(e) {
    console.log(e);
    wx.pageScrollTo({
      scrollTop: e.currentTarget.offsetTop - 100,
      duration: 300
    })
    this.setData({
      showPopup: true,
      showPopupType: e.currentTarget.dataset.type
    })
    if (e.currentTarget.dataset.type == 'introducer') {
      this.setData({
        introducer_select: {}
      })
    }
  },
  closePopup() {
    console.log(1);
    this.getBilling()

  },
  isShowInputBattery(e) {
    let device_types = this.data.device_types
    device_types.powerbank = e.detail.value
    this.setData({
      switchTypeBattery: e.detail.value,
      device_types
    })
    console.log(this.data.device_types)
  },
  isShowInputLine(e) {
    let device_types = this.data.device_types
    device_types.wired = e.detail.value
    this.setData({
      switchTypeLine: e.detail.value,
      device_types
    })
  },
  isShowInputPile(e) {
    let device_types = this.data.device_types
    device_types.pile = e.detail.value
    this.setData({
      switchTypePile: e.detail.value,
      device_types
    })
  },
  isShowInput(e) {
    if (e.detail.value) {
      this.setData({
        switchType: e.currentTarget.dataset.type
      })
    } else {
      this.setData({
        switchType: ''
      })
    }
  },
  selectLineTime(e) {
    this.setData({
      selectLineTime: e.currentTarget.dataset.time
    })
  },
  handleLineAmount(e) {
    console.log(e.detail.value);
    console.log(e.currentTarget.dataset.time);
    const wired_amount = this.data.wired_amount
    wired_amount[e.currentTarget.dataset.index].amount = e.detail.value
    this.setData({
      wired_amount
    })
  },
  touchMove() {
    return
  },
  toSelectIntroducer() {
    wx.navigateTo({
      url: '/pages/selectIntroducer/selectIntroducer',
    })
  },
  toSelectManager() {
    wx.navigateTo({
      url: '/pages/selectSeller/selectSeller',
    })
  },
  toSelectBd() {
    wx.navigateTo({
      url: '/pages/selectBD/selectBD',
    })
  },
  handleIntroducerDivide(e) {
    this.setData({
      divide: e.detail.value
    })
  },
  handleIntroducerDepreciation(e) {
    this.setData({
      depreciation: e.detail.value
    })
  },
  introducerSub() {
    let obj = {}
    obj.name = this.data.introducer_select.name
    obj.id = this.data.introducer_select.user_id
    obj.rate = this.data.divide
    obj.brokerage = this.data.depreciation
    const introducer = this.data.introducer
    let isHave = false
    introducer.forEach(item => {
      if (item.id == obj.id) {
        isHave = true
      }
    })
    if (isHave) {
      wx.showToast({
        title: '该中间人已添加',
        icon: 'error'
      })
    } else {
      introducer.push(obj)
    }
    this.setData({
      introducer,
      showPopup: false
    })
    console.log(this.data.introducer)
  },
  uploadImage() {
    wx.chooseImage({
      count: 1,
      success: async (res) => {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0]);
        let img = await util.uploadImage(tempFilePaths[0])
        img = JSON.parse(img.data)
        console.log(res)
        if (img.code == 200) {
          this.setData({
            picture: img.data.id,
            picture_url: img.data.url
          })
        }
      }
    })
  },
  uploadLogo() {
    wx.chooseImage({
      count: 1,
      success: async (res) => {
        const tempLogoPaths = res.tempFilePaths
        console.log(tempLogoPaths[0]);
        let img = await util.uploadImage(tempLogoPaths[0])
        img = JSON.parse(img.data)
        console.log(res)
        if (img.code == 200) {
          this.setData({
            logo: img.data.id,
            logo_url: img.data.url
          })
        }
      }
    })
  },
  switchStatus(e) {
    console.log(e.detail.value);
    if (e.detail.value) {
      this.setData({
        status: 2
      })
    } else {
      this.setData({
        status: 1
      })
    }
  },
  switchIsAdjust(e) {
    console.log(e.detail.value);
    if (e.detail.value) {
      this.setData({
        is_adjust: 1
      })
    } else {
      this.setData({
        is_adjust: 0
      })
    }
  },
  delIntroducer(e) {
    console.log(e.currentTarget.dataset.index);
    let introducer = this.data.introducer
    introducer.splice(0, 1)
    this.setData({
      introducer
    })
  },
  clearSellerSelect() {
    this.setData({
      seller_select: {}
    })
  },

  clearbdSelect() {
    this.setData({
      bd_select: {}
    })
  },
  bindPickerIndustryChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let arr = e.detail.value
    console.log(arr);
    switch (true) {
      case arr[0] == 0:
        switch (arr[1]) {
          case 0:
            this.setData({
              industry_id: 6
            })
            break;
          case 1:
            this.setData({
              industry_id: 5
            })
            break;
          case 2:
            this.setData({
              industry_id: 4
            })
            break;
          case 3:
            this.setData({
              industry_id: 7
            })
            break;
        }
        break;
      case arr[0] == 1:
        switch (arr[1]) {
          case 0:
            this.setData({
              industry_id: 8
            })
            break;
          case 1:
            this.setData({
              industry_id: 9
            })
            break;
          case 2:
            this.setData({
              industry_id: 10
            })
            break;
          case 3:
            this.setData({
              industry_id: 11
            })
            break;
          case 4:
            this.setData({
              industry_id: 12
            })
            break;
          case 5:
            this.setData({
              industry_id: 13
            })
            break;
        }
        break;
      case arr[0] == 2:
        switch (arr[1]) {
          case 0:
            this.setData({
              industry_id: 14
            })
            break;
          case 1:
            this.setData({
              industry_id: 15
            })
            break;
          case 2:
            this.setData({
              industry_id: 17
            })
            break;
          case 3:
            this.setData({
              industry_id: 18
            })
            break;
          case 4:
            this.setData({
              industry_id: 16
            })
            break;
          case 5:
            this.setData({
              industry_id: 20
            })
            break;
          case 6:
            this.setData({
              industry_id: 21
            })
            break;
        }
        break;
      case arr[0] == 3:
        console.log(arr[1]);
        switch (arr[1]) {
          case 0:
            this.setData({
              industry_id: 23
            })
            break;
        }
        break;
    }
    console.log(this.data.industry_id);
  },
  bindMultiPickerColumnChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['中式餐饮', '西式餐饮', '简餐轻餐', '其他'];
            break;
          case 1:
            data.multiArray[1] = ['KTV', '酒吧夜店', '休闲会所', '酒店', '旅游景点', '其他'];
            break;
          case 2:
            data.multiArray[1] = ['医院社康', '教育培训', '生活门店', '学校', '行政机构', '机场车站', '其他'];
            break;
          case 3:
            data.multiArray[1] = ['车载充电'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        break;
    }
    // console.log(data.multiIndex);
    this.setData(data);
  },
  selectBatteryBillingUnit(e) {
    console.log(e);
    let battery_amount = this.data.battery_amount
    battery_amount.unit = e.detail.value
    this.setData({
      battery_amount
    })
  },
  batteryBillingTime(e) {
    let battery_amount = this.data.battery_amount
    battery_amount.billingtime = e.detail.value
    this.setData({
      battery_amount
    })
  },
  batteryAmount(e) {
    let battery_amount = this.data.battery_amount
    battery_amount.amount = e.detail.value
    this.setData({
      battery_amount
    })
  },
  batteryFreetime(e) {
    let battery_amount = this.data.battery_amount
    battery_amount.freetime = e.detail.value
    this.setData({
      battery_amount
    })
  },
  batteryCeiling(e) {
    let battery_amount = this.data.battery_amount
    battery_amount.ceiling = e.detail.value
    this.setData({
      battery_amount
    })
  },
  confirmBattery() {
    this.setData({
      showPopup: false,
      isShowPlaceholderBattery: false
    })
  },
  confirmLine() {
    this.setData({
      showPopup: false,
      isShowPlaceholderLine: false
    })
  },
  confirmPile() {
    const {
      getBalance,
      getTemporary,
      getMonth,
      cost_pile,
      card_enable
    } = this.data
    const {
      balance_enable
    } = getBalance
    const {
      temporary_enable
    } = getTemporary
    const {
      package_enable
    } = getMonth
    if (balance_enable == 1 || temporary_enable == 1) {
      const pile_amount = {
        balance_enable,
        temporary_enable,
        package_enable,
        balance_data: getBalance,
        temporary_data: getTemporary,
        package_data: getMonth,
        cost: cost_pile,
        card_enable
      }
      console.log(pile_amount);
      this.setData({
        showPopup: false,
        isShowPlaceholderPile: false,
        pile_amount
      })
    } else {
      wx.showModal({
        title: '单次和临时必须启用一个'
      })
    }

  },
  async sub() {
    // const {
    //   pile_amount
    // } = this.data
    // const {
    //   getBalance,
    //   getTemporary,
    //   getMonth
    // } = pile_amount
    // getBalance.balance_enable = undefined
    // getTemporary.temporary_enable = undefined
    // getMonth.package_enable = undefined
    let billing_set = {
      wired_amount: this.data.wired_amount,
      powerbank: this.data.battery_amount,
      // pile_amount
    }
    const manager_id = this.data.seller_select.user_id
    const bd_id = this.data.bd_select.bd_id
    console.log(billing_set);
    const {
      name,
      industry_id,
      province_code,
      city_code,
      district_code,
      address,
      area,
      latitude,
      longitude,
      store_brokerage,
      bd_brokerage,
      store_rate,
      brokerage_show,
      cost_amount,
      status,
      picture,
      logo,
      tel,
      is_adjust
    } = this.data
    if (this.data.seller_id) {
      const res = await util.request('store/edit', {
        id: this.data.seller_id,
        name,
        industry_id,
        province_code,
        city_code,
        district_code,
        address,
        area,
        latitude,
        longitude,
        store_brokerage,
        bd_brokerage,
        store_rate,
        brokerage_show,
        cost_amount,
        status,
        picture,
        logo,
        tel,
        is_adjust,
        manager_id,
        bd_id,
        shop_end: this.data.end_time,
        shop_start: this.data.start_time,
        billing_set: JSON.stringify(billing_set),
        introducer_data: JSON.stringify(this.data.introducer),
        device_types: JSON.stringify(this.data.device_types)
      })
      console.log(res);
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      }
    } else {
      const res = await util.request('store/add', {
        name,
        industry_id,
        province_code,
        city_code,
        district_code,
        address,
        area,
        latitude,
        longitude,
        store_brokerage,
        bd_brokerage,
        store_rate,
        brokerage_show,
        cost_amount,
        status,
        picture,
        logo,
        tel,
        is_adjust,
        manager_id,
        bd_id,
        shop_end: this.data.end_time,
        shop_start: this.data.start_time,
        billing_set: JSON.stringify(billing_set),
        introducer_data: JSON.stringify(this.data.introducer),
        device_types: JSON.stringify(this.data.device_types),
      })
      console.log(res);
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }, 1000);
      }
    }
  },
  costPile(e) {
    this.setData({
      cost_pile: e.detail.value
    })
  },
  toPileB() {
    wx.navigateTo({
      url: `/pages/pileSet/pileSet?type=balance&pile=1&info=${JSON.stringify(this.data.getBalance)}`,
    })
  },
  toPileT() {
    wx.navigateTo({
      url: `/pages/pileSet/pileSet?type=temporary&pile=2&info=${JSON.stringify(this.data.getTemporary)}`,
    })
  },
  toPileMonth() {
    wx.navigateTo({
      url: `/pages/pileMonth/pileMonth?info=${JSON.stringify(this.data.getMonth)}`,
    })
  },
  changeCardEnable(e) {
    let card_enable = 1
    if (e.detail.value) {
      card_enable = 1
    } else {
      card_enable = 0
    }
    this.setData({
      card_enable
    })
  }
})