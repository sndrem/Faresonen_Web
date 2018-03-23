import altomfotballScraper from "../services/altomfotballScraper";

const io = require("socket.io");

class SocketFeeder {
  constructor(server) {
    console.log("Setting up socket-feeder");
    this.io = io(server);
    this.sendData();
  }

  connection() {
    this.io.on("connection", socket => {
      console.log("A new user connected");
    });
  }

  sendData() {
    const testData = {
      events: {
        "-uri": "http://api.tv2.no/sport/resources/events/",
        event: [
          {
            "-uri": "http://api.tv2.no/sport/resources/events/15221417/",
            eventtype: {
              "-uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
            },
            eventtime: "41",
            extendedeventtype: {
              "-uri":
                "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
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
          },
          {
            "-uri": "http://api.tv2.no/sport/resources/events/15222082/",
            enetpulseId: "5491684",
            eventMin: "84",
            eventtype: {
              "-uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
            },
            eventtime: "84",
            extendedeventtype: {
              "-uri":
                "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
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
          },
          {
            "-uri": "http://api.tv2.no/sport/resources/events/15222085/",
            eventtype: {
              "-uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
            },
            eventtime: "85",
            extendedeventtype: {
              "-uri":
                "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
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
          },
          {
            "-uri": "http://api.tv2.no/sport/resources/events/15222633/",
            eventtype: {
              "-uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
            },
            eventtime: "36",
            extendedeventtype: {
              "-uri":
                "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
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
            text:
              "Alt for sent inne i en takling på Jone Samuelsen. Frispark til Odd i svært god posisjon."
          },
          {
            "-uri": "http://api.tv2.no/sport/resources/events/15222908/",
            eventtype: {
              "-uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
            },
            eventtime: "65",
            extendedeventtype: {
              "-uri":
                "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
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
          }
        ]
      }
    };
    this.io.emit("data", {
      testData
    });
  }

  startFeed() {
    setInterval(() => {
      altomfotballScraper
        .getYellowCardEvents("2018-03-11", "2018-03-18")
        .then(data => {
          console.log("Emitting data to clients");
          this.io.emit("data", data);
        })
        .catch(err => {
          console.log(`Error fetch yellow card events`, err);
          this.io.emit("data", {});
        });
    }, 10000);
  }
}

export default SocketFeeder;
