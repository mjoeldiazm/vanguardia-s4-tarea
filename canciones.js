const express = require("express");
const router = express.Router();
const path = require("path");

const publicPath = '/public';

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, `${publicPath}/canciones.html`));
});

module.exports = router;
