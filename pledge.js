/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise () { 
	this.state = 'pending';
};

function Deferral () { 
	this.$promise = new $Promise();
	this.resolve = function ( someData ) {
		if (this.$promise.state !== 'rejected') {
			if (this.$promise.state == 'pending') {
				this.$promise.value = someData;
			}
			this.$promise.state = 'resolved';
		}
	}
	this.reject = function (reason) {
		if (this.$promise.state !== 'resolved') {
			if (this.$promise.state == 'pending') {
				this.$promise.value = reason;
			}
			this.$promise.state = 'rejected';	
		}
	}
};

function defer () {
	return new Deferral();
}





/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
