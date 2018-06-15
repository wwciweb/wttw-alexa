//Global config/helpers

const fetch = require('node-fetch');

module.exports = {
  //Global config/helpers
  errorResponse: function(response) {
    response.say("Sorry, something went wrong! Try again later.");
  },
  schedule: {
    url: "https://schedule.wttw.com/API/onnow.php?chan=",
    channel: {
      hd: 1,
      prime: 2,
      create: 3,
      kids: 4
    },
    getOnNow: function(channel) {
      return fetch(wttw.schedule.url + wttw.schedule.channel[channel]).then((json) => {
        return json.json()
      }).then((json) => {
        return {
          onNow: json.onnow[0].seriesname,
          onNext: json.onnow[1].seriesname
        }
      }).catch((ex) => {
        return new Error(ex);
      });
    }
  }
}
