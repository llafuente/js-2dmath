module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    // Print a timestamp (useful for when watching)
    grunt.registerTask("timestamp", function() {
        grunt.log.subhead(Date());
    });

    /**
     * Project configuration.
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
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

    grunt.task.registerTask('documentation', 'Generate debug files', function() {
        require("./dist.js");
    });

    var argumentify = require('argumentify'),
        argumentify_validators = {
            Vec2: {
                check: argumentify.check.ArrayOfNumbers(2),
                message: "invalid Vec2 %var-name%"
            },
            Matrix23: {
                check: argumentify.check.ArrayOfNumbers(6),
                message: "invalid Matrix23 %var-name%"
            },
            Matrix22: {
                check: argumentify.check.ArrayOfNumbers(4),
                message: "invalid Matrix22 %var-name%"
            },
            AABB2: {
                check: argumentify.check.ArrayOfNumbers(4),
                message: "invalid AABB2 %var-name%"
            },
            Rectangle: {
                check: argumentify.check.MultiArrayOfNumbers(2, 2),
                message: "invalid Rectangle %var-name%"
            },
            Triangle: {
                check: argumentify.check.MultiArrayOfNumbers(3, 2),
                message: "invalid Traingle %var-name%"
            }
        };

    grunt.task.registerTask('browserify:debug', 'Generate debug files', function() {
        var done = this.async(),
            fs = require('fs'),
            output_stream = fs.createWriteStream('debug/js-2dmath-browser-debug.js');

        argumentify.verbose();

        argumentify.customValidators(argumentify_validators);

        require('browserify')()
            .require('./index.js', {expose: "js-2dmath"})
            .transform('argumentify')
            .bundle({
                debug: true
            })
            .pipe(output_stream);

        output_stream.on("close", function() {
            grunt.log.ok("work done");
            done();
        });
    });

    grunt.task.registerTask('browserify:dist', 'Generate debug files', function() {
        var done = this.async(),
            browserify = require('browserify'),
            fs = require('fs'),
            stream;

        require('browserify')()
            .require('./index.js', {expose: "js-2dmath"})
            .transform('funlinify')
            .bundle()
            .pipe(fs.createWriteStream('dist/js-2dmath-browser.js'))
            .on("close", function() {
                done();
            });
    });

    grunt.registerTask('dist', ['browserify:dist', 'browserify:debug', "uglify:dist"]);
};
