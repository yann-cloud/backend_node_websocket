const express = require('express');
const { Server } = require ("socket.io");
const { v4: uuidV4 } = require ('uuid');
const http = require('http');
const jwt = require('jsonwebtoken');

// jwt secret
const JWT_SECRET = 'myRandomHash';

const app = express(); // initialize express

const server = http.createServer(app);

// set port to value receivedfrom environment variable or 8080 if null
const port = 5001;

//upgrade http server to websocket server
const io = new Server(server, {
    cors: ['http://localhost:8082'], //allow connection only from localhost
    credentials: true
});

const rooms = new Map();

io.use(async (socket, next) => {
  // fetch token from handshake auth sent by FE
  const token = socket.handshake.auth.token;
  try {
    // verify jwt token and get user data
    const user = await jwt.verify(token, JWT_SECRET);
    console.log('user', user);
    // save the user data into socket object, to be used further
    socket.user = user;
    next();
  } catch (e) {
    // if token is invalid, close connection
    console.log('error', e.message);
    return next(new Error(e.message));
  }
});

io.on('connection', (socket) => {
    // join user's own room
    socket.join(socket.user.id);
    socket.join('myRandomChatRoomId');
    // find user's all channels from the database and call join event on all of them.
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('my message', (msg) => {
      console.log('message: ' + msg);
      io.emit('my broadcast', `server: ${msg}`);
    });
  
    socket.on('join', (roomName) => {
      console.log('join: ' + roomName);
      socket.join(roomName);
    });
  
    socket.on('message', ({message, roomName}, callback) => {
      console.log('message: ' + message + ' in ' + roomName);
  
      // generate data to send to receivers
      const outgoingMessage = {
        name: socket.user.name,
        id: socket.user.id,
        message,
      };
      // send socket to all in room except sender
      socket.to(roomName).emit("message", outgoingMessage);
      callback({
        status: "ok"
      });
      // send to all including sender
      // io.to(roomName).emit('message', message);
    })
  });

server.listen(port, () =>{
    console.log(`listenning on *:${port}`);
});