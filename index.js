// const http = require('http');
// const socket = require('socket.io');
// const cors = require('cors');
// const express = require('express');
// const { MessageModel } = require('chat-mongo-models-picsart');
// const mongoose = require('mongoose');

// const { authValidation } = require('./middlewares');
// const { PORT, DB_URI } = require('./config');

// const app = express();
// const server = http.createServer(app);

// //MongoDB connection
// mongoose.connect(DB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// //Middlewares
// app.all('/', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With');
//   next();
// });
// io.use(authValidation);

// app.get('/', (req, res) => {
//   res.json('Test');
// });

// const io = socket(server);
// io.set('transports', ['websocket']);

// io.on('connection', async socket => {
//   try {
//     const messagesDB = await MessageModel.find();
//     const messages = messagesDB.map(item => item.message);

//     socket.emit('connected', {
//       user: socket.decoded.username,
//       messages
//     });

//     socket.on('sendMessage', async message => {
//       try {
//         const Message = new MessageModel({ message });
//         await Message.save();

//         io.emit('newMessage', message);
//       } catch (err) {
//         console.log(err);
//       }
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// httpServer.listen(PORT, () => {
//   console.log(`sockets running on port ${PORT}`);
// });
'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', socket => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
