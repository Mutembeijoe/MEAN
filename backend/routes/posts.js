const express = require("express");
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/uploads");
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, filename + "-" + Date.now() + "." + ext);
  },
});

var upload = multer({ storage: storage });

const Post = require("../models/post");

router.delete("/:id", async (req, res) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
    res.status(204).json({ message: "deleted successfully" });
  } catch (error) {
    console.log("EROROROOROR");
  }
});

router.post("", upload.single("image"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/uploads/" + req.file.filename,
  });
  await post.save();
  res.status(201).json({
    message: "Post was successfully Created",
    post: {
      ...post,
      id: post._id,
    },
  });
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

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const url = req.protocol + "://" + req.get("host");

    let imagePath = req.file
      ? url + "/uploads/" + req.file.filename
      : req.body.imagePath;

    let post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });

    await Post.updateOne({ _id: req.params.id }, post);
    res.status(200).json({ message: "Successfully updated", post });
  } catch (error) {
    console.error("Error : ", error);
  }
});

module.exports = router;
