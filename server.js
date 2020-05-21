const express = require('express');
const path =require('path');
const http = require('http');
const app =new express();
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require('./utils/messages');

const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');
app.use(express.static(path.join(__dirname,'public')));

const botName = 'Admin';


io.on('connection',socket =>{
    //console.log("new connection>>>");
    socket.on('joinRoom',(username,room)=>{
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);

        socket.emit('message',formatMessage(botName,'Welcome to chatApp'));

    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

    io.to(user.room).emit('roomUsers',{
        room : user.room,
        users : getRoomUsers(user.room)
    });


    });
    
    
    socket.on('chatMessage',(msg)=>{
//console.log(msg);
const user = getCurrentUser(socket.id);
        io.to(user.name).emit('message',formatMessage(user.username,msg));
    });
    socket.on('disconnect',() =>{
        const user = userLeave(socket.id);
        if(user)
        {
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
        
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        });
    }
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT,() => console.log(`Server running on port ${PORT}`));