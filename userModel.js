const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
require("dotenv").config();
mongoose.connect('mongodb+srv://admin:'+process.env.PASSWORD+'@cluster0.e9kqskh.mongodb.net/?retryWrites=true&w=majority');

const Schema = mongoose.Schema;

const User = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  username: String,
  zipcode: String
});
// UsersInfo
User.plugin(passportLocalMongoose);

// Export Model
module.exports = mongoose.model('userinfos', User);


