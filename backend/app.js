const app = require("express")();
const bodyParser = require("body-parser");
const Post = require("./models/post");
const mongoose = require("mongoose");

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

app.delete("/api/posts/:id", async (req, res) => {
  try {
    console.log("GERE");
    const result = await Post.deleteOne({ _id: req.params.id });
    console.log(result);
    res.status(204).json({ message: "deleted successfully" });
  } catch (error) {
    console.log("EROROROOROR");
  }
});

app.post("/api/posts", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  await post.save();
  res
    .status(201)
    .json({ message: "Post was successfully Created", postId: post._id });
});

app.get("/api/posts/:id", async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    console.error("Error : ", error);
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    let posts = await Post.find();
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error : ", error);
  }
});

app.put("/api/posts/:id", async (req, res) => {
  try {
    let post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
    });

    await Post.updateOne({ _id: req.params.id }, post);
    res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.error("Error : ", error);
  }
});

module.exports = app;
