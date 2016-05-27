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
    console.log(`Added registration. Total: ${registrations.length}`);
    writeRegistered();
    response.end("Registered!");
  },
  "/unregister": function(req, response) {
    var params = qs.parse(url.parse(req.url).query);
    registrations = registrations.filter(r => r.endpoint != params.endpoint);
    console.log(`Removed registration. Total: ${registrations.length}`);
    response.end("Unregistered");
  },
  "/send": function(req, response) {
    console.log(registrations);
    var responses = registrations.map(r => push.sendNotification(r.endpoint));
    console.log(`Sent notifications to ${registrations.length} users`);
    response.end("Messages sent");
  }
};
