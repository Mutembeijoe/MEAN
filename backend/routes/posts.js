const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.delete("/:id", async (req, res) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
    res.status(204).json({ message: "deleted successfully" });
  } catch (error) {
    console.log("EROROROOROR");
  }
});

router.post("", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  await post.save();
  res
    .status(201)
    .json({ message: "Post was successfully Created", postId: post._id });
});

router.get("/:id", async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    console.error("Error : ", error);
  }
});

router.get("", async (req, res) => {
  try {
    let posts = await Post.find();
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error : ", error);
  }
});

router.put("/:id", async (req, res) => {
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

module.exports = router;
