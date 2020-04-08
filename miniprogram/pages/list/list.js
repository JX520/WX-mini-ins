// miniprogram/pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],

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
        year:date.getFullYear(),
        month:date.getMonth() + 1,
        date:date.getDate(),
        hours:date.getHours(),
        miniutes:date.getMinutes(),
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
        list.forEach(function(item,index){
          item.img = fileList[index].tempFileURL;
          
        });
        callback(list);
      },
      fail(err) {}
    });

  },

  getData() {
    var db = wx.cloud.database();
    var that = this;
    db.collection('list').get({
      success(res) {
        //console.log(that.data.list);
         that.dealData(res.data, function (data) {
           //console.log(data)
          that.setData({
            list: data,
          })
         });

      },
    })

  },
other(){

},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})