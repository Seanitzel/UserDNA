const User = require("./model/user/user.js");
const mongoose = require("mongoose");

const addUser =( newName,callback) => {
    User.find({ name: newName })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        callback( {
            message : "user already exists",
            result : false
        })
      } 
      else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: newName
            });
            user
              .save()
              .then(result => {
                const response = {
                  message : "user added",
                  result : true
                }
                callback(response)
                })
              .catch(err => {
                callback( err)
              });
          }
        });
      }

const getAllUsers = (callback) => {
    User.find()
    .exec()
    .then( docs => {
        const response = docs.map( el => {
            return {
                name:el.name
            }
        })
        callback(response)
    })
    .catch(err => {
         callback(err)
      })
}

module.exports = {getAllUsers, addUser}