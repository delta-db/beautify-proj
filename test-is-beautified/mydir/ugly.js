'use strict';

// This is a comment where the indentation is off

var Foo = function (variable1, variable2, variable3, variable4, variable5, variable6, variable7,
  variable8, variable9) {
  this._x = {
    y: variable1,
    z: variable2
  };
};

Foo.prototype.bar = function () {
  if ('something' === 'somethingelse' && 'anotherthing' === 'anotherthing' && 'allthingshere' !==
    'someotherthing') {

  }
};

module.exports = Foo;
