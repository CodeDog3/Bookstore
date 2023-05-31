const express = require("express");
const app = express();
const port = 3000;
var cookieSession = require('cookie-session')
const User = require('./userModel.js')
const payment = require('./paymentModel.js')
const passport = require('passport') 
const session = require('express-session');
const connectEnsureLogin = require('connect-ensure-login');

// const totalPrice = document.getElementById("cart-total");

app.use(passport.initialize());


app.use(session({
  secret: 'sljgoijwh;eojwp298u40t',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60*60*1000} //1 hour
}))


app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/images'));


app.use(express.static(__dirname));
app.set("view engine", "ejs");
app.set("views", './');

// app.use(cookieSession({
//     name: 'sessions',
//     keys: ['key1', 'key2']
//   }))


  app.get('/store', connectEnsureLogin.ensureLoggedIn(),  (req, res)=>{
    req.session.counter = (req.session.counter || 0) + 1;
    res.render('Webstore',{
      name: req.user.firstname,
      amount:req.session.counter,
      Lname: req.user.lastname,
      Uname: req.user.username,
      Ename: req.user.email,
      zip: req.user.zipcode
      //maybe books and price go here?
    });
    
  })
  
  // Route to login page
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
  });
  
  // Route to Login Page
  app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
  });
  
  //Route to Register
  app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
  });
  
  // //This was throwing an error before
  // app.get('/logout', (req, res) =>{
  //   console.log(req.session.id)
  //   req.logout();
  //   req.session.destroy((err)=>{
  //     console.log(err)
  //   });
  //   res.redirect('/login');
  // })
  
  app.post('/register-server', function(req, res, next){
    User.register({firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, username:req.body.username, zipcode:req.body.zipcode}, req.body.password, function(err){
      
      if(err){
        console.log('error while user register!', err);
        return next(err);
      } 
      console.log('user registered!');
      res.redirect('/')
    })
  })
  
  app.post('/login-server', passport.authenticate('local', {failureRedirect: '/'}), function (req, res){
    console.log(req.user)
    res.redirect('/store')
  })
  //price, books,
//he order information must include: username, email, book titles in the cart, total price, credit card number, and user address.

  app.post('/purchase', function (req, res){
    const books = req.body.books.split(",");
    console.log(books);
    const Payment = new payment({username: req.user.username, email: req.user.email, cardnumber:req.body.card, address: req.body.address, price: req.body.pricing, booktitles: books });
    Payment.save();
    console.log('checkout registered!');
    res.redirect('/store')
    //localStorage.removeItem("cart");
  })

  
  
  //route to css
  app.get('/css', (req, res)=>{
    res.sendFile(__dirname + '/Webstore-Style.css');
  })
  //route to books.js
  app.get('/storejs', (req, res)=>{
    res.sendFile(__dirname + '/store.js');
  })
  //add route to products.json
  app.get('/products', (req, res)=>{
    res.sendFile(__dirname + '/products.json');
  })
  
  
  app.listen(port, ()=> console.log(`This app is listening on port ${port}`));
  






