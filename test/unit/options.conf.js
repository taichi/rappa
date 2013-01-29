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
  'extension/common/jquery-1.8.2.min.js',
  'extension/common/lodash.custom.min.js',
  'extension/options/lib/angular.min.js',
  'extension/options/lib/bootstrap.min.js',
  'extension/options/js/app.js',
  'extension/options/js/chrome.js',
  'extension/options/js/controllers.js',
  'extension/options/js/directives.js',
  'extension/options/js/i18n.js',
  'extension/options/js/services.js',
  'test/lib/angular-mocks.js',
  'test/unit/options/chrome.spec.js',
  'test/unit/options/controllers.spec.js',
  'test/unit/options/directives.spec.js',
  'test/unit/options/i18n.spec.js',
  'test/unit/options/services.spec.js'
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
