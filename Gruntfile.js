module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'index.js', 'lib/**/*.js','tests/**/*.js'],
      options: {
        globals: {
          console: true,
          module: true
        }
      }
    },
    release: {
      options: {
        bump: true, //default: true
        file: 'package.json', //default: package.json
        add: true, 
        commit: true,
        tag: true,
        push: true,
        pushTags: true,
        npm: true
      }
    },
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        grep: '*',
        ui: 'bdd',
        reporter: 'tap'
      },

      all: { src: ['tests/scarlet-logger-tests.js'] }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint',"simplemocha"]
    }

  });

  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint',"watch"]);
};
