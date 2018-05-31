/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


var fs = require('fs');

module.exports = {

  import: function (req, res) {
    let params = req.allParams();
    console.log(params);
    let userInfo = {};

    userInfo.username = params.username;
    userInfo.password = params.password;
    userInfo.phone = params.phone;

    if (userInfo.username && userInfo.password && userInfo.phone) {
      Users.create(userInfo)
        .then(result => {
          return res.json(result);
        })
        .catch(errors => {
          return res.json(errors);
        });
    } else {
      let usersToImportRaw = fs.readFileSync(__dirname + './../../assets/users.json', 'utf8');
      let usersToImport = JSON.parse(usersToImportRaw);
      // let createOneUser = (userInfo) => {
      //     return Users.create(userInfo).fetch();
      // };
      // const createUserPromises = usersToImport.map(item => {
      //     return createOneUser(item);
      // });

      // Promise.all(createUserPromises).then(resolves => {
      //     return res.json(resolves);
      // }).catch(errors => {
      //     return res.json(errors);
      // });

      Users.createEach(usersToImport).fetch().then(r => {
        return res.json(r);
      }).catch(e => {
        return res.json(e);
      });

    }
  },

  //tạo một action create thực hiện chức năng..
  create: (req, res) => {
    let params = req.allParams();
    console.log(params);
    let userInfo = {};

    userInfo.username = params.username;
    userInfo.password = params.password;

    // let username = req.params('username'); //lấy dữ liệu username từ phía client gửi lên;
    // let  password = req.params('password');

    // if(userInfo.username && userInfo.password){
    //   return res.json({
    //     status: 'Success',
    //     message: 'Tạo thành công'
    //   });
    // }

    if (!userInfo.username || userInfo.username === '') {
      return res.json({
        status: 'Username error',
        message: 'Username không được rỗng'
      });
    }
    if (!userInfo.password || userInfo.password === '') {
      return res.json({
        status: 'Password error',
        message: 'Password không được trống'
      });
    }

    //kiểm tra một user tồn tại hay chưa;
    Users.findOne({
      username : userInfo.username
    }).exec((err, find) => {
      if (err) { return console.log(err); }
      if (find) {
        return res.json({
          status: 'error',
          message: 'Username đã tồn tại'
        });
      } else {
        //tạo một user
        Users.create({ username: userInfo.username, password: userInfo.password }).fetch()
        .then(rs=>{
          console.log(rs);
          if (rs) {
            return res.json({
              status: 'success',
              message: 'Tạo user thành công'
            });
          } else {
            // set status err
            return res.json({
              status: 'fail',
              message: 'Tạo user khong thành công'
            });
          }

        }).catch(er=>{
          console.log(er);

          return res.json(err);
        });
      }
    });

  }
};

