'use strict';

var beautify = require('./scripts'),
  path = require('path'),
  argv = require('minimist')(process.argv.slice(2));

if (!argv.i || !argv.o || !argv.c) {
  console.log('Usage: beautify-proj -i dir -o dir -c json-config');
} else {
  beautify(path.resolve(argv.i), path.resolve(argv.o), path.resolve(argv.c));
}
