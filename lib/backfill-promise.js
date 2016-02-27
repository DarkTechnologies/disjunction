/**
 * Backfill-Promise
 * Promise wrappers an entire object and attempts to fullfill methods when the
 * real object is set.
 *  @author Shawn Rapp
 *  @version 1.0.0
 *  @license MIT. Read LICENSE for more information.
 */
(function() {
'use strict';
var emitter = new (require('events')).EventEmitter();
var uuid = require('node-uuid');

var PromiseShim = function(bfId, functionName, functionArgs) {
  var self = this;
  self.name = functionName;
  self.args = functionArgs;
  
  emitter.on(bfId, function(realObject) {
      var func = realObject[self.name];
      var promise = func.apply(realObject, self.args);
      promise.then(self.callbackSuccess, self.callbackFail);
  });
  
  function thenPromise(cbSuccess, cbFail) {
      self.callbackSuccess = cbSuccess;
      self.callbackFail = cbFail;
      return {
        'catch': cbFail
      };
  }
  
  function _PromiseShim() {
      var shim = {
          'then': thenPromise
      };
      
      return shim;
  }
  
  return _PromiseShim();
};

var Backfill = (function(){
    //Cosntructor
    function _Backfill(listOfPromises) {
        var self = this;
        
        //generate a ID unique to this backfill
        self.bfId = uuid.v4();
        
        //generate shims
        listOfPromises.forEach(function(func){
            self[func] = function() {
                //get the arguments the function was called with
                var args = Array.prototype.slice.call(arguments);
                
                return new PromiseShim(self.bfId, func, args);
            };
        });
    }
    
    return _Backfill;
})();

var undeclaredFunctionShim = function(scope, realFunction) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        return realFunction.apply(scope, args);
    };
};

//backfill the real object into bfp
Backfill.prototype.$set = function(realObject) {
    var self = this;
    emitter.emit(this.bfId, realObject);
    for (var propName in realObject) {
        if (typeof realObject[propName] == "function") {
            self[propName] = undeclaredFunctionShim(realObject, realObject[propName]);
        }
    }
};
    
module.exports = Backfill;
})();
