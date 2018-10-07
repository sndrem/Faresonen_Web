const express = require("express");
const path = require("path");
const favicon = require("serve-favicon"); //    eslint-disable-line no-unused-vars
const morgan = require("morgan");
const winston = require("./config/winston");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const routes = require("./routes/index");
const fantasyPl = require("./routes/fantasyPl");

const app = express();

const env = process.env.NODE_ENV || "development";
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == "development"; // eslint-disable-line eqeqeq

app.use(express.static(path.join(__dirname, "./../frontend/build")));

// view engine setup

app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "jade");

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(morgan("combined", { stream: winston.stream }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/fantasy", fantasyPl);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    //  eslint-disable-line no-unused-vars
    winston.error(
      `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
        req.method
      } - ${req.ip}`
    );
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
app.use((err, req, res, next) => {
  //   eslint-disable-line no-unused-vars

  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
    title: "error"
  });
});

module.exports = app;
