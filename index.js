const express = require('express');
var fs = require("fs");
var config = fs.readFileSync("./config.json");
config = JSON.parse(config);

const app = express();
var Start = require("./app.js");
app.get("/usrs", (req, res) => {
  res.end(fs.readFileSync("./success.txt"));
});


// run time heroku app
if (config.url) {
	var request = require("request");
	setInterval(() => {
		request.get(config.url, (err, res, body) => {});
	}, 6*60*1000);
}

app.listen(process.env.PORT||3000, () => {
  console.log('server started');
});

Start(app);