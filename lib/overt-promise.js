/**
 * OvertPromiseObject
 * Simple promise object that has resolve & reject exposed.
 *  @author Shawn Rapp
 *  @version 1.0.0
 *  @license MIT. Read LICENSE for more information.
 */
(function() {
'use strict';

var OvertPromiseObject = function() {
    var retObject = {};
    var resolvedCB, rejectCB, finalCB;
    var resolvedArgs, rejectArgs;

    retObject.then = function(success, fail) {
        resolvedCB = success;
        rejectCB = fail;

        if (resolvedCB) {
            // already been resolved (probably synchronous)
            resolvedCB.apply(this, resolvedArgs);
        }
        
        if (rejectCB) {
            // already been resolved (probably synchronous)
            rejectCB.apply(this, rejectArgs);
        }

        return {
            final: function(final) {
                finalCB = final;
                //if resolve or reject fired than attempt final
                if (finalCB && (resolvedCB || rejectCB)) {
                    finalCB();
                }
            }
        };
    };

    retObject.resolve = function() {
        resolvedArgs = Array.prototype.slice.call(arguments);
        if (resolvedCB) {
            resolvedCB.apply(this, resolvedArgs);
        }
    };
    
    retObject.reject = function() {
        rejectArgs = Array.prototype.slice.call(arguments);
        if (rejectCB) {
            rejectCB.apply(this, rejectArgs);
        }
    };

    return retObject;
};

module.exports = OvertPromiseObject;
})();
