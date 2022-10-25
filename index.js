const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("node:crypto");
const path = require("node:path");

const app = express();

let blogs = [];
let blogId = 1;
const users = [
  { name: "user", password: "1234" },
  { name: "admin", password: randomBytes(25).toString("hex"), is_admin: true },
];

const findUser = ({ name = "", password = "" }) => {
  let result = users.filter(
    (usr) => usr.name === name && usr.password === password
  );

  return result.length === 1 ? result[0] : null;
};

const mergeObject = (target, source) => {
  for (let key in source) {
    if (typeof target[key] === "object" && typeof source === "object") {
      mergeObject(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
};

const isObject = (value) => typeof value === "object" && !Array.isArray(value);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "./index.html"));
});

app.get("/api", (req, res) => {
  res.status(200).send({ data: blogs });
});

app.post("/api", (req, res) => {
  let user = findUser(req.body.user || {});

  if (!user) {
    return res.status(403).send({
      success: false,
      err: "Forbidden access",
    });
  }

  let blog = {
    content: "Blog post",
  };

  blog = mergeObject(blog, {
    id: blogId++,
    date: Date.now(),
    user: user.name,
    ...(isObject(req.body.blog) ? req.body.blog : { content: req.body.blog }),
  });

  blogs.push(blog);

  res.status(200).send({
    success: true,
  });
});

app.delete("/api", (req, res) => {
  const user = findUser(req.body.user || {});

  if (!user || !user.is_admin) {
    return res.status(403).send({
      success: false,
      err: "Forbidden access",
    });
  }

  blogs = blogs.filter((blog) => blog.id !== req.body.blog);
  res.status(200).send({ success: true });
});

app.listen(4848, () => {
  console.log("Local: http://localhost:4848");
});
