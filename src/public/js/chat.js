const socket = io()

const form = document.getElementById('form-msg')
const msgs = document.getElementById('all-msg')

let user  




//Identificar usuario
Swal.fire({
    title: "Ingresa tu Nombre",
    input: "text",
    text: "Ingresa el usuario para registrarte en el chat",
    inputValidator: (value)=>{
        return !value && "Necesitas escribir un nombre para continuar"
    },
    allowOutsideClick: false,
}).then((result)=>{ 
    user = result.value
    socket.emit("nuevo-usuario", user)
})


//Recolectar información del campo de entrada
form.addEventListener('submit', (e)=>{
    if(!user) return
    e.preventDefault()
    const input = form[0]
    console.log(input.value)
    if(!input.value.trim().length) return;
    socket.emit("new-msg", {user, message: input.value})
    input.value = ""
})

//Display de mensajes en DOM
socket.on("msg-logs",(data)=>{
    if(!data.length) return
    let logs = ""
    data.forEach(msg => {
        logs += `<div><br> Usuario: ${msg.user}: <br> <p class="text-primary"> mensaje: ${msg.message}</p></div>`
    })
    msgs.innerHTML = logs
} )

//Alerta de usuario conectado
socket.on("nuevo-usuario", (user) =>{
    if(!user) return
    Swal.fire({
        text: `${user} se ha unido al Chat!`,
        toast: true,
        position: "bottom-right"
    })
})