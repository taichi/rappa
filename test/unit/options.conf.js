basePath = '../../'

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'extension/common/*.js',
  'extension/options/lib/*.js',
  'extension/options/js/*.js',
  'test/lib/angular-mocks.js',
  'test/unit/options/*.js'
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
