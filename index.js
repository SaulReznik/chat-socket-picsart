const socket = require('socket.io');
const { MessageModel } = require('@saulreznik/chat-mongo-models');
const mongoose = require('mongoose');

const { authValidation } = require('./middlewares');
const { PORT, DB_URI } = require('./config');

const io = socket.listen(PORT || 3002);

//MongoDB connection
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
