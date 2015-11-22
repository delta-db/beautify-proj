'use strict';

// This is a comment where the indentation is off

var Foo = function (aLongVariableNameLikeThisGoesHere1, aLongVariableNameLikeThisGoesHere2,
  aLongVariableNameLikeThisGoesHere3) {
  this._stuff = {
    x: aLongVariableNameLikeThisGoesHere1,
    y: aLongVariableNameLikeThisGoesHere2,
    z: aLongVariableNameLikeThisGoesHere3
  };
};

Foo.prototype.bar = function () {
  var something = 'something';
  if (something === 'somethingelse' && something === 'anotherthing' && something !==
    'someotherthing') {

  }
};

module.exports = Foo;
