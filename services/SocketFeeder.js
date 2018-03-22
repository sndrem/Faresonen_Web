import altomfotballScraper from "../services/altomfotballScraper";

const io = require("socket.io");

class SocketFeeder {
  constructor(server) {
    console.log("Setting up socket-feeder");
    this.io = io(server);
  }

  connection() {
    this.io.on("connection", socket => {
      console.log("A new user connected");
    });
  }

  sendData() {
    this.io.emit("data", {
      eliteserien: [
        {
          place: 1,
          name: "Hugo Vegard Vetlesen",
          team: "Stabæk",
          value1: 1,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 20)
        },
        {
          place: 2,
          name: "Franck Boli",
          team: "Stabæk",
          value1: 2,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 18)
        },
        {
          place: 3,
          name: "Enric Vallés",
          team: "Sandefjord",
          value1: 2,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 4,
          name: "Isaac Twum",
          team: "Start",
          value1: 1,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 5,
          name: "Martin Ovenstad",
          team: "Stabæk",
          value1: 1,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 6,
          name: "Tobias Christensen",
          team: "Start",
          value1: 1,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 7,
          name: "Bent Sørmo",
          team: "Kristiansund BK",
          value1: 1,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 8,
          name: "Christian Landu Landu",
          team: "Tromsø",
          value1: 1,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 9,
          name: "John Hou Sæter",
          team: "Stabæk",
          value1: 2,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 10,
          name: "Flamur Kastrati",
          team: "Sandefjord",
          value1: 1,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 11,
          name: "Simen Wangberg",
          team: "Tromsø",
          value1: 1,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 12,
          name: "Henrik Robstad",
          team: "Start",
          value1: 1,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 13,
          name: "El-Hadji Gana Kane",
          team: "Sandefjord",
          value1: 1,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 14,
          name: "Ifeanyi Mathew",
          team: "Lillestrøm",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 15,
          name: "Joachim Thomassen",
          team: "Sarpsborg 08",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 16,
          name: "Mathias Normann",
          team: "Molde",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 17,
          name: "José Ángel",
          team: "Bodø/Glimt",
          value1: 2,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 18,
          name: "Jonatan Tollås Nation",
          team: "Vålerenga",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 19,
          name: "Vegard Forren",
          team: "Molde",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 20,
          name: "Frode Kippe",
          team: "Lillestrøm",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 21,
          name: "Sam Adekugbe",
          team: "Vålerenga",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 22,
          name: "Anders Konradsen",
          team: "Rosenborg",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 23,
          name: "Matti Lund Nielsen",
          team: "Sarpsborg 08",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 24,
          name: "Zoran Popovic",
          team: "Bodø/Glimt",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 25,
          name: "Vegar Eggen Hedenstad",
          team: "Rosenborg",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 26,
          name: "Samúel Fridjónsson",
          team: "Vålerenga",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 27,
          name: "Vegard Leikvoll Moberg",
          team: "Bodø/Glimt",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 28,
          name: "Harmeet Singh",
          team: "Sarpsborg 08",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 29,
          name: "Sean McDermott",
          team: "Kristiansund BK",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 30,
          name: "Ronnie Schwartz",
          team: "Sarpsborg 08",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 31,
          name: "Jonas Rønningen",
          team: "Kristiansund BK",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        },
        {
          place: 32,
          name: "Andreas Eines Hopmark",
          team: "Kristiansund BK",
          value1: 1,
          value2: 2,
          value3: 0.5,
          updated: new Date(2018, 2, 21)
        }
      ],
      obosligaen: [
        {
          place: 1,
          name: "Gandhi",
          team: "Fitjar",
          value1: 3,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 22)
        },
        {
          place: 2,
          name: "Jackson Maine",
          team: "Hamar",
          value1: 4,
          value2: 1,
          value3: 1,
          updated: new Date(2018, 2, 22)
        }
      ]
    });
  }

  startFeed() {
    this.sendData();
    setInterval(() => {
      // TODO Bruk riktig endpoint, ikke testdata
      // altomfotballScraper.getAllDangerzonePlayersForSockets(data => {
      //   io.emit("data", data);
      // });
      console.log("Emitting data to clients");
      this.sendData();
    }, 10000);
  }
}

export default SocketFeeder;
