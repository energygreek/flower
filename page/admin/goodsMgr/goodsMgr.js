// page/admin/goodsMgr/goodsMgr.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[],
    goodName:'',
    goodPrice:'',
    goodAmount:'',
    fileID:[],
    goods:[]
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
  onNameChange:function(event){    
    this.setData({
      goodName:event.detail
    })    
  },
  onPriceChange:function(event){    
    this.setData({
      goodPrice:event.detail
    })    
  },
  onAmountChange:function(event){    
    this.setData({
      goodAmount:event.detail
    })
  },
  uploadPicture:function(event){
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        });
      }
    })
  },
  submit:function(event){
    wx.showLoading({
      title: '上传中',
    });    

    let promiseArr=[];
    for(let i=0; i<this.data.images.length ;i++){
      let item = this.data.images[i];
      let suffix = /\.\w+$/.exec(item)[0];
      promiseArr.push(new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().toLocaleDateString() + '/' +new Date().getTime() + suffix,
          filePath: item, // 文件路径
          success: res => {
            // get resource ID
            this.setData({
              fileID: this.data.fileID.concat(res.fileID)
            });
            resolve();
          },
          fail: err => {
            // handle error
          }
        })
      }));
    }
    Promise.all(promiseArr).then(res =>{
      db.collection('goods').add({    
        data: {
          goodName: this.data.goodName,
          goodPrice:this.data.goodPrice,
          goodAmount:this.data.goodAmount,
          fileID:this.data.fileID         
        }
      }).then(res =>{
        wx.hideLoading();
        wx.showToast({
          title: '上传成功',
        });
        this.onLoad();
      }).catch(res => {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
        })
      })      
    })
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
  //---------------delete------------------------------
  deleteGoods: function (event) {
    let index = event.currentTarget.id;
    let goodToDelete = this.data.goods.slice(index,index+1);
    this.data.goods.splice(index,1);
    this.setData({
      goods:this.data.goods
    });
    // handle databases
    wx.cloud.callFunction({
      name:'delete_good',
      data:{
        _id:goodToDelete[0]._id
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
  }
})