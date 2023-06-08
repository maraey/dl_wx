const md5 = require('./md5')
const app = getApp()
const config = {
  // host: 'https://lechongbao.w-dian.cn/merchant/',
  host: 'http://cdb.chaohuo365.com/agent/',
  qrcodeUrl: 'https://qrcode.w-dian.cn',
  headerkey: 'zdhx%&$^*app',
  ocode: 'lcb'
}
const permissions = wx.getStorageSync('login_info').permissions
const creatheaderkey = () => {
  const nonce = parseInt((Math.random() + 1) * Math.pow(10, 7))
  const timestamp = Date.parse(new Date()).toString().substring(0, 10)
  const hash = md5.hexMD5(nonce + '' + config.headerkey + '' + timestamp)
  return {
    nonce,
    timestamp,
    hash
  }
}
const getLogin = () => {
  try {
    const value = wx.getStorageSync('login_info')
    if (value) {
      // Do something with return value
      return value
    }
  } catch (e) {
    // Do something when catch error
  }
}
const uploadImage = (img) => {
  const keys = creatheaderkey()
  const login_info = getLogin()
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      filePath: img,
      name: 'file',
      url: config.host + 'misc/uploadImage',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': login_info.token,
        'ocode': config.ocode,
        'hash': keys.hash,
        'time': keys.nonce,
        'client': 'app'
      },
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
const request = (url, data = {}) => {
  const keys = creatheaderkey()
  const login_info = getLogin()
  let token = ''
  if (login_info) {
    token = login_info.token
  }
  console.log(token);
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token,
        'hash': keys.hash,
        'nonce': keys.nonce,
        'timestamp': keys.timestamp
      },
      data,
      success: res => {
        if (!res.data.code && res.data.code != 0) {
          resolve(res.data)
        }
        if (res.data.code == 403 || res.data.code == 401) {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 1000
          })
          setTimeout(() => {
            wx.removeStorage({
              key: 'login_info'
            })
            // wx.reLaunch({
            //   url: '/pages/welcome/welcome'
            // })
          }, 1000)
        } else if (res.data.code == 200) {
          resolve(res.data)
        } else if (res.data.code == 301) {
          resolve(res.data)
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          reject(res)
        }
      },
      fail: err => {
        wx.hideLoading()
        reject(err)
      }
    })
  })
}
const returnQrcode = (url) => {
  // https://qrcode.w-dian.cn/Lease?o=ng==&&t=CT024191002474
  // https://qrcode.w-dian.cn/Xc?o=ng==&&t=MMX221842206
  // https://qrcode.w-dian.cn/Pile?o=ng==&&t=
  if (url.indexOf(config.qrcodeUrl) != -1) {
    if (url.indexOf('o=l5ds&&t=') != -1) {
      const qrcode = url.slice(url.indexOf('o=l5ds&&t=') * 1 + 10)
      const start = url.indexOf('cn/') * 1 + 3
      const end = url.indexOf('o=l5ds&&t=') * 1 - 1
      const type = url.slice(start, end)
      return {
        type,
        qrcode
      }
    } else {
      wx.showToast({
        title: '设备不存在',
        icon: 'error'
      })
      return false
    }
  } else {
    wx.showToast({
      title: '设备不存在',
      icon: 'error'
    })
    return false
  }
}
module.exports = {
  request,
  uploadImage,
  config,
  returnQrcode,
  permissions
}