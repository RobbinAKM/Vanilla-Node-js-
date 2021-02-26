var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

var lib={};

lib.baseDir = path.join(__dirname,'/../.logs/');

lib.append= function(file,str,callback){
    fs.open(lib.baseDir+file+'.log', 'a', function(err, fileDescriptor){
      if(!err && fileDescriptor){
        fs.appendFile(fileDescriptor,str+'\n',(err)=>{
          if(!err){
            fs.close(fileDescriptor,(err)=>{
              if(!err){
                callback(false);
              }else {
                callback('error closing file');
              }
            })
          }else {
            callback('error appending to file');
          }
        })
      }else {
        callback('could not open file for appending');
      }
    });
};


lib.list=function(includeCompressedLogs ,callback){
  fs.readdir(lib.baseDir,(err,data)=>{
    if(!err && data && data.length > 0){
      var trimmedFiles =[];
      data.forEach((fileName) => {
        if(fileName.indexOf('.log')>-1){
          trimmedFiles.push(fileName.replace('.log',''));
        }
        if(fileName.indexOf('.gz.b64')>-1 && includeCompressedLogs){
          trimmedFiles.push(fileName.replace('.gz.b64',''));
        }
      });
      callback(false,trimmedFiles);
    }else {
      callback(err,data);
    }
  })
};


lib.compress= function(logId,newFileId,callback){
  var sourceFile=logId+'.log';
  var destinationFile =newFileId+'.gz.b64';

  fs.readFile(lib.baseDir+sourceFile,'utf8',(err,inputString)=>{
    if(!err && inputString){
      zlib.gzip(inputString,(err,buffer)=>{
        if(!err && buffer){
          fs.open(lib.baseDir+destinationFile,'wx',(err,fileDescriptor)=>{
            if(!err && fileDescriptor){
              fs.writeFile(fileDescriptor,buffer.toString('base64'),(err)=>{
                if(!err){
                  fs.close(fileDescriptor,(err)=>{
                    if(!err){
                      callback(false);
                    }else {
                      callback(err);
                    }
                  })
                }else {
                  callback(err);
                }
              })
            }else {
              callback(err);
            }
          })
        }else {
          callback(err);
        }
      })
    }else {
      callback(err);
    }
  })
};

lib.decompress = function(fileId , callback){
  var fileName = fileId+'.gz.b64';
  fs.readFile(lib.baseDir+fileName,'utf8',(err,str)=>{
    if(!err && str){
      //decompress the data
      var inputBuffer = Buffer.from(str,'base64');
      zlib.unzip(inputBuffer,(err,outputBuffer)=>{
        if(!err && outputBuffer){
          var str = outputBuffer.toString();
          callback(false,str);
        }else {
          callback(err);
        }
      })
    }else {
      callback(err);
    }
  })
};


lib.truncate= function(logId,callback){
  fs.truncate(lib.baseDir+logId+'.log',0,(err)=>{
    if(!err){
      callback(false);
    }else {
      callback(err);
    }
  })
}



module.exports= lib;
