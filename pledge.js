/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise () { 
	this.value;
	this.state = 'pending';
	this.handlerGroups = [];
	this.updateCbs = [];
	this.then = function ( successCb, errorCb, updateCb) {	
		if (this.state == 'resolved') {
			successCb(this.value);
			return;
		}

		if (typeof successCb !== 'function') successCb = false;
		if (typeof errorCb !== 'function') errorCb = false;
		this.handlerGroups.push({
			successCb: successCb, 
			errorCb: errorCb
		}); 
		if (typeof updateCb == 'function') {
			this.updateCbs.push(updateCb);
		}	
		
	};
};

$Promise.prototype.callHandlers = function() {
	var value = this.value;
	if (this.state == 'resolved') {
		this.handlerGroups.forEach( function(cb) {
			cb.successCb(value);
		});
		return;
	} 
	
};

function Deferral () { 
	this.$promise = new $Promise();
	this.resolve = function ( someData ) {
		if (this.$promise.state !== 'rejected') {
			if (this.$promise.state == 'pending') {
				this.$promise.value = someData;
			}
			this.$promise.state = 'resolved';
			this.$promise.callHandlers();
		}
	};
	this.reject = function (reason) {
		if (this.$promise.state !== 'resolved') {
			if (this.$promise.state == 'pending') {
				this.$promise.value = reason;
			}
			this.$promise.state = 'rejected';	
		}
	};
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
