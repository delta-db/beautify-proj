'use strict';

var chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();

var beautify = require('../scripts'),
  fs = require('fs'),
  walk = require('walk'),
  path = require('path'),
  Promise = require('bluebird');

describe('beautify', function () {

  var read = function (filename) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filename, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };

  var diffFiles = function (filename1, filename2) {
    return read(filename1).then(function (data1) {
      return read(filename2).then(function (data2) {
        if (data1 !== data2) {
          throw new Error('Files not equal: ' + filename1 + ' and ' + filename2);
        }
      });
    });
  };

  var diff = function (dir1, dir2) {

    dir1 = path.resolve(__dirname, dir1);
    dir2 = path.resolve(__dirname, dir2)

    var promises = [];

    return new Promise(function (resolve) {

      var walker = walk.walk(dir1, {
        followLinks: false
      });

      walker.on('file', function (root, stat, next) {
        var filename1 = path.resolve(root, stat.name);
        var filename2 = path.resolve(dir2, filename1.substring(dir1.length + 1));
        promises.push(diffFiles(filename1, filename2));
        next();
      });

      walker.on('end', function () {
        resolve();
      });

      // TODO: use walker.on('errors') to reject()?

    }).then(function () {
      // We've walked all the files, but make sure we have diffed all the files
      return Promise.all(promises);
    });

  };

  it('should beautify', function () {
    // Beautify example files
    return beautify('../test-not-beautified', '../test-beautified', '../beautify.json').then(function () {
      // Compare results against expected results
      return diff('../test-is-beautified', '../test-beautified');
    });
  });

});
