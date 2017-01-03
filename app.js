var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var session = require('cookie-session');

// Chargement du fichier index.html affiché au client
var server = app.listen(8090);

// Chargement de socket.io
var io = require('socket.io').listen(server);

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('login.ejs');
    res.end();
});

app.post('/', function(req, res) {
    res.redirect('diceroom');
});

app.get('/diceroom', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('diceroom.ejs');

    console.log(req.body);
    io.on('connection', function(socket){
    console.log(req.body);
    console.log('connection caca');
        socket.join('/caca');
    });
    res.end();
});

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('connected');
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