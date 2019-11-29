var express = require('express');
var expressAblyChannels = require('../');

var app = module.exports = express();

app.use(expressAblyChannels(5000, "44rb_A.hLHdbw:HuDlU-4Z23ESceAd"))
 

app.get("/", function (req, res, next) {
  
  res.send("hello");
});

app.get("/api/*", function(req, res, next) {

  // Respond to the request with a JSON object.
  res.send({ status: 200, response: "Hello"});
});

// Start listening on port 3000 on localhost
app.listen(3001, "localhost");
console.log("[ OK ] Listening on port 3001");