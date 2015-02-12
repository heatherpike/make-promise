/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise () { 
	this.value;
	this.state = 'pending';
	this.handlerGroups = [];
	this.updateCbs = [];
};

$Promise.prototype.then = function ( successCb, errorCb, updateCb) {	
		if (this.state == 'resolved' && successCb) {
			successCb(this.value);
			return;
		}

		if (this.state == 'rejected' && !successCb && errorCb) {
			errorCb(this.value);
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

$Promise.prototype.callHandlers = function() {
	var self = this;
	if (this.state === 'resolved') {
		this.handlerGroups.forEach( function(cb) {
			if (cb.successCb) cb.successCb(self.value);
		});
		this.handlerGroups = [];
		return;
	} 
	if (this.state === 'rejected') {
		this.handlerGroups.forEach( function(cb) {
			if (cb.errorCb) cb.errorCb(self.value);
		});
		this.handlerGroups = [];
		return;	
	}
	
};

$Promise.prototype.catch = function (fn) {
	this.then(null,fn);
};

function Deferral () { 
	this.$promise = new $Promise();
};

Deferral.prototype.resolve = function ( someData ) {
		if (this.$promise.state !== 'rejected') {
			if (this.$promise.state == 'pending') {
				this.$promise.value = someData;
			}
			this.$promise.state = 'resolved';
			this.$promise.callHandlers();
		}
	};

Deferral.prototype.reject = function (reason) {
		if (this.$promise.state !== 'resolved') {
			if (this.$promise.state == 'pending') {
				this.$promise.value = reason;
			}
			this.$promise.state = 'rejected';	
			this.$promise.callHandlers();
		}
	};

Deferral.prototype.notify = function (param) {
	if (this.$promise.state === 'pending') {
		this.$promise.updateCbs.forEach( function(cb) {
			cb(param);
		});
	}
}

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
