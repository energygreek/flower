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
    this.getGoods();
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
            console.log(res.fileID)
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
          title: '成功',
        })
      }).catch(res => {
        wx.hideLoading();
        wx.showToast({
          title: '评价失败',
        })
      })
    })
  }, 
  //Goods
  getGoods: function (e) {    
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
                console.log(urlres);
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
          console.log(this.data.goods);
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
  deleteGoods: function (e) {
    
    console.log(e)
    debugger
    let goods = this.data.goods;
    this.setData({
      goods: goods,
    })    
    this.syngoodDB();
  },
  //--------------syngoodDB------------------------
  syngoodDB: function () {
    const db = wx.cloud.database();
    const _ = db.command;
    var gooddbid = this.data.gooddbid;
    db.collection('data1').doc(gooddbid).update({
      data: {
        //默认是更新  style.color  字段为 'blue' 而不是把  style  字段更新为  { color: 'blue' }  对象：
        //如果需要替换更新一条记录，可以在记录上使用  set  方法，替换更新意味着用传入的对象替换指定的记录：
        data: _.set(this.data.goods)
      },
      success: res => {
        console.log('[数据库] [更新记录] 成功：', gooddbid);
        wx.showToast({
          title: '[数据库][更新记录] 成功：' + gooddbid,
        })
      },
      fail: err => {
        icon: 'none',
          console.log('[数据库] [更新记录] 失败：', err)
      }
    })
  },  
})