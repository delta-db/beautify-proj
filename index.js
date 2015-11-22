'use strict';

var beautify = require('./scripts'),
  argv = require('minimist')(process.argv.slice(2));

if (!argv.i || !argv.o || !argv.c) {
  console.log('Usage: beautify-proj -i dir -o dir -c json-config');
  return;
}

beautify(argv.i, argv.o, argv.c);
