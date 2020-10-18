const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


let mensagens = [];

io.on("connection",socket => {

    socket.emit('ultimasMensagens',mensagens);

    socket.on('sendMessage', envio =>{
        mensagens.push(envio);
        console.log(mensagens);
        socket.broadcast.emit('mensagemRecevida',envio);
    })
});

server.listen(3002);