const mongoose = require('mongoose');
//const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://admin:6OiNDUJcR3b5duYI@usersinfo.6mnzh1l.mongodb.net/?retryWrites=true&w=majority');

const Schema = mongoose.Schema;

const payment = new Schema({
  username: String,
  email: String,
  booktitles: [{ type: String }],
  price: String,
  cardnumber: String,
  address: String
});
// UsersInfo
//payment.plugin(passportLocalMongoose);


// Export Model
module.exports = mongoose.model('payment', payment);


