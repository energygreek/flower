const db = wx.cloud.database();
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: true,    
    headBanners:Object,
    bodyBanners:Object,
    footerBanners:Object
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    this.getHeaderPictures();;
    this.getBodyPictures();
    this.getFooterPictures();
  },
  getHeaderPictures: function (e) {    
    // 查询当前用户所有的 counters
    db.collection('index_picture').where({
      imodel:'0'
    }).get({
      success: res => {       
        console.log('[数据库] [查询记录] 成功: ', res)               
        // 查询存储图片url 有效期2小时
        let promiseArr=[];
        for(let i =0 ;i < res.data[0].pictureId.length ; i++){
          let fl = res.data[0].pictureId[i].fileID;
          promiseArr.push(new Promise((resolve,reject)=>{
            wx.cloud.getTempFileURL({
              fileList: fl,
              success: urlres => {                    
                res.data[0].pictureId[i]['url'] = urlres.fileList;
                resolve();
              },
              fail: console.error
            })      
          })
        )} 
        Promise.all(promiseArr).then((promisRes) => {
          this.setData({
            headBanners: res.data[0]  
          })
        }); 
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  getBodyPictures: function (e) {    
    // 查询当前用户所有的 counters
    db.collection('index_picture').where({
      imodel:'1'
    }).get({
      success: res => {       
        console.log('[数据库] [查询记录] 成功: ', res)               
        // 查询存储图片url 有效期2小时
        let promiseArr=[];
        for(let i =0 ;i < res.data[0].pictureId.length ; i++){
          let fl = res.data[0].pictureId[i].fileID;
          promiseArr.push(new Promise((resolve,reject)=>{
            wx.cloud.getTempFileURL({
              fileList: fl,
              success: urlres => {                    
                res.data[0].pictureId[i]['url'] = urlres.fileList;
                resolve();
              },
              fail: console.error
            })      
          })
        )} 
        Promise.all(promiseArr).then((promisRes) => {
          this.setData({
            bodyBanners: res.data[0]  
          })
        }); 
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  getFooterPictures: function (e) {    
    // 查询当前用户所有的 counters
    db.collection('index_picture').where({
      imodel:'2'
    }).get({
      success: res => {       
        console.log('[数据库] [查询记录] 成功: ', res)               
        // 查询存储图片url 有效期2小时
        let promiseArr=[];
        for(let i =0 ;i < res.data[0].pictureId.length ; i++){
          let fl = res.data[0].pictureId[i].fileID;
          promiseArr.push(new Promise((resolve,reject)=>{
            wx.cloud.getTempFileURL({
              fileList: fl,
              success: urlres => {                    
                res.data[0].pictureId[i]['url'] = urlres.fileList;
                resolve();
              },
              fail: console.error
            })      
          })
        )} 
        Promise.all(promiseArr).then((promisRes) => {
          this.setData({
            footerBanners: res.data[0]  
          })
        }); 
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  swiperchange:function(e){

  }

})
