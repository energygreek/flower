// page/component/details/details.js
const db = wx.cloud.database();
Page({
  data:{
    good:Object,
    goodid: 0,
    num: 1,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },
  //Goods // 商品详情
  getGoods: function (goodid) {
    // 查询当前用户所有的 counters
    db.collection('goods').where({
          _id:goodid
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
            good: res.data[0]  
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

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },

  addToCart: function (e) {
    const num = this.data.num;
    this.setData({
      show: true
    })
    var arr = wx.getStorageSync('cart') || [];
    // 如果购物车有数据
    if (arr.length > 0) {
      // 遍历购物车数组
      for (var j in arr) {
        // 判断购物车内的item的id，和事件传递过来的id，是否相等
        if (arr[j]&&(arr[j].id == this.data.goodid)) {
          // 相等的话，给count+1（即再次添加入购物车，数量+1）
          arr[j].count = arr[j].count + num;
          // 最后，把购物车数据，存放入缓存（此处不用再给购物车数组push元素进去，因为这个是购物车有的，直接更新当前数组即可）
          try {
            wx.setStorageSync('cart', arr)
          } catch (e) {
            console.log(e)
          }
          // 返回（在if内使用return，跳出循环节约运算，节约性能）
          return;
        }
      }
      // 遍历完购物车后，没有对应的item项，把goodslist的当前项放入购物车数组
      arr.push(this.data.goods);
    }
    // 购物车没有数据，把item项push放入当前数据（第一次存放时）
    else {
      arr.push(this.data.goods);
    }
    // 最后，把购物车数据，存放入缓存
    try {
      wx.setStorageSync('cart', arr)
      // 返回（在if内使用return，跳出循环节约运算，节约性能）
      return;
    } catch (e) {
      console.log(e)
    }
  },  
  onLoad: function (options) {
    this.setData({
      goodid : options.id
    });
    this.getGoods(options.id);
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
 
})