const app = require("express")();
const bodyParser = require("body-parser");

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

app.post("/api/posts", (req, res) => {
  console.log("New Post : ", req.body);
  res.status(201).json({ message: "Post was successfully Created" });
});

app.get("/api/posts", (req, res) => {
  const posts = [
    {
      id: "dgg3h2h3",
      title: "First Post",
      content: "This is the first post's content",
    },
    {
      id: "467dhfjj3",
      title: "Second Post",
      content: "This is the second post's content",
    },
  ];

  res.status(200).json({ posts });
});

module.exports = app;
