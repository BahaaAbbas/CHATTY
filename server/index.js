require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoute')
const socket = require('socket.io');



const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('DB connected Successfuly!')
}).catch((err) => {
    console.log(err.message)
})

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`)
})


const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', data.message);

        }
    })
});

