module.exports = function (grunt) {

    var falafel = require("falafel");

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    /**
     * Project configuration.
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner:
        '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n */\n',
        src: {
            src_js: ['lib/*.js'],
            test_js: ['test/test-*.js'],
            demos: ['test/*.html']
        },

        /**
         * JS Uglify
         */
        uglify: {
            dist: {
                files: {
                    './dist/js-2dmath-browser.min.js': ['./dist/js-2dmath-browser.js']
                }
            }
        },

        watch: {
          scripts: {
            files: ['lib/*.js', 'lib/*/*.js', '*.js', 'test/*.js'],
            tasks: ['dist'],
            options: {
              debounceDelay: 250
            },
          },
        }
    }); // end config

    grunt.task.registerTask('debug', 'Generate debug files', function(arg1, arg2) {
        require("./dist.js");
    });

    grunt.task.registerTask('browserify:debug', 'Generate debug files', function(arg1, arg2) {
        var done = this.async();
        require("child_process").exec("browserify -r ./debug_index.js:js-2dmath -o ./debug/js-2dmath-browser-debug.js < /dev/tty", function(error, stdout, stderr) {
            done();
        });
    });

    grunt.task.registerTask('browserify:dist', 'Generate debug files', function(arg1, arg2) {
        var done = this.async();
        require("child_process").exec("browserify -r ./index.js:js-2dmath -o ./dist/js-2dmath-browser.js < /dev/tty", function(error, stdout, stderr) {
            done();
        });
    });

    grunt.registerTask('dist', ['debug', 'browserify:dist', 'browserify:debug', "uglify:dist"]);
};
