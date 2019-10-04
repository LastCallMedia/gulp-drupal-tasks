
var Undertaker = require('undertaker');
var Registry = require('../lib/registry');
var expect = require('chai').expect;

describe('Registry', function() {

  describe('With empty config', function() {

    const taker = new Undertaker(new Registry({}))

    it('Should always have build and build:watch tasks', function() {
      expect(taker.task('build')).to.be.a('function')
      expect(taker.task('build:watch')).to.be.a('function')
    });
  });

  describe('With sample config', function() {
    const input = require('../fixtures/gulpconfig-v1.json');
    const config = require('../lib/config')(input);
    const taker = new Undertaker(new Registry(config))

    var tasks = [
      'build',
      'build:copy',
      'build:copy:theme',
      'build:js',
      'build:js:theme',
      'build:scss',
      'build:scss:theme',
      'build:watch',
      'watch'
    ];

    it('Should have all tasks', function() {
      expect(taker.tree().nodes.sort()).to.eql(tasks);
    });
  });
});


