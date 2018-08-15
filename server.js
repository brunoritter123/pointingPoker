'use strict';
const express = require('express');
const http = require('http');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/dist'))
app.get('/*', (req,res) => res.sendFile(path.join(__dirname)));
const server = http.createServer(app);

server.listen(port, () => console.log('Running...'));
let io = require('socket.io').listen(server);

let users  = []
const votoNull = {value: null, label: null, type: null};
const cartas = [
  {value: 1 , label: '1'  , type: 'default'},
  {value: 2 , label: '2'  , type: 'default'},
  {value: 3 , label: '3'  , type: 'default'},
  {value: 5 , label: '5'  , type: 'default'},
  {value: 8 , label: '8'  , type: 'default'},
  {value: 13 , label: '13', type: 'default'},
  {value: 21 , label: '21', type: 'default'},
  {value: 54 , label: '54', type: 'default'},
  {value: undefined   , label: '?'},
]

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    users.forEach(function(us) {
      if (us.id == socket.handshake.address) {
        us.status = "OFF"
      }
    });
    io.emit('get-user', users);
  });

  socket.on('add-voto', (carta) => {
    let acabouJogo = true;
    users.forEach( (user) => {
      if(user.id == socket.handshake.address) {
        user.voto = carta;
      }
      if(user.isJogador && !user.voto.label) {
        acabouJogo = false;
      }
    });

    io.emit('get-user', users);
    if(acabouJogo) {
      io.emit('get-FimJogo', true);
    }
  });

  socket.on('add-user', (userName, isJogador) => {
    let achou = false;

    users.forEach(function(us) {
      if (us.id == socket.handshake.address) {
        let oldSocket = us.socket;

        us.nome = userName;
        us.isJogador = isJogador;
        us.status = "ON";
        us.socket = socket.id
        achou = true;
        io.to(oldSocket).emit('disconnect');
      }
    });

    if (!achou) {
      users.push({id: socket.handshake.address, status: "ON", socket: socket.id, nome: userName, isJogador: isJogador, voto: votoNull});
    }

    io.emit('get-user', users);
  });

  socket.on('obs-cartas', () => {
    io.emit('get-cartas', cartas);
  });

  socket.on('add-FimJogo', (fimJogo) => {
    io.emit('get-FimJogo', fimJogo);
    if (!fimJogo) {
      users.forEach( (user) => {
        (user.voto = votoNull)
      });
      io.emit('get-user', users);
    }
  });

});

server.listen(3000, () => {
  console.log('started on port 3000');
});