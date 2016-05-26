var http = require("https");
var fs = require("fs");
var path = require("path");
var url = require("url");

var config = require("./config.json");
var routes = require("./routes");

var serverOptions = {
  key: fs.readFileSync(config.tlsKey),
  cert: fs.readFileSync(config.tlsCert)
};

var server = http.createServer(serverOptions);
server.listen(config.port);

server.on("request", function(req, response) {
  var p = url.parse(req.url).pathname;
  if (p in routes) return routes[p](req, response);
  if (p == "/") p = "index.html";
  if (p.indexOf("..") > -1) return response.end("Bad command or file name");
  var name = path.join("./public/", p);
  var f = fs.readFile(name, function(err, contents) {
    if (err) {
      response.writeHead(404);
      response.end("Bad command or filename");
    } else {
      if (name.match(/\.js/)) {
        response.writeHead(200, { "Content-Type": "application/javascript" });
      }
      response.end(contents);
    }
  });
});
