const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http=require('http');
const { Server } = require("socket.io");
const { addMessage } = require('./controllers/messageControllers');
const { timeStamp } = require('console');


//dotenv in our server.js
dotenv.config();


const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    
    }
})
const port = process.env.PORT || 3000;


//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


//Routes in server file
app.use('/api/messages', require('./routes/messageRoutes'));


//root route
app.get('/', (req,res) =>{
    res.send({
        message: 'Chat API Server',
        version: '1.0.0',
        endPoints:{
            getMessages: 'GET /api/messages/getMessages',
            createMessage: 'POST /messages/createMessage',
            deleteAllMessages: 'DELETE /messages/deleteAllMessages',
            testClient: 'GET /index.html'
        }
    })
})

//socket connection in backend
io.on('connection', (socket) =>{
    console.log( "User socket ID is :", socket.id)

    //connect functionality by server
    socket.emit('message', {
        user: "System",
        text: "Welcome to the chat",
        timeStamp: new Date().toISOString()
    })

    socket.broadcast.emit('message', {
        user: "System",
        text: "A new user joined the chat",
        timeStamp: new Date().toISOString()

    })

    // disconnect functionality by server
    socket.on('disconnect', () => {
        console.log("user disconnected", socket.id);
        io.emit('message', {
            user:'System',
            text: 'A user left the chat',
            timeStamp: new Date().toISOString()
        })
    })

    // Typing functionality in back end
    socket.on('typing', (data) =>{
        socket.broadcast.emit('userTyping', data);
    });
    //send and receive messages
    socket.on("sendMessage", (data) => {
        const newMessage = addMessage(data);

        io.emit('receiveMessage', newMessage);
    })
});

//test route
// app.get('/test', (req,res) =>{
//     res.json({
//         message: 'Hello World',
//         timeStamp: new Date(),
//         status: 'success'
//     })
// })

// error handling
app.use((req, res) =>{
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

app.use((err, req, res, next) =>{
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: 'Route not found',
        error: err.message
    });
});


server.listen(port, () => {
    console.log(`Server is running at port number ${port}`);
    console.log(`🔌Socket.io enabled`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
})