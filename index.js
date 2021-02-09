const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require ('string_decoder').StringDecoder;

const config = require('./config');

const _data = require('./lib/data');

_data.delete('test','newfile',(err,data)=>{
   console.log('this was the err',err ,data);
})

//for http

var httpServer = http.createServer((req,res)=>{
   unifiedServer(req,res);
});

httpServer.listen(config.httpPort,()=>{
  console.log(`listening on port ${config.httpPort}`);
});


//for https

var httpsServerOptions={
  'key':fs.readFileSync('./https/key.pem') ,
  'cert':fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions,(req,res)=>{
   unifiedServer(req,res);
});

httpsServer.listen(config.httpsPort,()=>{
  console.log(`listening on port ${config.httpsPort}`);
});


//for http and https servers

var unifiedServer = (req,res)=>{
  var parsedUrl = url.parse(req.url,true);

  var path = parsedUrl.pathname;

  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  //parsing q string (true)
  var queryStringObject= parsedUrl.query;

  //get post or others
  var method = req.method.toLowerCase();

  //get the headers as object
  var headers= req.headers;

  //get the payload

  var decoder = new StringDecoder('utf-8')
  var buffer = '';
  req.on('data',(data)=>{
    buffer+= decoder.write(data)
  });
  req.on('end',()=>{
    buffer+= decoder.end();

 //make a handler which route to go
  var chosenHandler = typeof(routes[trimmedPath])!== 'undefined' ? routes[trimmedPath]:handlers.notFound;

//construct the data object
  var data = {
    'trimmedPath':trimmedPath,
    'queryStringObject':queryStringObject,
    'method':method,
    'headers':headers,
    'payload':buffer
  }

 //route the request to the specified handler

    chosenHandler(data,(statusCode , payload )=>{
      typeof(statusCode) =='number'? statusCode : 200;
      typeof(payload) =='object' ? payload :{};

      var payLoadString = JSON.stringify(payload);

      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payLoadString);
      console.log(statusCode,payLoadString);
    });
  });
}


var handlers={

}

handlers.ping=(data,callback)=>{
   callback(200)
}

handlers.notFound=(data,callback)=>{
  callback(404)
}

var routes ={
  'ping':handlers.ping
}
