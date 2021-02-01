const http = require('http');
const url = require('url');
const StringDecoder = require ('string_decoder').StringDecoder;

var server = http.createServer((req,res)=>{
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

        res.writeHead(statusCode);
        res.end(payLoadString);
        console.log(statusCode,payLoadString);
      });
    });
});

server.listen(3000,()=>{
  console.log("listening on port 3000");
});


var handlers={

}

handlers.sample=(data,callback)=>{
   callback(406,{'name':'sample handler'})
}

handlers.notFound=(data,callback)=>{
  callback(404)
}

var routes ={
  'sample':handlers.sample
}
