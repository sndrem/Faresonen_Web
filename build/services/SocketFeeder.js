"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _altomfotballScraper = require("../services/altomfotballScraper");

var _altomfotballScraper2 = _interopRequireDefault(_altomfotballScraper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var io = require("socket.io");

var SocketFeeder = function () {
  function SocketFeeder(server) {
    _classCallCheck(this, SocketFeeder);

    console.log("Setting up socket-feeder");
    this.io = io(server, {
      pingInterval: 10000,
      pingTimeout: 5000
    });
    this.connectedUsers = [];
    this.interval = null;
    this.connection();
  }

  _createClass(SocketFeeder, [{
    key: "connection",
    value: function connection() {
      var _this = this;

      this.io.sockets.on("connection", function (socket) {
        console.log("A new user connected");
        _this.connectedUsers.push(socket);
        console.log("Number of connected users are " + _this.connectedUsers.length);

        _this.startFeed();
        // this.startTestFeed();

        socket.on("disconnect", function () {
          console.log("User disconnected");
          var index = _this.connectedUsers.indexOf(socket);
          _this.connectedUsers.splice(index, 1);
          console.log("Number of connected users are: " + _this.connectedUsers.length);
          if (_this.connectedUsers.length <= 0) {
            console.log("No users left, clearing interval");
            clearInterval(_this.interval);
          }
        });
      });
    }
  }, {
    key: "sendData",
    value: function sendData() {
      var testData = {
        events: {
          "-uri": "http://api.tv2.no/sport/resources/events/",
          event: [{
            "-uri": "http://api.tv2.no/sport/resources/events/15221417/",
            eventtype: {
              "-uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
            },
            eventtime: "41",
            extendedeventtype: {
              "-uri": "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
            },
            goalsTeamA: "1",
            goalsTeamB: "0",
            id: "15221417",
            match: {
              "-uri": "http://api.tv2.no/sport/resources/matches/912485/"
            },
            person1: {
              "-uri": "http://api.tv2.no/sport/resources/people/345617/"
            },
            realTime: "2018-03-18T18:46:57+01:00",
            team: {
              "-uri": "http://api.tv2.no/sport/resources/teams/307/"
            }
          }, {
            "-uri": "http://api.tv2.no/sport/resources/events/15222082/",
            enetpulseId: "5491684",
            eventMin: "84",
            eventtype: {
              "-uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
            },
            eventtime: "84",
            extendedeventtype: {
              "-uri": "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
            },
            goalsTeamA: "2",
            goalsTeamB: "0",
            id: "15222082",
            match: {
              "-uri": "http://api.tv2.no/sport/resources/matches/912485/"
            },
            nifsId: "8630875",
            person1: {
              "-uri": "http://api.tv2.no/sport/resources/people/207243/"
            },
            realTime: "2018-03-18T19:50:24+01:00",
            team: {
              "-uri": "http://api.tv2.no/sport/resources/teams/307/"
            },
            text: "Stopper en Brann-kontring. Riktig idømt."
          }, {
            "-uri": "http://api.tv2.no/sport/resources/events/15222085/",
            eventtype: {
              "-uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
            },
            eventtime: "85",
            extendedeventtype: {
              "-uri": "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
            },
            goalsTeamA: "0",
            goalsTeamB: "1",
            id: "15222085",
            match: {
              "-uri": "http://api.tv2.no/sport/resources/matches/912482/"
            },
            person1: {
              "-uri": "http://api.tv2.no/sport/resources/people/279765/"
            },
            realTime: "2018-03-18T19:50:25+01:00",
            team: {
              "-uri": "http://api.tv2.no/sport/resources/teams/309/"
            }
          }, {
            "-uri": "http://api.tv2.no/sport/resources/events/15222633/",
            eventtype: {
              "-uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
            },
            eventtime: "36",
            extendedeventtype: {
              "-uri": "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
            },
            goalsTeamA: "0",
            goalsTeamB: "0",
            id: "15222633",
            match: {
              "-uri": "http://api.tv2.no/sport/resources/matches/912487/"
            },
            nifsId: "8631283",
            person1: {
              "-uri": "http://api.tv2.no/sport/resources/people/194694/"
            },
            realTime: "2018-03-18T20:37:58+01:00",
            team: {
              "-uri": "http://api.tv2.no/sport/resources/teams/314/"
            },
            text: "Alt for sent inne i en takling på Jone Samuelsen. Frispark til Odd i svært god posisjon."
          }, {
            "-uri": "http://api.tv2.no/sport/resources/events/15222908/",
            eventtype: {
              "-uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
            },
            eventtime: "65",
            extendedeventtype: {
              "-uri": "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
            },
            goalsTeamA: "2",
            goalsTeamB: "1",
            id: "15222908",
            match: {
              "-uri": "http://api.tv2.no/sport/resources/matches/912487/"
            },
            nifsId: "8631530",
            person1: {
              "-uri": "http://api.tv2.no/sport/resources/people/291489/"
            },
            realTime: "2018-03-18T21:24:57+01:00",
            team: {
              "-uri": "http://api.tv2.no/sport/resources/teams/314/"
            }
          }]
        }
      };
      this.io.emit("data", {
        testData: testData
      });
    }
  }, {
    key: "startFeed",
    value: function startFeed() {
      var _this2 = this;

      if (this.interval) clearInterval(this.interval);

      if (this.connectedUsers.length > 0) {
        if (this.interval) clearInterval(this.interval);

        var yesterday = SocketFeeder.getYesterday();

        this.interval = setInterval(function () {
          _altomfotballScraper2.default.getYellowCardEvents(yesterday).then(function (data) {
            console.log("Emitting data to clients");
            _this2.io.emit("data", data);
          }).catch(function (err) {
            console.log("Error fetch yellow card events", err);
            _this2.io.emit("data", {});
          });
        }, 10000);
      }
    }
  }, {
    key: "startTestFeed",
    value: function startTestFeed() {
      var _this3 = this;

      var data = _altomfotballScraper2.default.getTestEvents();
      this.io.emit("data", { events: data });
      if (this.connectedUsers.length > 0) {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(function () {
          console.log("Emitting test data");
          _this3.io.emit("data", { events: data });
        }, 5000);
      }
    }
  }], [{
    key: "getYesterday",
    value: function getYesterday() {
      var now = (0, _moment2.default)().subtract(1, "days");
      now.add(1, "month");
      var month = now.month();
      var year = now.year();
      var day = now.date();
      return SocketFeeder.formatDateString(year, month, day);
    }
  }, {
    key: "formatDateString",
    value: function formatDateString(year, month, day) {
      return year + "-" + (month >= 10 ? month : "0" + month) + "-" + (day >= 10 ? day : "0" + day);
    }
  }]);

  return SocketFeeder;
}();

exports.default = SocketFeeder;
//# sourceMappingURL=SocketFeeder.js.map