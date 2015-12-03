var port = 9000;

var express = require('express');
var path = require("path");
var app = express();
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'app')));

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port);
console.log('Server running on port 9000.');