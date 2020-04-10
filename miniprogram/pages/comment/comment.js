// miniprogram/pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddBtn: true,
    showImg: false,
    form: {
      img: '',
      comment: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  uploadImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ["album", "camera"],
      success: (res) => {
        //console.log(res);

        this.setData({
          showAddBtn: false,
          showImg: true,
          'form.img': res.tempFilePaths[0],
        })

      },
    })
  },
  onInput(e) {
    //console.log(e);
    this.setData({
      'form.comment': e.detail.value,
    })
  },
  //上传图片，评论到云开发数据库
  addToDB(fileID) {
    // var db = wx.cloud.database();
    var form = this.data.form;
    console.log(form);

    console.log('开始调用云函数！');
    //调用云函数
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'db',
      // 传给云函数的参数
      data: {
        type: 'add',
        img: fileID,
        comment: form.comment,
      },
      // 成功回调
      success(res) {
        console.log('success');
        onSuccess();

      },
      fail(err) {
        console.log('fail');
        onFail();
      }
    })

    function onSuccess() {
      wx.showToast({
        title: '心情发表成功！',
      });
      setTimeout(function () {
        //要延时执行的代码
        wx.redirectTo({
          url: '/pages/list/list',
        })
      }, 500)

    }

    function onFail() {
      wx.showToast({
        title: '发表失败！重试',
      });
      setTimeout(function () {
        //要延时执行的代码
        wx.redirectTo({
          url: '/pages/comment/commnet',
        })
      }, 500)
    }
    // db.collection('list').add({
    //   data: {
    //     img: fileID,
    //     comment: form.comment,
    //     time:Date.now(),
    //   },
    //   success(res) {
    //     console(res);
    //     console.log('图片和文字上传成功！')

    //   },
    //   fail (res) {
    //     console(res);
    //     console.log('图片和文字上传失败！')
    //   }

    // });
    // wx.showToast({
    //   title: '心情发表成功！',
    // });

  },
  addToTextDB() {
    //var db = wx.cloud.database();
    var form = this.data.form;
    var img = 'http://tmp/wxddfdc0207f9685cc.o6zAJs7HnmRN5BrucYfRmg75SeQ0.dCBW8J920YBN232d3f9ce586c7ccc1eb55a6e42aae28.gif';
    var cloudPath = Date.now() + Math.floor(Math.random() * 100 + 1) + '.img';
     console.log(cloudPath);
    wx.cloud.uploadFile({
      cloudPath: cloudPath, //上传至云端的路径
      filePath:form.img , // 小程序图片文件路径
      success: res => {
        // 返回文件 ID
        console.log(res.fileID)
        that.addToTextDB1(res.fileID);
      },
      fail: err => {
        console.log(err);
        // handle error
      }
    })
  },
  addToTextDB1(fileID) {
    var form = this.data.form;
    //调用云函数
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'db',
      // 传给云函数的参数
      data: {
        type: 'add',
        img: fileID,
        comment: form.comment,
      },
      // 成功回调
      success(res) {
        console.log('success');
        onSuccess();

      },
      fail(err) {
        console.log('fail')
        onFail();
      }
    })

    function onSuccess() {
      wx.showToast({
        title: '心情发表成功！',
      });
      setTimeout(function () {
        //要延时执行的代码
        wx.redirectTo({
          url: '/pages/list/list',
        })
      }, 500)
    }

    function onFail() {
      wx.showToast({
        title: '发表失败！重试',
      });
      setTimeout(function () {
        //要延时执行的代码
        wx.redirectTo({
          url: '/pages/comment/commnet',
        })
      }, 500)
    }
    // db.collection('list').add({
    //   data: {
    //     comment: form.comment,
    //   },
    //   success(res) {
    //     console.log('文字上传成功！')
    //     wx.showToast({
    //       title: '心情发表成功！！',
    //     });
    //   },
    //   fail(res) {
    //     console.log('文字上传失败！')
    //   }

    // })

  },
  onSave() {
    var form = this.data.form;
    var that = this;

    if (!form.img || !form.comment) {
      wx.showToast({
        title: '文字和图片不能为空！',
        icon: "none"
      });
      return;
    } else if (form.img && form.comment) {
      var form = this.data.form;
      console.log(form.img);
      var that = this;
      var cloudPath = Date.now() + Math.floor(Math.random() * 100 + 1) + '.img';
      // console.log(cloudPath);
      wx.cloud.uploadFile({
        cloudPath: cloudPath, //上传至云端的路径
        filePath: form.img, // 小程序图片文件路径
        success: res => {
          // 返回文件 ID
          //console.log(res.fileID)
          that.addToDB(res.fileID);
        },
        fail: err => {
          // handle error
        }
      })

    } else {
      //that.addToTextDB();
      return;
    }

  },




})