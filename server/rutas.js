const express = require("express");
const router = express.Router();

const mensajes = [
    {
        _id : "1",
        user : "boy",
        mensaje : "Mensaje #1"   
    },
    {
        _id : "2",
        user : "candy-2",
        mensaje : "Mensaje #2"   
    }
    ,
    {
        _id : "3",
        user : "coffee",
        mensaje : "Mensaje #3" 
    }
];

router.get("/", (req, res) => {
    res.json(mensajes);
});

router.post("/", (req, res) => {
    const mensaje = {
        mensaje : req.body.mensaje,
        user : req.body.user,
        lat: req.body.lat,
        lng: req.body.long,
        foto: req.body.foto
    }


    mensajes.push(mensaje);

    console.log("Mis mensajes ", mensajes);

    res.json({
        ok : true,
        mensaje : mensaje
    });
});

module.exports = router;