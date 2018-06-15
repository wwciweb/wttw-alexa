const express = require("express"),
    alexa = require("alexa-app"),
    request = require("request"),
    fetch = require('node-fetch'),
    PORT = process.env.PORT || 3000,
    app = express(),
    // Setup the alexa app and attach it to express before anything else.
    alexaApp = new alexa.app(""),
    //import global config/helper object
    wttw = require('./wttw.js');

app.set("view engine", "ejs");

// POST calls to / in express will be handled by the app.request() function
alexaApp.express({
  expressApp: app,
  checkCert: true,
  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production.
  debug: false
});

alexaApp.launch(function(request, response) {
  console.log("App launched");
  response.say("I can tell you what's on WTTW HD Chicago — just say Alexa, ask WTTW what's on right now.");
  response.say("You can also include the channel and say HD, Prime, Create, or Kids");
});

alexaApp.sessionEnded(function(request, response) {
  console.log("In sessionEnded");
  console.error('Alexa ended the session due to an error');
});

//Intents
alexaApp.intent("whats_on", {
    "slots": {
      "channel": "wttwChannel"
    },
    "utterances": [
      "what's playing",
      "what's on now",
      "what's on",
      "what's on {-|channel}",
    ]
  }, function(request, response) {
    console.log("In what's on intent");
    var channel = request.slot("channel");

    if (!channel || !(channel in wttw.schedule.channel)) {
       channel = 'hd';
    }

    return wttw.schedule.getOnNow(channel).then((data) => {
      response.say('On WTTW '+ channel +' right now: ' + data.onNow + ". " + data.onNext + " is on next.");
    }).catch((ex) => {
      wttw.errorResponse(response);
    });
});

// connect the alexa-app to AWS Lambda
exports.handler = alexaApp.lambda();
