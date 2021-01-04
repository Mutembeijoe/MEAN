const express = require("express");
const bodyParser = require("body-parser");
const postRouter = require("./routes/posts");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

mongoose
  .connect(
    "mongodb+srv://orion:fZYJinXsWfHWr16z@cluster0.nhjzc.mongodb.net/mean-posts?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("Failed to connect to DB : ", err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  next();
});

app.use("/uploads", express.static(path.join("backend/uploads")));

app.use("/api/posts", postRouter);
module.exports = app;
