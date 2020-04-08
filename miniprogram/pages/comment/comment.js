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
    var db = wx.cloud.database();
    var form = this.data.form;
    console.log(form);
    db.collection('list').add({
      data: {
        img: fileID,
        comment: form.comment,
        time:Date.now(),
      },
      success(res) {
        console(res);
        console.log('图片和文字上传成功！')

      },
      fail (res) {
        console(res);
        console.log('图片和文字上传失败！')
      }

    });
    wx.showToast({
      title: '心情发表成功！',
    });

  },
  addToTextDB() {
    var db = wx.cloud.database();
    var form = this.data.form;
    db.collection('list').add({
      data: {
        comment: form.comment,
      },
      success(res) {
        console.log('文字上传成功！')
        wx.showToast({
          title: '心情发表成功！！',
        });
      },
      fail(res) {
        console.log('文字上传失败！')
      }

    })
  },
  onSave() {
    var form = this.data.form;
    var that = this;

    if (!form.img && !form.comment) {
      wx.showToast({
        title: '文字不能为空！',
        icon: "none"
      });
      return;
    } else if (form.img && form.comment) {
      var form = this.data.form;
      var that = this;
      var cloudPath = Date.now() + Math.floor(Math.random() * 100 + 1) + '.img';
      console.log(cloudPath);
      wx.cloud.uploadFile({
        cloudPath: cloudPath, //上传至云端的路径
        filePath: form.img, // 小程序图片文件路径
        success: res => {
          // 返回文件 ID
          console.log(res.fileID)
          that.addToDB(res.fileID);
        },
        fail: err => {
          // handle error
        }
      })

    } else that.addToTextDB();

  },




})