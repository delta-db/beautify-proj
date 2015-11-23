'use strict';

var chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();

var beautify = require('../scripts'),
  fs = require('fs-extra'),
  walk = require('walk'),
  path = require('path'),
  Promise = require('bluebird');

describe('beautify', function () {

  var readUtf8 = function (filename, callback) {
    fs.readFile(filename, 'utf8', callback);
  };

  var read = Promise.promisify(readUtf8);

  var remove = Promise.promisify(fs.remove);

  var copy = Promise.promisify(fs.copy);

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

    var promises = [];

    return new Promise(function (resolve) {

      // Make sure the paths are absolute so that we can use substring below
      dir1 = path.resolve(dir1);
      dir2 = path.resolve(dir2);

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

      // IDEA: use walker.on('errors') to reject()?

    }).then(function () {
      // We've walked all the files, but make sure we have diffed all the files
      return Promise.all(promises);
    });

  };

  it('should beautify', function () {
    var testNotBeautified = path.resolve(__dirname, '../test-not-beautified'),
      testBeautified = path.resolve(__dirname, '../test-beautified'),
      configFile = path.resolve(__dirname, '../beautify.json'),
      testIsBeautified = path.resolve(__dirname, '../test-is-beautified'),
      root = path.resolve(__dirname, '..');

    // Remove destination for a clean test
    return remove(testBeautified).then(function () {
      // Copy files to another directory so that we don't change the originals
      return copy(testNotBeautified, testBeautified);
    }).then(function () {
      // Beautify copied files
      return beautify(testBeautified, root, configFile);
    }).then(function () {
      // Compare results against expected results
      return diff(testIsBeautified, testBeautified);
    });
  });

});
