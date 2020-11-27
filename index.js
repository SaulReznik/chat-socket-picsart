const http = require('http');
const socket = require('socket.io');
const cors = require('cors');
const express = require('express');
const { MessageModel } = require('chat-mongo-models-picsart');
const mongoose = require('mongoose');

const { authValidation } = require('./middlewares');
const { PORT, DB_URI } = require('./config');

const app = express();
const server = http.createServer(app);

const io = socket(server, {
  cors: {
    origin: '*'
  }
});

//MongoDB connection
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Middlewares
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});
io.use(authValidation);

io.on('connection', async socket => {
  try {
    const messagesDB = await MessageModel.find();
    const messages = messagesDB.map(item => item.message);

    socket.emit('connected', {
      user: socket.decoded.username,
      messages
    });

    socket.on('sendMessage', async message => {
      try {
        const Message = new MessageModel({ message });
        await Message.save();

        io.emit('newMessage', message);
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

httpServer.listen(PORT, () => {
  console.log(`sockets running on port ${PORT}`);
});
