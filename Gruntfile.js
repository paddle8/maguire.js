var exec = require('child_process').exec;
module.exports = function (grunt) {
  grunt.registerTask('default', 'Build the library', function () {
    grunt.log.write("Building dist/");
    exec("rm -rf dist");
    exec("broccoli build dist");
  });
};
