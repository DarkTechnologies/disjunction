/**
 * Disjunction
 * A collection of unconventional promise and callback systems
 *  @author Shawn Rapp
 *  @version 1.0.0
 *  @license MIT. Read LICENSE for more information.
 */
(function() {
'use strict';

module.exports = {
    Backfill: function() {
        return require('./lib/backfill-promise.js')();
    },
    Overt: function() {
        return require('./lib/overt-promise.js')();
    }
};

})();
