var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var server = http.createServer(app);
app.use(express.static(path.resolve(__dirname, 'public')));

var jsonfile = require('jsonfile')
 
var file = 'locs.json';
var locJson;
jsonfile.readFile(file, function(err, obj) {
  console.dir(obj);
  locJson = obj;
})
app.get('/locs',function(req,res){
  res.json(locJson);
});
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});


