// page/admin/modifyIndex/modifyIndex.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    //only for current tab
    choosedCheckBox:[],
    //当前操作栏目
    imodel:'1',
    items:[ 
      {id: '1', value: '轮播图',checked: 'true'},
      {id: '2', value: '小图'},
      {id: '3', value: '大图'},]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  inputOnBlur: function (e) {

  },
  changeDeal: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      imodel: index
    })
  },
  //getSliderList
  getSliderList: function (e) {
    const db = wx.cloud.database();
    // 查询当前用户所有的 counters
    db.collection('data1').where({
      mark: "images"
    }).get({
      success: res => {
        this.setData({
          images: res.data[0].images || [],
          imagedbid: res.data[0]._id
        })
        console.log('[数据库] [查询记录] 成功: ', res)
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
  //venuesList
  getVenuesList: function (e) {
    const db = wx.cloud.database();
    // 查询当前用户所有的 counters
    db.collection('data1').where({
      mark: "venuesItems"
    }).get({
      success: res => {
        this.setData({
          venuesItems: res.data[0].venuesItems || [],
          venuesItemsdbid: res.data[0]._id,
          loadingHidden: true
        })
        console.log('[数据库] [查询记录] 成功: ', res)
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
  //getChoiceList
  getChoiceList: function (e) {
    const db = wx.cloud.database();
    // 查询当前用户所有的 counters
    db.collection('data1').where({
      mark: "choiceItems"
    }).get({
      success: res => {
        this.setData({
          choiceItems: res.data[0].choiceItems || [],
          choiceItemsdbid: res.data[0]._id,
          loadingHidden: true
        })
        console.log('[数据库] [查询记录] 成功: ', res)
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
 
  updateImages: function (e) {
    wx.cloud.callFunction({
      name:'updateIndexPicture',
      data:{
        imodel:this.data.imodel,
        updateData:this.data.choosedCheckBox
      }      
    }).then(res => {
      wx.showToast({
        title: '成功',
      });
    }).catch(ret => {
      wx.showToast({
        title: '失败',
      });
    });
  },
  //Goods
  getGoodList: function (e) {    
    // 查询当前用户所有的 counters
    db.collection('goods').where({
      
    }).get({
      success: res => {       
        console.log('[数据库] [查询记录] 成功: ', res)               
        // 查询存储图片url 有效期2小时
        let promiseArr=[];
        for(let i =0 ;i < res.data.length; i++){
          let fl = res.data[i].fileID;
          promiseArr.push(new Promise((resolve,reject)=>{
            wx.cloud.getTempFileURL({
              fileList: fl,
              success: urlres => {                    
                res.data[i]['url'] = urlres.fileList;
                resolve();
              },
              fail: console.error
            })      
          })
        )} 
        Promise.all(promiseArr).then((promisRes) => {
          this.setData({
            goods: res.data  
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
  checkBoxChange: function(e) {
    this.setData({
      choosedCheckBox:e.detail.value
    });
  },
  radioChange: function(e) {
    this.setData({
      imodel:e.detail.value
    });
  }
})