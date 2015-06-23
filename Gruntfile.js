'use strict';
module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed MIT */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      css:{
        src:['src/animate.css','src/animations.css','src/<%= pkg.name %>.css'],
        dest:'dist/<%= pkg.name %>.css'
      }
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          'src/<%= pkg.name %>.css': 'src/<%= pkg.name %>.scss',     // 'destination': 'source'
          'src/animate-page.css': 'src/animate-page.scss'
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
         options: {
             keepSpecialComments: 1,
         },
         compress: {
             files: {
                 'dist/<%= pkg.name %>.min.css': ['dist/<%= pkg.name %>.css']
             }
         }
    },

    // qunit: {
    //   all: {
    //     options: {
    //       urls: ['http://localhost:9000/test/<%= pkg.name %>.html']
    //     }
    //   }
    // },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      }
    },
    // watch: {
    //   gruntfile: {
    //     files: '<%= jshint.gruntfile.src %>',
    //     tasks: ['jshint:gruntfile']
    //   },
    //   src: {
    //     files: '<%= jshint.src.src %>',
    //     tasks: ['jshint:src', 'qunit']
    //   },
    //   test: {
    //     files: '<%= jshint.test.src %>',
    //     tasks: ['jshint:test', 'qunit']
    //   }
    // },
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 9000
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  grunt.registerTask('default', ['jshint', 'sass','connect', 'clean', 'concat','uglify','cssmin']);
  // grunt.registerTask('server', function () {
  //   grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
  //   grunt.task.run(['serve']);
  // });
  // grunt.registerTask('serve', ['connect', 'watch']);
  // grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
};
