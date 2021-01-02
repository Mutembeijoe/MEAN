const app = require("express")();

app.use((req, res, next) => {
  console.log("Hello world");
  next();
});

app.use((req, res, next) => {
  res.send("Hello World from node");
});

module.exports = app;
