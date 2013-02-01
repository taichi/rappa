basePath = '../../'

files = [
  MOCHA,
  MOCHA_ADAPTER,
  'extension/test/lib/chai.js',
  'extension/test/lib/sinon-1.5.2.js',
  'extension/test/lib/sinon-chai.js',
  'test/unit/config.js',

  // Issue with version > 3.1.14
  // https://github.com/isaacs/node-glob/issues/51
  // https://github.com/testacular/testacular/commit/36e87d80
  'extension/common/*.js',
  'extension/options/lib/*.js',
  'extension/options/js/*.js',
  'test/lib/angular-mocks.js',
  'test/unit/options/*.js',
];

autoWatch = true;

browsers = ['Chrome'];

reporters = ['progress', 'coverage'];

preprocessors = {
  '**/extension/options/js/*.js': 'coverage'
};

coverageReporter = {
    type : 'html',
    dir : 'coverage/'
};
