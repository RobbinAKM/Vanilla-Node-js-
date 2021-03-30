var helpers = require('./../lib/helpers.js');
var assert = require('assert');
var logs = require('./../lib/logs.js');

var unit={}
// Assert that the getANumber function is returning a number
unit['helpers.getANumber should return a number'] = function(done){
  var val = helpers.getANumber();
  assert.equal(typeof(val), 'number');
  done();
};


// Assert that the getANumber function is returning 1
unit['helpers.getANumber should return 1'] = function(done){
  var val = helpers.getANumber();
  assert.equal(val, 1);
  done();
};

// Assert that the getANumber function is returning 2
unit['helpers.getNumberOne should return 2'] = function(done){
  var val = helpers.getANumber();
  assert.equal(val, 2);
  done();
};

unit['logs.truncate does not throw error when the id does not exit']=function(done){
  assert.doesNotThrow(function(){
    logs.truncate('not an id',(err)=>{
      assert.ok(err)
      done()
    })
  },TypeError)
}

module.exports=unit;
