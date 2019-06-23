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
    imodel:'0',
    items:[ 
      {id: '0', value: '轮播图',checked: 'true'},
      {id: '1', value: '小图'},
      {id: '2', value: '大图'},]
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
 
  updateImages: function (e) {
    var choosedPic = new Array();
    for(let i in this.data.choosedCheckBox){
      choosedPic.push(this.data.goods[i]);
    }
    wx.cloud.callFunction({
      name:'updateIndexPicture',
      data:{
        imodel:this.data.imodel,
        updateData:choosedPic
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