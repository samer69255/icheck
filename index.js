const express = require('express');
var fs = require("fs");

const app = express();
var Start = require("./app.js");
app.get("/usrs", (req, res) => {
  res.end(fs.readFileSync("./success.txt"));
})


app.listen(process.env.PORT||3000, () => {
  console.log('server started');
});

Start(app);