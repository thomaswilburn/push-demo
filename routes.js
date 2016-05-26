var fs = require("fs");
var qs = require("querystring");
var url = require("url");

var request = require("request");
var push = require("web-push");
var config = require("./config.json");

push.setGCMAPIKey(config.gcm);

var registrations;
try {
  registrations = require("./registrations.json");
} catch (err) {
  registrations = [];
}

console.log(`${registrations.length} registrations loaded from file`);

var writing = false;
var writeRegistered = function() {
  if (writing) return;
  fs.writeFile("./registrations.json", JSON.stringify(registrations), function() {
    writing = false;
  });
};

module.exports = {
  "/register": function(req, response) {
    var params = qs.parse(url.parse(req.url).query);
    registrations.push(params);
    console.log(registrations);
    writeRegistered();
    response.end("Registered!");
  },
  "/unregister": function(req, response) {
    var params = qs.parse(url.parse(req.url).query);
    registrations = registrations.filter(r => r.endpoint != params.endpoint);
    response.end("Unregistered");
  },
  "/send": function(req, response) {
    console.log(registrations);
    var responses = registrations.map(r => push.sendNotification(r.endpoint));
    Promise.all(responses).then(a => console.log(a));
  }
};
