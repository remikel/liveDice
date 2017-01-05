var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var session = require('cookie-session');

// Chargement du fichier index.html affiché au client
var server = app.listen(8090);
var usernames = {};
var rooms = [];
var io = require('socket.io').listen(server);
app.use(express.bodyParser());
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('login.ejs');
    res.end();
});

app.post('/', function(req, res) {

    res.redirect(307, 'diceroom');
});

app.post('/diceroom', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('diceroom.ejs');
    io.sockets.on('connection', function(socket){
        var room = '/' + req.body.room;
        var username = req.body.nickname;
        rooms.push(room);
        socket.emit('updaterooms', rooms, socket.room);
        socket.username = username;
        socket.room = room;
        usernames[username] = username;
        console.log(socket);
        socket.join(room);
        socket.emit('updatechat', 'SERVER', 'you have connected to Lobby');
        socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');
        socket.emit('updaterooms', rooms, room);

            socket.on('adduser', function(username) {
                socket.username = username;
                socket.room = 'Lobby';
                usernames[username] = username;
                socket.join('Lobby');
                socket.emit('updatechat', 'SERVER', 'you have connected to Lobby');
                socket.broadcast.to('Lobby').emit('updatechat', 'SERVER', username + ' has connected to this room');
                socket.emit('updaterooms', rooms, 'Lobby');
            });

            socket.on('create', function(room) {
                rooms.push(room);
                socket.emit('updaterooms', rooms, socket.room);
            });

            socket.on('sendchat', function(data) {
                io.sockets["in"](socket.room).emit('updatechat', socket.username, data);
            });
            socket.on('launch', function(data) {
                // io.sockets["in"](socket.room).emit('test', {room : socket.room});

                socket.broadcast.to(socket.room).emit('test', {room : socket.room});
            });

            socket.on('switchRoom', function(newroom) {
                var oldroom;
                oldroom = socket.room;
                socket.leave(socket.room);
                socket.join(newroom);
                socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
                socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
                socket.room = newroom;
                socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
                socket.emit('updaterooms', rooms, newroom);
            });

            socket.on('disconnect', function() {
                delete usernames[socket.username];
                io.sockets.emit('updateusers', usernames);
                socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
                socket.leave(socket.room);
            });
            res.end();

    }); 

        }); 