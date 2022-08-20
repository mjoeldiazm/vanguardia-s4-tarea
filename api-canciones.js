const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

mongoose
  .connect(
    "mongodb+srv://sa:control@vanguardiadb.oqvomqe.mongodb.net/vanguardia?retryWrites=true&w=majority"
  )
  .catch((error) => console.error(error));

const cancionSchema = new mongoose.Schema(
  {
    _id: Number,
    nombre: String,
    artista: String,
    album: String,
    anio: Number,
    pais: String,
  },
  {
    collection: "canciones",
  }
);

const Cancion = mongoose.model("cancion", cancionSchema);

router.get("/api/canciones", function (req, res) {
  Cancion.find((err, artistas) => {
    if (err) res.status(500).send("Error en la base de datos.");
    else res.status(200).json(artistas);
  });
});

router.get("/api/canciones/porartista/:artista", function (req, res) {
  Cancion.find({ artista: req.params.artista }, function (err, artistas) {
    if (err) {
      console.log(err);
      res.status(500).send("Error al leer de la base de datos.");
    } else res.status(200).json(artistas);
  });
});

router.get("/api/canciones/poranio", function (req, res) {
  Cancion.find({ anio: { $gte: req.query.anio } }, function (err, artistas) {
    if (err) {
      console.log(err);
      res.status(500).send("Error al leer de la base de datos.");
    } else res.status(200).json(artistas);
  });
});

router.get("/api/canciones/entreanios", function (req, res) {
  Cancion.find(
    {
      $and: [
        { anio: { $gte: req.query.desde } },
        { anio: { $lte: req.query.hasta } },
      ],
    },
    function (err, artistas) {
      if (err) {
        console.log(err);
        res.status(500).send("Error al leer de la base de datos.");
      } else res.status(200).json(artistas);
    }
  );
});

router.get("/api/canciones/:id", function (req, res) {
  Cancion.findById(req.params.id, function (err, artista) {
    if (err) res.status(500).send("Error en la base de datos.");
    else {
      if (artista != null) {
        res.status(200).json(artista);
      } else res.status(404).send("No se encontro esa canción.");
    }
  });
});

router.post("/api/canciones", function (req, res) {
  var nuevoId;
  const minQuery = Cancion.find({})
    .sort({ _id: -1 })
    .limit(1)
    .then((canciones) => {
      nuevoId = parseInt(canciones[0].id) + 1;
      const cancion1 = new Cancion({
        _id: nuevoId,
        nombre: req.body.nombre,
        artista: req.body.artista,
        album: req.body.album,
        anio: req.body.anio,
        pais: req.body.pais,
      });
      cancion1.save(function (error, cancion1) {
        if (error) {
          console.log(error);
          res.status(500).send("No se ha podido agregar.");
        } else {
          res.status(200).json(cancion1);
        }
      });
    });
});

router.put("/api/canciones/:id", function (req, res) {
  Cancion.findById(req.params.id, function (err, cancion) {
    if (err) res.status(500).send("Error en la base de datos.");
    else {
      if (cancion != null) {
        cancion.nombre = req.body.nombre;
        cancion.artista = req.body.artista;
        cancion.album = req.body.album;
        cancion.anio = req.body.anio;
        cancion.pais = req.body.pais;
        cancion.save(function (error, cancion1) {
          if (error) res.status(500).send("Error en la base de datos.");
          else {
            res.status(200).send("Modificado exitosamente.");
          }
        });
      } else res.status(404).send("No se encontro esa cancion.");
    }
  });
});

router.delete("/api/canciones/:id", function (req, res) {
  Cancion.findById(req.params.id, function (err, cancion) {
    if (err) res.status(500).send("Error en la base de datos.");
    else {
      if (cancion != null) {
        cancion.remove(function (error, result) {
          if (error) res.status(500).send("Error en la base de datos.");
          else {
            res.status(200).send("Eliminado exitosamente.");
          }
        });
      } else res.status(404).send("No se encontro esa cancion.");
    }
  });
});

module.exports = router;
