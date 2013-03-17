module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target: {
                files: {
                    'lib/<%= pkg.name %>.min.js': ['src/<%= pkg.name %>.js']
                }
            }
        },

        jshint: {
            options: {
               /* Configure specific jshint options
                curly: true,
                eqeqeq: false,
                immed: false,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,*/
                globals: {
                    jQuery: true,
                    $: true,
                    define: false,
                    console: false
                }
            },

            all: ['src/**/*.js']
        }


    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'jshint']);

};