"use strict";

var express = require("express");
var path = require("path");
var favicon = require("serve-favicon"); //    eslint-disable-line no-unused-vars
var morgan = require("morgan");
var winston = require("./config/winston");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var routes = require("./routes/index");
var fantasyPl = require("./routes/fantasyPl");

var app = express();

var env = process.env.NODE_ENV || "development";
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == "development"; // eslint-disable-line eqeqeq

app.use(express.static(path.join(__dirname, "./../frontend/build/")));

// view engine setup

app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "jade");

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(morgan("combined", { stream: winston.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/fantasy", fantasyPl);

// / catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    //  eslint-disable-line no-unused-vars
    winston.error((err.status || 500) + " - " + err.message + " - " + req.originalUrl + " - " + req.method + " - " + req.ip);
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
      title: "error"
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  //   eslint-disable-line no-unused-vars

  winston.error((err.status || 500) + " - " + err.message + " - " + req.originalUrl + " - " + req.method + " - " + req.ip);
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
    title: "error"
  });
});

module.exports = app;
//# sourceMappingURL=app.js.map