var compileES6 = require('broccoli-es6-concatenator');
var mergeTrees = require('broccoli-merge-trees');
var uglifyJs = require('broccoli-uglify-js');
var Funnel = require('broccoli-funnel');
var pickFiles = require('broccoli-static-compiler');
var env = process.env.BROCCOLI_ENV || 'development';

var lib = compileES6(mergeTrees(['lib', 'bower_components/loader.js']), {
  loaderFile: 'loader.js',
  inputFiles: [
    '**/*.js'
  ],
  wrapInEval: false,
  outputFile: '/maguire.js'
});

var amd = compileES6('lib', {
  inputFiles: [
    '**/*.js'
  ],
  wrapInEval: false,
  outputFile: '/maguire.amd.js'
});

var uglify = function (tree, filename) {
  var minFilename = filename.split('.');
  minFilename.pop();
  minFilename.push('min', 'js');
  return uglifyJs(new Funnel(tree, {
    getDestinationPath: function (relativePath) {
      return '/' + minFilename.join('.')
    }
  }));
}

if (env === 'test') {
  var tests = pickFiles('tests', {
    srcDir: '/',
    destDir: 'tests'
  });

  module.exports = mergeTrees([
    lib,
    uglify(lib, 'maguire.js'),
    amd,
    uglify(amd, 'maguire.amd.js'),
    'public',
    tests
  ]);
} else {
  module.exports = mergeTrees([
    lib,
    uglify(lib, 'maguire.js'),
    amd,
    uglify(amd, 'maguire.amd.js')
  ]);
}
