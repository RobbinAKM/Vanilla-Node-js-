var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');

var app= {};

app.init= function(){

server.init();

workers.init();

// Start the CLI, but make sure it starts last
setTimeout(function(){
  cli.init();
},50);

};

app.init();

module.exports = app ;
