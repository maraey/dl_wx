import * as echarts from '../../ec-canvas/echarts.js';
const util = require('../../utils/util')
Page({
  data: {
    ec: {
      lazyLoad: true
    },
    total_amount: '',
    datas: [],
    start_date: '',
    end_date: '',
    dates: [],
    amounts: []
  },
  onLoad(options) {
    console.log(options);
    this.setData({
      seller_id: JSON.parse(options.info).id
    })
    this.echartsComponnet = this.selectComponent('#mychart-dom-bar');
    let date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()
    if(month<10){
      month = `0${month*1}`
    }
    if(day<10){
      day = `0${day}`
    }
    date = `${year}-${month}-${day}`
    console.log(date);
    this.setData({
      start_date:`${year}-${month}-01`,
      end_date:date
    })
  },
  onShow() {
    this.getStat()
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
        top: '60px',
        left: '60px',
        right: '20px',
        bottom: '40px',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.data.dates
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: this.data.amounts,
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
  async getStat() {
    const {
      seller_id,
      start_date,
      end_date
    } = this.data
    const res = await util.request('seller/stat', {
      seller_id,
      start_date,
      end_date
    })
    if (res.code == 1) {
      let {
        total_amount,
        data,
        logs
      } = res.data
      let dates = [],
        amounts = []
      logs.forEach(item => {
        dates.push(item.date)
        amounts.push(item.pay_amount)
      })
      this.setData({
        total_amount,
        datas: data,
        dates,
        amounts
      })
      this.init_echarts()
    }
  },
  bindStartDate(e) {
    this.setData({
      start_date: e.detail.value
    })
    if (this.data.start_date && this.data.end_date) {
      this.getStat()
    }
  },
  bindEndDate(e) {
    this.setData({
      end_date: e.detail.value
    })
    if (this.data.start_date && this.data.end_date) {
      this.getStat()
    }
  }
});