const httpServer = require('http').createServer();
const socket = require('socket.io');
const { MessageModel } = require('chat-mongo-models-picsart');
const mongoose = require('mongoose');

const { authValidation } = require('./middlewares');
const { PORT, DB_URI } = require('./config');

const io = socket(httpServer, {
  cors: {
    origin: `https://chat-web-picsart.herokuapp.com`
  }
});

//MongoDB connection
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

io.set('origins', '*:*');

//Middlewares
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
