/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise () { 
	this.state = 'pending';
	this.handlerGroups = [];
	this.updateCbs = [];
};

$Promise.prototype.then = function ( successCb, errorCb, updateCb) {	
	//Gabe's code
		var successFn = null,
      errorFn = null;
  if (typeof successCb === 'function') successFn = successCb;
  if (typeof errorCb === 'function') errorFn = errorCb;
  if (typeof updateCb === 'function') {
    this.updateCbs.push(updateCb);
  }
  var newGroup = {
    successCb: successFn,
    errorCb: errorFn,
    forwarder: new Deferral()
  };

  this.handlerGroups.push(newGroup);
  if(this.state !== 'pending') this.callHandlers();
  return newGroup.forwarder.$promise;

		// var self = this;

		// if (this.state == 'resolved' && successCb) {
		// 	successCb(this.value);
		// 	return;
		// }
		// if (this.state == 'resolved' && !successCb) {
		// 	var resolvedNoSuccess = this;
		// }

		// if (this.state == 'rejected' && errorCb) {
		// 	errorCb(this.value);
		// 	return;
		// }

		// if (typeof successCb !== 'function') successCb = false;
		// if (typeof errorCb !== 'function') errorCb = false;
		// this.handlerGroups.push({
		// 	successCb: successCb, 
		// 	errorCb: errorCb,
		// 	forwarder: defer()
		// }); 
		// var nextPromise = this.handlerGroups[this.handlerGroups.length-1].forwarder.$promise;

		// if (typeof updateCb === 'function') {
		// 	this.updateCbs.push(updateCb);
		// }

		// if (resolvedNoSuccess) {
		// 	nextPromise.resolve(resolvedNoSuccess.value);
		// 	console.log(nextPromise.value);
		// 	console.log(nextPromise.state);
		// }

		// return nextPromise;
	};

$Promise.prototype.callHandlers = function() {
	//Gabe;s code
	var hGroup, output;
  while( this.handlerGroups.length ) {
    hGroup = this.handlerGroups.shift();
    if (this.state === 'resolved') {
     if (hGroup.successCb) {
     	try {
	     	output = hGroup.successCb(this.value);
	     		if (output instanceof $Promise) {
	     			output.then(function(data) {
	     				hGroup.forwarder.resolve(data);
	     			}, function(reason) {
	     				hGroup.forwarder.reject(reason);
	     			});
	     			hGroup.forwarder
	     	} else {
	     		hGroup.forwarder.resolve(output);
	     	}
     	}
     	catch (err) {
     		hGroup.forwarder.reject(err);
     	}
     }
     else hGroup.forwarder.resolve(this.value);
    } else if (this.state === 'rejected' ) {
      if (hGroup.errorCb) {
      	try {
	      	output = hGroup.errorCb(this.value);
	      	if (output instanceof $Promise) {
	      	//here we have to resolve not reject - see line 84 in test spec
	      		output.then(function(data) {
	      			hGroup.forwarder.resolve(data);
	      		}, function(reason) {
	      			hGroup.forwarder.reject(reason);
	      		});
	      	} else {
	      		hGroup.forwarder.resolve(output);
	      	}
      	}
      	catch (err) {
      		hGroup.forwarder.reject(err);
      	}
      }
      else hGroup.forwarder.reject(this.value);
    }
  }

	
};

$Promise.prototype.catch = function (fn) {
	return this.then(null,fn);
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
