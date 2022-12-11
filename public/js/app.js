var url = window.location.href;
var swLocation = '/proyecto-pwa-entrega/sw.js';

if (navigator.serviceWorker) {
    if (url.includes('localhost')) {
        swLocation = '/sw.js';
    }
    navigator.serviceWorker.register(swLocation);
}

// Referencias de jQuery
var titulo = $('#titulo');
var tituloModalIcono = $('#titulo-modal-icono');
var nuevoBtn = $('#nuevo-btn');
var salirBtn = $("#salir-btn");
var cancelarBtn = $('#cancel-btn');
var postMensajeBtn = $('#post-mensaje-btn');
var postFotoBtn = $('#post-foto-btn');
var postGeoBtn = $('#post-geo-btn');
var avatarSel = $('#seleccion');

var timelineMensajes = $('#timeline-mensajes');
var timelineFotos = $('#timeline-fotos');
var timelineGeos = $('#timeline-geos');

var modal = $('#modal');
var modalAvatar = $('#modal-icono');
var avatarBtns = $('.seleccion-icono');
var txtMensaje = $('#txtMensaje');

var contenidoIconos = $("#contenido-iconos");
// El usuario, contiene el ID del icono seleccionado
var usuario;

//==================FUNCIONES=======================
function crearMensajeHTML(mensaje, personaje) {

    var content = `
    <li class="animated fadeIn fast"
        data-user="${personaje}"
        data-mensaje="${mensaje}"
        data-tipo="mensaje">


        <div class="icono-mensaje">
            <img src="../img/christmas-icons/${personaje}.png">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3 class="texto-rojo">@${personaje}</h3>
                <br/>
                <p class="texto-verde">${mensaje}</p>
            </div>        
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timelineMensajes.prepend(content);
    cancelarBtn.click();

}

function crearMensajeFotoHTML(mensaje, personaje, foto) {

    var content = `
    <li class="animated fadeIn fast"
        data-user="${personaje}"
        data-mensaje="${mensaje}"
        data-tipo="mensaje">


        <div class="icono-mensaje">
            <img src="../img/christmas-icons/${personaje}.png">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3 class="texto-rojo">@${personaje}</h3>
                <br/>
                <p class="texto-verde">${mensaje}</p>
                `;

    if (foto) {
        content += `
                <br>
                <img class="foto-mensaje" src="${foto}" style="width: 300; height:300px;">
        `;

    }

    content += `</div>        
                <div class="arrow"></div>
            </div>
        </li>
    `;

    timelineFotos.prepend(content);
    cancelarBtn.click();

}

function crearMensajeGeoHTML(mensaje, personaje, lat, lng) {

    var content = `
    <li class="animated fadeIn fast"
        data-user="${personaje}"
        data-mensaje="${mensaje}"
        data-tipo="mensaje">


        <div class="icono-mensaje">
            <img src="../img/christmas-icons/${personaje}.png">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3 class="texto-rojo">@${personaje}</h3>
                <br/>
                <p class="texto-verde">${mensaje}</p>
                </div>        
                <div class="arrow"></div>
            </div>
        </li>
    `;


    // si existe la latitud y longitud, 
    // llamamos la funcion para crear el mapa
    if (lat) {
        crearMensajeMapa(lat, lng, personaje);
    }

    // Borramos la latitud y longitud 
    lat = null;
    lng = null;

    $('.modal-mapa').remove();

    timelineGeos.prepend(content);
    cancelarBtn.click();

}



// Globals
function logIn(ingreso) {

    if (ingreso) {
        nuevoBtn.removeClass('oculto'); //Muestra botón de nuevo mensaje
        salirBtn.removeClass('oculto'); //Muestra botón de salir
        timelineMensajes.removeClass('oculto'); //Muestra los mensajes
        timelineFotos.removeClass('oculto'); //Muestra los mensajes
        timelineGeos.removeClass('oculto'); //Muestra los mensajes
        contenidoIconos.addClass('oculto'); //Oculta los iconos 
        modalAvatar.attr('src', '../img/christmas-icons/' + usuario + '.png'); //Agrega icono al modal

    } else {
        nuevoBtn.addClass('oculto'); //Oculta botón de nuevo mensaje
        salirBtn.addClass('oculto'); //Oculta botón de salir
        timelineMensajes.addClass('oculto'); //Oculta los mensajes
        timelineFotos.addClass('oculto'); //Oculta los mensajes
        timelineGeos.addClass('oculto'); //Oculta los mensajes
        contenidoIconos.removeClass('oculto'); //Muestra los iconos 

        titulo.text('');

    }

}


// Seleccion de personaje
avatarBtns.on('click', function () {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function () {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function () {
    tituloModalIcono.text('@' + usuario);
    modal.removeClass('oculto');
    modal.animate({
        marginTop: '-=1000px',
        opacity: 1
    }, 200);
});

// Boton de cancelar mensaje
cancelarBtn.on('click', function () {
    if (!modal.hasClass('oculto')) {
        modal.animate({
            marginTop: '+=1000px',
            opacity: 0
        }, 200, function () {
            modal.addClass('oculto');
            txtMensaje.val('');
        });
    }
});


// Boton de enviar sólo mensaje
postMensajeBtn.on('click', function () {

    var mensaje = txtMensaje.val();
    if (mensaje.length === 0) {
        cancelarBtn.click();
        return;
    }

    var data = {
        user: usuario,
        mensaje: mensaje
    }

    fetch("/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(res => console.log("Funciona: ", res))
        .catch(error => console.log("Falla: ", error));

    crearMensajeHTML(mensaje, usuario);

});

// Boton de enviar sólo foto
postFotoBtn.on('click', function () {

    var mensaje = txtMensaje.val();
    if (mensaje.length === 0) {
        cancelarBtn.click();
        return;
    }

    var data = {
        user: usuario,
        mensaje: mensaje,
    }

    fetch("/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(res => console.log("Funciona: ", res))
        .catch(error => console.log("Falla: ", error));

    crearMensajeFotoHTML(mensaje, usuario, foto);

});

// Boton de enviar sólo foto
postGeoBtn.on('click', function () {

    var mensaje = txtMensaje.val();
    if (mensaje.length === 0) {
        cancelarBtn.click();
        return;
    }

    var data = {
        user: usuario,
        mensaje: mensaje,
    }

    fetch("/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(res => console.log("Funciona: ", res))
        .catch(error => console.log("Falla: ", error));

    crearMensajeGeoHTML(mensaje, usuario, lat, lng);

});

function listarMensajes() {
    fetch("/api")
        .then(res => res.json())
        .then(datos => {
            console.log(datos);
            datos.forEach(mensaje => {
                if (mensaje.foto == undefined && mensaje.lat == undefined && mensaje.lng == undefined) {
                    crearMensajeHTML(mensaje.mensaje, mensaje.user); //Propiedades que tiene el objeto mensajes al ser convertido a json
                } else if (mensaje.foto != undefined) {
                    crearMensajeFotoHTML(mensaje.mensaje, mensaje.user, mensaje.foto); //Propiedades que tiene el objeto mensajes al ser convertido a json
                } else if (mensaje.lat != undefined && mensaje.lng != undefined) {
                    crearMensajeGeoHTML(mensaje.mensaje, mensaje.user, mensaje.lat, mensaje.lng); //Propiedades que tiene el objeto mensajes al ser convertido a json
                }
            });
        });
}

listarMensajes();

//GEOLOCALIZACIÓN
var googleMapKey = 'AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8';
var btnLocation = $("#location-btn");
var modalMapa = $(".modal-mapa");
var lat = null;
var lng = null;
var foto = null;

btnLocation.on("click", () => {
    console.log("geolocalización");

    navigator.geolocation.getCurrentPosition(posicion => {

        console.log(posicion);
        mostrarMapaModal(posicion.coords.latitude, posicion.coords.longitude);

        lat = posicion.coords.latitude;
        lng = posicion.coords.longitude;
    });
});


function mostrarMapaModal(lat, lng) {

    $('.modal-mapa').remove();

    var content = `
            <div class="modal-mapa">
                <iframe
                    width="100%"
                    height="250"
                    frameborder="0"
                    src="https://www.google.com/maps/embed/v1/view?key=${googleMapKey}&center=${lat},${lng}&zoom=17" allowfullscreen>
                    </iframe>
            </div>
    `;

    modal.append(content);
}

function crearMensajeMapa(lat, lng, personaje) {


    let content = `
    <li class="animated fadeIn fast"
        data-tipo="mapa"
        data-user="${personaje}"
        data-lat="${lat}"
        data-lng="${lng}">
                <div class="icono-mensaje">
                    <img src="../img/christmas-icons/${personaje}.png">
                </div>
                <div class="bubble-container">
                    <div class="bubble">
                        <iframe
                            width="100%"
                            height="250"
                            frameborder="0" style="border:0"
                            src="https://www.google.com/maps/embed/v1/view?key=${googleMapKey}&center=${lat},${lng}&zoom=17" allowfullscreen>
                            </iframe>
                    </div>
                    
                    <div class="arrow"></div>
                </div>
            </li> 
    `;

    timelineGeos.prepend(content);
}

//CAMARA
var btnPhoto = $("#photo-btn");
var btnTomarFoto = $("#tomar-foto-btn");
var contenedorCamara = $(".camara-contenedor");
const camara = new Camara($("#player")[0]);

btnPhoto.on("click", () => {
    console.log("boton camara");
    contenedorCamara.removeClass("oculto");

    camara.encender();

});

btnTomarFoto.on("click", () => {
    foto = camara.tomarFoto();
    console.log(foto);
    camara.apagar();
});


function verificarConexion() {
    if (navigator.onLine) {
        console.log("Si hay conexión :)");
    } else {
        console.log("No hay conexión :(");
    }
}

window.addEventListener("online", verificarConexion);
window.addEventListener("offline", verificarConexion);