var request   = require('request');
var _url      = require('url');

var Service   = require('./service.js');
var services  = require('./services.js');

/**
 * Bypasser class which handles expansion for one link
 * @param {String} url - URL to be expanded
 */
function Bypasser(url) {
	this.url = url;
	this.service = null;
	this.findService();
}

/**
 * Invoke _findService and set the result, if any
 * @return {Boolean} - Whether a matching service has been found
 */
Bypasser.prototype.findService = function() {
	var serv = Bypasser._findService(this.url);
	
	if (serv) {
		this.service = serv;
		return true;
	}
	else {
    // Assign generic service
    //TODO: More specific way to reference this service than last element
    this.service = services[services.length-1];
    return false;
	}
};

/**
 * Find a service matching the given URL
 * @param  {String} url - URL to be checked
 * @return {Service}      Found service, or null
 * @private
 */
Bypasser._findService = function(url) {
	var parsedUrl = _url.parse(url);
	if (parsedUrl.hostname == null) return null;
	
	var found = false;
	
	// Loop through services until a match is found
	for (var i = 0; i < services.length && !found; i++) {
		var serv = services[i];
		
		// Find a match among hostnames
		for (var j = 0; j < serv.hosts.length && !found; j++) {
			if (parsedUrl.hostname.endsWith(serv.hosts[j])) {
				found = true;
			}
		}
	}
	
	if (found) {
		return serv;
	}
	
	return null;
};

/**
 * Decrypt the URL
 * @param  {Function} callback - Called when a result is ready
 */
Bypasser.prototype.decrypt = function(callback) {

  // URL not recognized as supported callback will be in Generic service
  // TODO: Move it back here

	this.service.run(this.url, callback);
};

module.exports = Bypasser;
