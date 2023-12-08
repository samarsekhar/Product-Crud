const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");

// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

// Insert an user into database route
router.post("/add", upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    image: req.file.filename,
  });
  throw user.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "User added successfully!",
      };
      res.redirect("/");
    }
  });
});

router.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

router.get("/add", (req, res) => {
  res.render("add-users", {
    title: "Add Users",
  });
});

module.exports = router;
