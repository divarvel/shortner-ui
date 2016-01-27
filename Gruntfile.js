module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            styles: {
                files: {
                    'compiled/css/all.css': 'assets/less/all.less'
                }
            }
        },
        cssmin: {
            src: 'compiled/css/all.css',
            dest: 'compiled/css/all.min.css'
        },

        browserify: {
            options: {
                extension: 'jsx',
                transform: [ require('grunt-react').browserify ]
            },
            app: {
                src: 'assets/js/main.js',
                dest: 'compiled/js/output.js'
            }
        },





        watch: {
            styles: {
                files: 'assets/less/**.less',
                tasks: [ 'less:styles', 'cssmin' ]
            },
            js: {
                files: ['assets/js/**.js', 'assets/js/components/**.jsx'],
                tasks: [ 'browserify:app' ]
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-react')

    grunt.registerTask('default', ['browserify']);

};
