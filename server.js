var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var server = http.createServer(app);
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.bodyParser({uploadDir:'./uploads', keepExtensions: true}));

app.post('/flower',function(req,res){
  console.log("post called");
  var originalName = req.files.file.name;
  var path = req.files.file.path;
  console.log("OriginalFilename = "+originalName+", path is "+path);
  detect(path);
  flower.name = 'Rose';
  flower.originalName = originalName;
  flower.path = path;
  flower.save(function (err, fluffy) {
    if (err) return console.error(err);
  });
  res.json({'name':'Anemone','originalName':originalName});
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Flower server listening at", addr.address + ":" + addr.port);
});


