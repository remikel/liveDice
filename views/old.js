var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var session = require('cookie-session');

// Chargement du fichier index.html affiché au client
var server = app.listen(8090);

// Chargement de socket.io
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
        socket.join('caca');
        console.log(room);
        // socket.broadcast.to(room).emit('test','test');
        socket.on('launch', function(dices)
        {
            console.log('caca');
            socket.in('caca').emit('test', 'what is going on, party people?');
        });
    });
    res.end();
}); 

room = "abc123";
io.sockets.in(room).emit('test', 'what is going on, party people?');
io.sockets.in(room).on('launch', function(dices)
{
    console.log(dices);
});

// this message will NOT go to the client defined above
io.sockets.in('foobar').emit('message', 'anyone in this room yet?');


// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {

    // socket.on('pseudo',function(pseudo){
    // 	socket.pseudo = pseudo;
    // 	socket.broadcast.emit('message', pseudo + " vient de se connecter");
    // });
    // socket.on('message',function(message){
    // 	socket.broadcast.emit('message', socket.pseudo + " : " + message);
    // });
    socket.on('connection',function(form){
        console.log(form);
        // socket.broadcast.emit('message', socket.pseudo + " : " + message);
    });
});

// app.listen(8090);