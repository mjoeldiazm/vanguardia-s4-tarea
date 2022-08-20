const canciones = require("./canciones");
const api_canciones = require("./api-canciones");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Servidor escuchando puerto ${port}.`);
});

app.use("/canciones", canciones);
app.use("/", api_canciones);

app.use(function (req, res, next) {
  res.status(404).send("El recurso solicitado no ha sido encontrado.");
});
