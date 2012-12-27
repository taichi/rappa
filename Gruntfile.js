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

  grunt.registerTask('template', 'process handlebars precompilation', function() {
    var done = this.async();
    grunt.util.spawn({
      cmd : 'handlebars',
      args : 'template -f extension/content/lib/templates.js -m -o -k each -k if -k unless'.split(' ')
    }, done);
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('default', ['template', 'compress']);
};
