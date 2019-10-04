
var factory = require('../../lib/build/copy');
var path = require('path');
var rimraf = require('rimraf');
var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);
var expect = chai.expect;
var file = chaiFiles.file;

var outpath = path.join(__dirname, '../../out-fixtures');
var inpath = path.join(__dirname, '../../fixtures');

describe('Copy task', function() {
  beforeEach(rimraf.bind(null, outpath, {}));
  afterEach(rimraf.bind(null, outpath, {}));

  it('Should do nothing if it is called with an empty config', function() {
    var stream = factory()();
    expect(stream).to.be.an('undefined');
  });

  it('Should fail on an invalid config being passed', function() {
    expect(factory.bind(factory, '')).to.throw(Error, 'config must be an object');
  });

  it('Should use the default config', function() {
    var task = factory();
    expect(task._config).to.eql({ src: [], dest: null, imagemin: false });
    expect(task._opts).to.eql(undefined);
  });

  it('Should not modify the config object', function() {
    var cfg = Object.freeze({});
    factory(cfg);
  });

  it('Should add a _watch property if src is not empty', function() {
    var cfg = { src: 'foo' };
    var task = factory(cfg);
    expect(task._watch).to.eql('foo');
  });

  it('Should not add a _watch property if src is empty', function() {
    var task = factory();
    expect(task._watch).to.be.null;
  });

  it('Should copy a file from src to dest', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.txt'),
      dest: outpath
    })();
    stream.on('error', done);
    stream.on('end', function() {
      expect(file(path.join(outpath, 'fixture.txt'))).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should minify an image if requested to do so', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.png'),
      imagemin: true,
      dest: outpath
    })();
    stream.on('error', done);
    stream.on('end', function() {
      var originalFile = file(path.join(inpath, 'fixture.png'));
      var optimizedFile = file(path.join(outpath, 'fixture.png'));
      expect(optimizedFile).to.exist;
      expect(optimizedFile.stats.size).to.be.below(originalFile.stats.size);
      done();
    });
    stream.resume();
  });

});
