// pages/dataBoard/dataBoard.js
import * as echarts from '../../ec-canvas/echarts.js';
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    devices:{},
    warnData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.echartsComponnet = this.selectComponent('#mychart-dom-bar');
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
    this.getDevices()
    this.getWarn()
    this.getOnlineTrend()
  },
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      Chart.setOption(this.getOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  getOption: function () {
    var option = {
      grid: {
        // 设置图表距离顶部,左侧，右侧和底部的高度
        top: '20px',
        left: '30px',
        right: '30px',
        bottom: '40px',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.data.onlineTrend.dates
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: this.data.onlineTrend.online,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#3D82FF'
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(61,130,255,.1)'
            },
            {
              offset: 1,
              color: 'rgba(255,255,255,.4)'
            }
          ])
        },
      }],
    }
    return option
  },
  dataBoardDetail(e){
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/batteryList/batteryList?type=${type}`,
    })
  },
  async getDevices(){
    const res = await util.request('powerbankDevice/deviceData')
    this.setData({
      devices:res.data
    })
  },
  async getWarn(){
    const res = await util.request('powerbankDevice/warn')
    this.setData({
      warnData:res.data
    })
  },
  async getOnlineTrend(){
    const res =await util.request('powerbankDevice/onlineTrend')
    const obj = {
      dates:[],
      online:[]
    }
    res.data.forEach(item=>{
      obj.dates.push(item.date)
      obj.online.push(item.online_ratio)
    })
    this.setData({
      onlineTrend:obj
    })
    this.init_echarts()
  },
  viewDevice(e){
    const status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: `/pages/batteryDevice/batteryDevice?status=${status}`,
    })
  }
})