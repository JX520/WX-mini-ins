// miniprogram/pages/list/list.js
function fixZero(num){
  return num <10 ? '0' + num : num
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    showToolbar: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  dealData(list, callback) {
    var fileList = [];
    list.forEach(function (item) {
      var date = new Date(item.time);
      item.timeInfo = {
        year: fixZero(date.getFullYear()),
        month: fixZero(date.getMonth() + 1),
        date: fixZero(date.getDate()),
        hours: fixZero(date.getHours()),
        miniutes: fixZero(date.getMinutes()),
        //second:date.getSeconds(),
      };
      //console.log('time',item.timeInfo);
      fileList.push(item.img);
    });
    //console.log('fileList', fileList);
    wx.cloud.getTempFileURL({
      fileList: fileList,

      success: function (res) {
        var fileList = res.fileList;
        //console.log(res);
        list.forEach(function (item, index) {
          item.img = fileList[index].tempFileURL;

        });
        callback(list);
      },
      fail(err) {}
    });

  },

  getData() {
    //var db = wx.cloud.database();
    var that = this;

    //调用云函数
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'db',
      // 传给云函数的参数
      data: {
        type: 'get',
      },
      // 成功回调
      success(res) {
        console.log('获取成功');
        console.log(res);
        var result = res.result || {};
        that.dealData(result.data, function (data) {
          data = data.reverse();
          that.setData({
            list: data,
          })
        });
      },
      fail(err) {
        console.log('获取失败')
      }

    })

    // db.collection('list').get({
    //   success(res) {
    //     console.log('获取数据成功',res);
    //      that.dealData(res.data, function (data) {
    //        //console.log(data)
    //       that.setData({
    //         list: data,
    //       })
    //      });

    //   },
    // })

  },
  // 长按保存图片
  // saveImg(event) {
  //   var url = [];
  //   var that = this
  //     url = that.data.list;
  //     //console.log(url[5].img);
  //     url.forEach(function (item, index) {
  //       url[index] = that.data.list[index].img;

  //       //console.log(url);
  //     });

  //   //用户需要授权
  //   wx.getSetting({
  //     success: (res) => {
  //       if (!res.authSetting['scope.writePhotosAlbum']) {
  //         wx.authorize({
  //           scope: 'scope.writePhotosAlbum',
  //           success: () => {
  //             // 同意授权
  //             this.saveImg1(url);
  //           },
  //           fail: (res) => {
  //             console.log(res);
  //           }
  //         })
  //       } else {
  //         // 已经授权了
  //         this.saveImg1(url);
  //       }
  //     },
  //     fail: (res) => {
  //       console.log(res);
  //     }
  //   })
  // },

  // saveImg1(url) {
  //   wx.getImageInfo({
  //     src: url,
  //     success: (res) => {
  //       var path = res.path;
  //       console.log(path);
  //       wx.saveImageToPhotosAlbum({
  //         filePath: path,
  //         success: (res) => {
  //           console.log(res);
  //           console.log('图片保存成功');
  //         },
  //         fail: (res) => {
  //           console.log(res);
  //         }
  //       })
  //     }
  //   })
  // },


  

  onToggle() {
    this.setData({
      showToolbar: !this.data.showToolbar,
    });
  },
  onAdd() {
    wx.redirectTo({
      url: '/pages/comment/comment',
    })
  },
  onList() {
    wx.redirectTo({
      url: '/pages/list/list',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})