'use strict';

var jsbeautify = require('js-beautify').js_beautify,
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  walk = require('walk'),
  path = require('path'),
  Promise = require('bluebird'),
  UglyError = require('./ugly-error');

var readUtf8 = function (filename, callback) {
  fs.readFile(filename, 'utf8', callback);
};

var read = Promise.promisify(readUtf8);

var mkdir = Promise.promisify(mkdirp);

var write = Promise.promisify(fs.writeFile);

var mkdirpAndWrite = function (filename, data) {
  return mkdir(path.dirname(filename)).then(function () {
    return write(filename, data);
  });
};

var beautifyFile = function (filename, options, inDir, outDir) {
  return read(filename).then(function (data) {
    var beautifulData = jsbeautify(data, options);

    if (outDir) { // beautify?

      var inDirDir = path.dirname(inDir);

      // E.G. if filename=/tmp/test-no-beautified/mydir/ugly.js and
      // inDir=/tmp/test-no-beautified
      // then relFilename is test-no-beautified/mydir/ugly.js
      var relFilename = filename.substring(inDirDir.length + 1);

      var outFilename = path.resolve(outDir, relFilename);

      return mkdirpAndWrite(outFilename, beautifulData);

    } else { // just test for ugly files

      if (beautifulData !== data) {
        throw new UglyError('Ugly file: ' + filename);
      }

    }
  });
};

var beautifyAll = function (options, inDir, outDir) {

  var promises = [],
    err = null;

  return new Promise(function (resolve) {

    var walker = walk.walk(inDir, {
      followLinks: false
    });

    walker.on('file', function (root, stat, next) {
      var filename = path.resolve(root, stat.name);
      var ext = path.extname(filename);
      if (ext === '.js') {
        // If we don't catch the error here, we can get an "Unhandled rejection" error
        var promise = beautifyFile(filename, options, inDir, outDir).catch(function (_err) {
          err = _err;
        });
        promises.push(promise);
      }
      next();
    });

    walker.on('end', function () {
      // We've walked all the files, but make sure we have beautified all the files
      resolve();
    });

    // IDEA: use walker.on('errors') to reject()?

  }).then(function () {
    // We've walked all the files, but make sure we have beautified all the files
    return Promise.all(promises);
  }).then(function () {
    if (err) {
      throw err;
    }
  });

};

var beautify = function (inDir, outDir, configFile) {
  return read(configFile).then(function (data) { // read config
    var options = JSON.parse(data);
    return beautifyAll(options, inDir, outDir);
  });
};

module.exports = beautify;
