module.exports = function(grunt) {

  var jsFiles = function(name) {
    return 'extension/' + name + '/js/**/*.js';
  };
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    jshint : {
      all : ['Gruntfile.js', jsFiles('background'), jsFiles('content'), jsFiles('options')]
    },
    compress : {
      extension : {
        options : {
          cwd : 'extension'
        },
        files : {
          'build/<%= pkg.name %>-<%= pkg.version %>.<%= grunt.template.today("yyyymmdd_HHMMss") %>.zip' : 'extension/**'
        }
      }
    }
  });

  grunt.registerTask('test', 'run tests', function() {
    var child = grunt.util.spawn({
      cmd : 'testacular',
      args : 'start test/unit/options.conf.js --single-run'.split(' ')
    }, this.async());
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });

  grunt.registerTask('template', 'process handlebars precompilation', function() {
    grunt.util.spawn({
      cmd : 'handlebars',
      args : 'template -f extension/content/lib/templates.js -m -o -k each -k if -k unless'.split(' ')
    }, this.async());
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('default', ['template', 'test', 'compress']);
};
