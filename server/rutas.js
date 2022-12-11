const express = require("express");
const router = express.Router();

const mensajes = [
    {
        _id : "1",
        user : "boy",
        mensaje : "Hola!"   
    },
    {
        _id : "2",
        user : "candy-2",
        mensaje : "Estrella" ,
        foto : "../img/christmas-icons/star.png"  
    }
    ,
    {
        _id : "3",
        user : "coffee",
        mensaje : "Londres, Inglaterra.",
        lat : "51.5085300",
        lng : "-0.1257400"
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
        lng: req.body.lng,
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