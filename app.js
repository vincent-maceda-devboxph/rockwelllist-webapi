var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var user = require("./api/models/user");
var expressSanitizer = require('express-sanitizer');
var path = require("path");
var fs = require("fs");
var localStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require("passport");
var passportLocalMongoose = require("passport-local-mongoose");
var crypto = require("crypto");
var app = express();
var configAuth = require('./api/configs/FbAuth');
var morgan = require('morgan');
var databaseAuth = require('./api/configs/database');
// var environment = require('dotenv').config();

var itemsRoutes = require('./api/routes/items');
var authRoutes = require("./api/routes/authentication");
var moviesRoutes = require('./api/routes/movies');
var moviesRoutesv2 = require('./api/routes/movies2');
var userRoutes = require('./api/routes/user');
var walletRoutes = require('./api/routes/wallet');
var egcRoutes = require('./api/routes/coupon');
var paymentRoutes = require('./api/routes/payment');
var financeRoutes = require('./api/routes/finance');
var inAppRoutes = require('./api/routes/inapppurchase');

//VPN Connection
// const openvpnmanager = require('node-openvpn');
// const opts = {
//   host: '114.108.254.186', // normally '127.0.0.1', will default to if undefined
//   port: 10443, //port openvpn management console
//   timeout: 1500, //timeout for connection - optional, will default to 1500ms if undefined
//   logpath: 'log.txt' //optional write openvpn console output to file, can be relative path or absolute
// };

// const auth = {
//   user: 'devbox-admin',
//   pass: 'x7aNBVxKhE',
// };
// const openvpn = openvpnmanager.connect(opts);

// will be emited on successful interfacing with openvpn instance
// openvpn.on('connected', () => {
//   openvpnmanager.authorize(auth);
// });

// emits console output of openvpn instance as a string
// openvpn.on('console-output', output => {
//   console.log(output)
// });

// emits console output of openvpn state as a array
// openvpn.on('state-change', state => {
//   console.log(state)
// });

// emits console output of openvpn state as a string
// openvpn.on('error', error => {
//   console.log(error)
// });

// get all console logs up to this point
//openvpnmanager.getLog(console.log)

// and finally when/if you want to
//openvpnmanager.disconnect();

// emits on disconnect
//openvpn.on('disconnected', () => {
  // finally destroy the disconnected manager 
  //openvpnmanager.destroy()
//});

//End VPN Connection

//Passport declarations
app.use(require("express-session")({
  secret: "enzo yu is an awesome human being", // Edi wow. XD 
  resave: false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()));

//REFACTOR THIS CODE!
passport.use(new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL,
  profileFields: configAuth.facebookAuth.profileFields
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function(){
    console.log(profile.id);
    user.findOne({'facebook.id': profile.id}, function(err, usr){
      if(err){
        return done(err);
      }
      if(usr){
        console.log(usr);
        return done(null, usr);
      }
      else{
        user.find({username: profile.emails[0].value}, function(err, us){
          if(err){
            return done(err);
          }
          else if(us.length != 0){
            console.log("existing");
            user.findOneAndUpdate({username: profile.emails[0].value}, {"facebook.id": profile.id, "facebook.token": accessToken}, {new: true}, function(err,users){
              if(err){
                return done(err)
              }
              else{
                return done(null, users);
              }
            })
          }
          else{
            crypto.randomBytes(16, function(err, buffer) {
              hash = buffer.toString('hex');
              console.log("not existing");
              var newUser = new user();
              console.log(profile)
              newUser.facebook.id = profile.id;
              newUser.facebook.token = accessToken;
              newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
              newUser.facebook.email = profile.emails[0].value;
              newUser.username = profile.emails[0].value;
              newUser.accessCode = hash;                    
              if (err) {
                  res.status(400);
                  return done(err)
              }
              else{
                  newUser.save(function(err){
                    if(err){
                      throw err;
                    }
                    else{
                      return done(null, newUser);
                    }
                  })
              }
            });
          }
        });
      }
      
    });
  })
}
));

passport.use(user.createStrategy());


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


var connectionString = "mongodb://"+databaseAuth.dbAuth.username + ":" + databaseAuth.dbAuth.password + "@" + databaseAuth.dbAuth.host + ":" + databaseAuth.dbAuth.port + "/" + databaseAuth.dbAuth.dataBase;

mongoose.connect(connectionString,{
    useMongoClient: true
});
mongoose.Promise = global.Promise;

// View Engine
app.set('views', path.join(__dirname, 'api/resources/views'));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'api/resources/assets')));

app.get("/", function(req,res){
  res.render("welcome.ejs");
});

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSanitizer());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key, X-XSRF-TOKEN, X-Ios-Version, X-Android-Version"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });
  
  // Routes
  app.use("/v1/items", itemsRoutes);
  app.use("/v1/movies", moviesRoutes);
  app.use("/v2/movies", moviesRoutesv2);
  app.use("/v1/wallet", walletRoutes);
  app.use("/v1/coupon", egcRoutes);
  app.use("/v1/payment", paymentRoutes);
  app.use("/v1/finance", financeRoutes);
  app.use(authRoutes);
  app.use('/user', userRoutes);
  app.use('/v1/apppurchase', inAppRoutes);
  
  app.use((req, res, next) => {
    const error = new Error("No routes found.");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
  
  module.exports = app;