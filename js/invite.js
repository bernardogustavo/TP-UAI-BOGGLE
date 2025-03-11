function validarNombre(nombre) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(nombre);
}

function validarCorreo(correo) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
}


document.getElementById("formCorreo").onsubmit = function(event) {
    event.preventDefault();

    var nombre = document.getElementById("nombre").value;
    var email = document.getElementById("email").value;
    var mensaje = document.getElementById("mensaje").value;

    if (!validarNombre(nombre)) {
        alert("El nombre no debe contener números ni símbolos.");
        return;
    }

    if (!validarCorreo(email)) {
        alert("El correo debe contener al menos un '@' y un '.'");
        return;
    }

    if (mensaje.length < 6) {
        alert("El mensaje debe tener más de 5 caracteres.");
        return;
    }

    var mailtoLink = "mailto:example@example.com" + 
                     "?subject=Invitación de " + encodeURIComponent(nombre) +
                     "&body=" + encodeURIComponent("Nombre: " + nombre + "\nEmail: " + email + "\n\nMensaje:\n" + mensaje);
    
    window.location.href = mailtoLink;
};
