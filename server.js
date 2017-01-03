var express = require('express');
var session = require('cookie-session');
var app = express();
var elements = ['caca', 'pipi'];

app.configure(function(){
	app.use(express.bodyParser());
  	app.use(session({ secret: 'adsqw231wqd'}));
});

app.use(function(req, res, next){
    if (typeof(req.session.elements) == 'undefined') {
        req.session.elements = [];
    }
    next();
})


app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.render('room.ejs', {elements : req.session.elements});
	res.end();
})
.post('/', function (req, res) {
	req.session.elements.push(req.body.el);
	res.redirect('/');
})
.get('/delete/:id', function(req, res){
	req.session.elements.splice(req.params.id, 1);
	res.redirect('/');
});

app.listen(8090);