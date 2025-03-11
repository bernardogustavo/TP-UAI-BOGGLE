document.addEventListener("DOMContentLoaded", function() {
    var formInicio = document.getElementById("formInicio");
    var seccionInicio = document.getElementById("inicio");
    var seccionJuego = document.getElementById("juego");
    var botonReset = document.getElementById("reset-tablero");
    var palabraFormada = [];
    var palabraFormadaStr = "";
    var palabrasEncontradas = [];
    var puntos = 0;
    var ultimaLetraSeleccionada = null;
    var tamañoTablero = 4; // Tamaño predeterminado
    var tiempoJuego = 60;  // Tiempo predeterminado
    var botonEnviarPalabra = document.getElementById("enviar-palabra");
    var botonBorrarSeleccion = document.getElementById("borrar-seleccion");

    botonEnviarPalabra.addEventListener("click", function() {
        if (palabraFormadaStr.length >= 3) {
            validarPalabra(palabraFormadaStr);
            palabraFormada = [];
            palabraFormadaStr = "";
            document.getElementById("palabra").textContent = "";
            actualizarPosiblesSeleccion();
            limpiarSeleccionadas();
        } else {
            mostrarModalValidacion("La palabra debe tener al menos 3 letras.");
        }
    });

    botonBorrarSeleccion.addEventListener("click", function() {
        palabraFormada = [];
        palabraFormadaStr = "";
        document.getElementById("palabra").textContent = "";
        actualizarPosiblesSeleccion();
        limpiarSeleccionadas();
    });

    function limpiarSeleccionadas() {
        var letras = document.querySelectorAll(".letra");
        letras.forEach(function(letra) {
            letra.classList.remove("letra-seleccionada", "letra-ultima-seleccionada", "letra-posible-seleccion");
        });
    }
    
    // Modales
    var modalValidacion = document.getElementById("modal-validacion");
    var modalTiempo = document.getElementById("modal-tiempo");
    var modalMensajeValidacion = document.getElementById("modal-mensaje-validacion");
    var closeValidacion = document.getElementById("close-validacion");
    var closeTiempo = document.getElementById("close-tiempo");

    closeValidacion.onclick = function() {
        modalValidacion.style.display = "none";
    }

    closeTiempo.onclick = function() {
        modalTiempo.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modalValidacion) {
            modalValidacion.style.display = "none";
        }
        if (event.target == modalTiempo) {
            modalTiempo.style.display = "none";
        }
    }

    formInicio.addEventListener("submit", function(event) {
        event.preventDefault();
        var nombre = document.getElementById("nombre").value;
        tamañoTablero = parseInt(document.getElementById("tamanoTablero").value.split('x')[0]);
        tiempoJuego = parseInt(document.getElementById("tiempoJuego").value);

        if (nombre.length >= 3) {
            seccionInicio.style.display = "none";
            seccionJuego.style.display = "block";
            iniciarJuego(nombre);
        } else {
            mostrarModalValidacion("El nombre debe tener al menos 3 letras.");
        }
    });

    botonReset.addEventListener("click", function() {
        crearTablero(); // Resetear el tablero
    });

    function iniciarJuego(nombre) {
        console.log("Juego iniciado para " + nombre);
        crearTablero();
        iniciarTemporizador();
    }

    function crearTablero() {
        var tablero = document.getElementById("tablero");
        tablero.innerHTML = ""; // Limpiar tablero
        
        var vocales = "AEIOU";
        var consonantes = "BCDFGHJKLMNPQRSTVWXYZ";
        var totalLetras = tamañoTablero * tamañoTablero;
        
        // Calcular la cantidad de vocales y consonantes necesarias
        var cantidadVocales = Math.ceil(totalLetras / 2);
        var cantidadConsonantes = totalLetras - cantidadVocales;
    
        // Crear listas de letras
        var letras = [];
        for (var i = 0; i < cantidadVocales; i++) {
            letras.push(vocales.charAt(Math.floor(Math.random() * vocales.length)));
        }
        for (var i = 0; i < cantidadConsonantes; i++) {
            letras.push(consonantes.charAt(Math.floor(Math.random() * consonantes.length)));
        }
    
        // Mezclar el array de letras
        letras = mezclarArray(letras);
    
        // Crear celdas en el tablero
        for (var i = 0; i < totalLetras; i++) {
            var letra = letras[i];
            var celda = document.createElement("div");
            celda.textContent = letra;
            celda.classList.add("letra");
            celda.dataset.index = i;
            celda.addEventListener("click", seleccionarLetra);
            tablero.appendChild(celda);
        }
    
        // Ajustar el estilo del tablero basado en el tamaño
        tablero.style.gridTemplateColumns = `repeat(${tamañoTablero}, 1fr)`;
        tablero.style.gridTemplateRows = `repeat(${tamañoTablero}, 1fr)`;
    }
    
    function seleccionarLetra(event) {
        var celda = event.target;
        var letra = celda.textContent;
        var index = parseInt(celda.dataset.index);

        if (!celda.classList.contains("letra-seleccionada") && esSeleccionValida(index)) {
            palabraFormada.push(letra);
            palabraFormadaStr = palabraFormada.join("");
            document.getElementById("palabra").textContent = palabraFormadaStr;

            celda.classList.add("letra-seleccionada");
            if (ultimaLetraSeleccionada) {
                ultimaLetraSeleccionada.classList.remove("letra-ultima-seleccionada");
            }
            celda.classList.add("letra-ultima-seleccionada");
            ultimaLetraSeleccionada = celda;

            actualizarPosiblesSeleccion();
        }
    }

    function esSeleccionValida(index) {
        if (palabraFormada.length === 0) {
            return true;
        }
        var ultimaIndex = parseInt(ultimaLetraSeleccionada.dataset.index);
        var filas = tamañoTablero;
        var columnas = tamañoTablero;

        var filaActual = Math.floor(index / columnas);
        var columnaActual = index % columnas;
        var filaUltima = Math.floor(ultimaIndex / columnas);
        var columnaUltima = ultimaIndex % columnas;

        return Math.abs(filaActual - filaUltima) <= 1 && Math.abs(columnaActual - columnaUltima) <= 1;
    }

    function actualizarPosiblesSeleccion() {
        var letras = document.querySelectorAll(".letra");
        letras.forEach(function(letra) {
            letra.classList.remove("letra-posible-seleccion");
        });

        if (ultimaLetraSeleccionada) {
            var index = parseInt(ultimaLetraSeleccionada.dataset.index);
            var filas = tamañoTablero;
            var columnas = tamañoTablero;

            var filaUltima = Math.floor(index / columnas);
            var columnaUltima = index % columnas;

            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    var fila = filaUltima + i;
                    var columna = columnaUltima + j;
                    if (fila >= 0 && fila < filas && columna >= 0 && columna < columnas) {
                        var vecinoIndex = fila * columnas + columna;
                        var vecino = document.querySelector(`[data-index='${vecinoIndex}']`);
                        if (vecino && !vecino.classList.contains("letra-seleccionada")) {
                            vecino.classList.add("letra-posible-seleccion");
                        }
                    }
                }
            }
        }
    }

    function validarPalabra(palabra) {
        console.log("Validando palabra:", palabra);
    
        // Verificar si la palabra ya ha sido encontrada
        if (palabrasEncontradas.includes(palabra)) {
            mostrarModalValidacion("La palabra ya fue encontrada.");
            console.log("La palabra ya fue encontrada:", palabra);
            return;
        }
    
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${palabra}`)
            .then(response => response.json())
            .then(data => {
                if (!data.title || data.title !== "No Definitions Found") {
                    mostrarModalValidacion("¡Palabra válida!");
                    puntos += palabra.length;
                    palabrasEncontradas.push(palabra);
                    console.log("Palabra válida y añadida:", palabra);
                    actualizarListadoPalabras();
                } else {
                    mostrarModalValidacion("Palabra inválida.");
                    if (puntos == 0) {
                        puntos -= 0;
                    }
                    else {
                        puntos -= 1;
                    }
                    console.log("Palabra inválida:", palabra);
                }
                actualizarPuntos();
                console.log("Lista de palabras encontradas:", palabrasEncontradas);
            })
            .catch(error => {
                console.error('Error al validar la palabra:', error);
                mostrarModalValidacion("Error al validar la palabra.");
            });
    }

// Función para manejar la visibilidad del botón según el tamaño de la pantalla
function manejarBotonModal() {
    const btnModal = document.getElementById("btnModalPalabras");
    if (window.innerWidth <= 768) {
        btnModal.style.display = 'block';
    } else {
        btnModal.style.display = 'none';
    }
}

// Función para actualizar el listado de palabras
function actualizarListadoPalabras() {
    const ul = document.getElementById("listaPalabras");
    const modalLista = document.getElementById("modalListaPalabras");
    const modal = document.getElementById("modalPalabras");

    ul.innerHTML = '';
    modalLista.innerHTML = '';

    palabrasEncontradas.forEach((palabra) => {
        const li = document.createElement('li');
        li.textContent = palabra;
        ul.appendChild(li);

        const modalLi = document.createElement('li');
        modalLi.textContent = palabra;
        modalLista.appendChild(modalLi);
    });

    manejarBotonModal();

    const btnModal = document.getElementById("btnModalPalabras");
    btnModal.onclick = function() {
        modal.style.display = "block";
    }

    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

window.addEventListener('load', manejarBotonModal);

window.addEventListener('resize', manejarBotonModal);

    function actualizarPuntos() {
        document.getElementById("puntos").textContent = puntos;
    }

    function mostrarModalValidacion(mensaje) {
        modalMensajeValidacion.textContent = mensaje;
        modalValidacion.style.display = "block";
    }

    function mezclarArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function iniciarTemporizador() {
        var tiempoRestante = tiempoJuego;
        var contador = document.getElementById("contador");
        contador.textContent = tiempoRestante;
        var intervalId = setInterval(function() {
            tiempoRestante--;
            contador.textContent = tiempoRestante;
            if (tiempoRestante <= 0) {
                clearInterval(intervalId);
                mostrarModalTiempo("¡Se acabó el tiempo!");
            }
        }, 1000);
    }

    function mostrarModalTiempo(mensaje) {
        var modalMensajeTiempo = document.getElementById("modal-mensaje-tiempo");
        modalMensajeTiempo.textContent = mensaje;
        modalTiempo.style.display = "block";
    }

    document.getElementById("formCorreo").onsubmit = function(event) {

        event.preventDefault();
        
        var nombre = document.getElementById("nombre").value;
        var email = document.getElementById("email").value;
        var mensaje = document.getElementById("mensaje").value;
        
        var mailtoLink = "mailto:example@example.com" + 
                         "?subject=Invitación de " + encodeURIComponent(nombre) +
                         "&body=" + encodeURIComponent("Nombre: " + nombre + "\nEmail: " + email + "\n\nMensaje:\n" + mensaje);
        
        window.location.href = mailtoLink;
    };

});
