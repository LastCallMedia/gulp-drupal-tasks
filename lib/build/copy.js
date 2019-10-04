'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'lcm-build-copy-task';

module.exports = function (config) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  config = Object.assign({
    src: [],
    dest: null,
    imagemin: false,
  }, config);

  function copy() {
    if (config.src.length) {
      return gulp.src(config.src)
          .pipe(config.imagemin ? require('gulp-imagemin')() : gutil.noop())
          .pipe(config.dest ? gulp.dest(config.dest) : gutil.noop());
    }
  }
  copy._config = config;
  copy._watch = config.src.length ? config.src : null;
  copy.displayName = 'build:copy';
  copy.description = 'Copy source files and minify images.';
  copy.options = {};
  return copy;
};
