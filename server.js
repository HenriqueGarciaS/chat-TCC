const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


let mensagens = [];
let usuariosConectados = [];

io.on("connection",socket => {

    socket.emit('ultimasMensagens',mensagens);

    socket.on('sendMessage', envio =>{
        mensagens.push(envio);
        console.log(mensagens);
        socket.broadcast.emit('mensagemRecevida',envio);
    })

    socket.on('usuarioConectado',nome => {
        if(nome == null)
        console.log("usuario não logado conectado");
        else{
        console.log("usuario conectado");
        let novoUsuario = {
            nome:nome,
            socketId:socket.id
        }
        let index = usuariosConectados.findIndex((usuario => usuario.nome == nome));

        if(index == -1)
            usuariosConectados.push(novoUsuario);
        else
            usuariosConectados[index].socketId = socket.id;

        console.log(usuariosConectados);
    }
    })


});

server.listen(3002);