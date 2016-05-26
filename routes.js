var fs = require("fs");
var qs = require("querystring");
var url = require("url");

var request = require("request");
var config = require("./config.json");

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
    if (!params.id) {
      response.writeHead(500);
      response.end("Missing params");
      return;
    }
    registrations.push(params.id);
    writeRegistered();
    response.end("Registered!");
  },
  "/unregister": function(req, response) {
    var params = qs.parse(url.parse(req.url).query);
    registrations = registrations.filter(r => r != params.id);
    response.end("Unregistered");
  },
  "/send": function(req, response) {
    request("https://android.googleapis.com/gcm/send", {
      method: "POST",
      headers: {
        Authorization: `key=${config.gcm}`
      },
      json: true,
      body: {
        registration_ids: registrations
      }
    }, function(err, res, body) {
      response.end(JSON.stringify(body));
    });
  }
};
