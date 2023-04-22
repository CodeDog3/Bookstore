const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://admin:6OiNDUJcR3b5duYI@usersinfo.6mnzh1l.mongodb.net/?retryWrites=true&w=majority');

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


