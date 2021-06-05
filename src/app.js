const createError = require('http-errors');
const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride =  require('method-override');
// const session = require ('express-session');
require("dotenv").config();

const url = process.env.NODE_ENV === 'development' ?
  `${process.env.URL_API_DEV}/api` : `${process.env.URL_API_PROD}/api`;

const usersApiRouter = require('./routes/api/apiUsers');
const productApiRouter = require('./routes/api/product');
const dashboardApiRouter = require("./routes/api/dashboard");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(methodOverride('_method'));

// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sess.cookie.secure = true // serve secure cookies
// }

// app.use(
//   session({
//     secret:'algo le tenemos que pasar',
//     resave: false,
//     saveUninitialized: true
//   })
// );

app.use(cors())
app.get(url, function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})

// API routes.
app.use('/api/apiUsers' ,usersApiRouter);
app.use('/api/product' ,productApiRouter);
app.use("/api/dashboard", dashboardApiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
