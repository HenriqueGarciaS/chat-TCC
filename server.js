const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const axios = require('axios');


let usuariosConectados = [];




io.on("connection",socket => {
    let mensagens = [];
    let sala;

    objectToString = (obj) => {
        str = obj.map(obj => {
            return obj.usuario + ":" + obj.mensagem;
        })
        return str;
    }

    socket.on('sendMessage', envio =>{
        mensagens.push(envio);
        let updateChat ={ 
            mensagens : objectToString(mensagens).toString()
        };
        axios.post('http://localhost:3001/updateChat/'+sala,updateChat).then(res =>{
            socket.to(sala).broadcast.emit('mensagemRecevida',envio);
        }).catch(error => {
            console.log(error.data);
        });
    })

    socket.on('entrarSala',nomeDaSala =>{
        sala = nomeDaSala;
        console.log('usuario entrando na sala:'+nomeDaSala);
        socket.join(nomeDaSala);
        axios.get('http://localhost:3001/chat/'+sala).then(res =>{
            let ultimasMensagens = res.data;
            ultimasMensagens = ultimasMensagens.split(",");
            mensagens = ultimasMensagens.map(mensagem => {
                mensagem = mensagem.split(":");
                return {
                    usuario: mensagem[0],
                    mensagem : mensagem[1]
                }
            })
            console.log(mensagens);
            socket.emit('mensagensAntigas',mensagens);
        }).catch(error => {
            console.log(error);
        })
    })


    socket.on('usuarioConectado',nome => {
        if(nome == null)
        return 0;
        else{
        let novoUsuario = {
            nome:nome,
            socketId:socket.id
        }
        let index = usuariosConectados.findIndex((usuario => usuario.nome == nome));

        if(index == -1)
            usuariosConectados.push(novoUsuario);
        else
            usuariosConectados[index].socketId = socket.id;

    }
    })


});

server.listen(3002);