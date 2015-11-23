'use strict';

var UglyError = function (message) {
  this.name = 'UglyError';
  this.message = message;
};

UglyError.prototype = Object.create(Error.prototype);
UglyError.prototype.constructor = UglyError;

module.exports = UglyError;
