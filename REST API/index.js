'use strict'

let dogs = require("./lib/dogs.js");

const express = require("express");
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/views')); // allows direct navigation to static files
app.use(require("body-parser").urlencoded({extended: true})); // parse form submissions

let handlebars =  require("express-handlebars")
.create({ defaultLayout: "main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.get('/get', function(req, res) { 
  res.render('get', {queryString: req.query.title, pageName: "get", title: "Get", dogsArray: dogs.getDog(req.query.title), allDogs: dogs.getAllDogs()} ); 
});

app.get('/delete', function(req, res) { 
  res.render('delete', {queryString: req.query.title, pageName: "delete", title: "Delete", deleteDog: dogs.deleteDog(req.query.title) }); 
});

app.get('/create', function(req, res) { 
  res.render('create', {queryString: req.query.title, queryStringTwo: req.query.color, queryStringThree: req.query.local, pageName: "create", title: "Create", createDog: dogs.create(req.query.title, req.query.color, req.query.local )}); 
});

app.get('/about', function(req, res) { 
  res.render('about', {pageName: "about", title: "About"} ); 
});

app.get('/', function(req, res) { 
  res.render('home', {pageName: "index", title: "Home" }); 
});

//REST API routes for find and delete
app.get('/api/dogs', function(req, res) { 
  res.send(dogs.getAllDogs() ); 
});

app.get('/api/dogs/:title', function(req, res) { 
        if (dogs.apiGetDog(req.params.title)){
    res.send(dogs.getDog(req.params.title)); 
    } else {
        res.send("<b>" + req.params.title+ "</b>" + " appears to not exist.");
    }
});

app.get('/api/dogs/delete/:title', function(req, res) { 
    if (dogs.apiGetDog(req.params.title)){
            dogs.deleteDog(req.params.title);
    res.send("<b>" + req.params.title+ "</b>" + " has been removed.");
    } else {
        res.send("<b>" + req.params.title+ "</b>" + " appears to not exist.");
    }
});

// define 404 handler
app.use(function(req,res) {
  res.render('404', {pageName: "404", title: "404 - cant find"} ); 
});

app.listen(app.get('port'), function() {
 console.log('Express started');
});