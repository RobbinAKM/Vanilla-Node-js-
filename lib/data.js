const path = require('path');
const fs = require('fs');


const lib= {}

lib.baseDir =path.join(__dirname,'/../.data/');

lib.create=(dir, file , data , callback)=>{
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',(err,fileDescriptor)=>{
      if(!err && fileDescriptor){

         var stringData = JSON.stringify(data);

        fs.write(fileDescriptor,stringData,(err)=>{
                 if(!err){
                     fs.close(fileDescriptor,(err)=>{
                         if(!err){
                            callback(false);
                         } else{
                           callback('error closing new file');
                         }
                     });

                 }else{
                   callback('error writing to file');
                 }
        });
      }else{
        callback('could not create a new file');
      }
  });
}


lib.read = (dir,file,callback)=>{
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',(err,data)=>{
      console.log(err,data);
    })
}


lib.update = function(dir,file,data,callback){

  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Truncate the file
      fs.truncate(fileDescriptor,function(err){
        if(!err){
          // Write to file and close it
          fs.writeFile(fileDescriptor, stringData,function(err){
            if(!err){
              fs.close(fileDescriptor,function(err){
                if(!err){
                  callback(false);
                } else {
                  callback('Error closing existing file');
                }
              });
            } else {
              callback('Error writing to existing file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Could not open file for updating, it may not exist yet');
    }
  });

};

lib.delete =(dir,file,callback)=>{
  fs.unlink(lib.baseDir+dir+'/'+file+'.json',(err)=>{
    if(!err){
      callback(false);
    }else{
      callback('error deleting file');
    }
  })
}


module.exports= lib;
