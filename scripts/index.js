'use strict';

var jsbeautify = require('js-beautify').js_beautify,
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  walk = require('walk'),
  path = require('path'),
  Promise = require('bluebird');

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

var mkdir = function (filename) {
  return new Promise(function (resolve, reject) {
    mkdirp(filename, function (err) { // create dir if needed
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

var write = function (filename, data) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(filename, data, function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

var mkdirpAndWrite = function (filename, data) {
  return mkdir(path.dirname(filename)).then(function () {
    return write(filename, data);
  });
};

var beautifyFile = function (filename, options, inDir, outDir) {
  return read(filename).then(function (data) {
    var beautifulData = jsbeautify(data, options);

    var inDirDir = path.dirname(inDir);

    // E.G. if filename=/tmp/test-no-beautified/mydir/ugly.js and
    // inDir=/tmp/test-no-beautified
    // then relFilename is test-no-beautified/mydir/ugly.js
    var relFilename = filename.substring(inDirDir.length + 1);

    var outFilename = path.resolve(outDir, relFilename);

    return mkdirpAndWrite(outFilename, beautifulData);
  });
};

var beautifyAll = function (options, inDir, outDir) {

  var promises = [];

  return new Promise(function (resolve) {

    var walker = walk.walk(inDir, {
      followLinks: false
    });

    walker.on('file', function (root, stat, next) {
      var filename = path.resolve(root, stat.name);
      var ext = path.extname(filename);
      if (ext === '.js') {
        promises.push(beautifyFile(filename, options, inDir, outDir));
      }
      next();
    });

    walker.on('end', function () {
      resolve();
    });

    // TODO: use walker.on('errors') to reject()?

  }).then(function () {
    // We've walked all the files, but make sure we have beautified all the files
    return Promise.all(promises);
  });

};

var beautify = function (inDir, outDir, configFile) {
  return read(configFile).then(function (data) { // read config
    var options = JSON.parse(data);
    return beautifyAll(options, inDir, outDir);
  });
};

module.exports = beautify;
