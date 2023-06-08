// app.js
App({
  onLaunch() {
    
  },
  onShow() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      if(res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            showCancel: false,
            content: '新版本已经准备好，准备重启应用',
            success: function () {
              updateManager.applyUpdate()
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
          wx.showModal({
            title: '更新提示',
            content: '已上线新版本，请删除当前小程序，重新搜索打开'
          })
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    introducer: '',
    seller: '',
    pileBalance:'',
    pileTemporary:'',
    pileMonth:'',
    info:'',
    bd: ''
  }
})
