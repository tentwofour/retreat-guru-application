module.exports = function (grunt) {
    "use strict";

    var root = '../',
        extend = require('extend'),
        vendorPath = root + 'vendor/',
        App = {
            'destination': '../public/assets/',
            'source': './'
        };

    App = extend(App, {
        'js': [App.source + 'js/**/*.js'],
        'all_scss': [App.source + 'scss/**/*.scss'],
        'scss': [App.source + 'scss/style.scss'],
        'img': [App.source + 'img/**/*.{png,jpg,jpeg,gif,webp}']
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            app_scss: {
                files: [App.all_scss, App.scss ],
                tasks: ['sass:app', 'cmq:app', 'cssmin:app']
            },
            app_js: {
                files: App.js,
                tasks: ['uglify:app', 'concat:app']
            },
            app_images: {
                files: App.img,
                tasks: ['force:imagemin:app'],
                options: {
                    event: ['added', 'changed']
                }
            },
            app_livereload: {
                files: [
                    App.destination + 'css/app.min.css',
                    App.destination + 'js/app.min.js'
                ],
                options: {
                    livereload: true
                }
            }
        },

        sass: {
            app: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'temp/app.css': App.source + 'scss/app.scss'
                }
            }
        },

        cmq: {
            app: {
                options: {
                    log: true
                },
                files: {
                    // Combine
                    'temp/app.css': [
                        'temp/app.css'
                    ]
                }
            }
        },

        cssmin: {
            app: {
                // Used to rewrite URLs in (particular) fancybox
                options: {
                    // This is where bower vendors are installed to (web/vendor)
                    root: '../'
                },
                files: {
                    '../public/assets/css/app.min.css': [
                        //vendorPath + 'fancybox/source/jquery.fancybox.css',
                        'temp/app.css'
                    ]
                }
            }
        },

        jshint: {
            options: {
                camelcase: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                forin: true,
                indent: 4,
                trailing: true,
                undef: true,
                browser: true,
                devel: true,
                node: true,
                globals: {
                    jQuery: true,
                    $: true
                }
            },
            app: {
                files: {
                    src: App.js
                }
            }
        },

        uglify: {
            app: {
                options: {
                    mangle: {
                        except: ['jQuery']
                    }
                },
                files: {
                    // Vendors
                    'temp/vendors.min.js': [
                        vendorPath+'jquery/dist/jquery.js',
                        vendorPath+'foundation/foundation.js',
                        vendorPath+'jquery-circle-progress/dist/circle-progress.js',
                        vendorPath+'matchHeight/dist/jquery.matchHeight.js'
                    ],

                    // Application JS
                    'temp/app.min.js': [App.js]
                }
            }
        },

        concat: {
            app: {
                src: [
                    'temp/modernizr-custom.js',
                    'temp/vendors.min.js',
                    'temp/app.min.js'
                ],
                dest: App.destination + 'js/app.min.js'
            }
        },

        imagemin: {
            app: {
                options: {
                    optimizationLevel: 3,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'img',
                    src: '**/*.{png,jpg,jpeg,gif,webp}',
                    dest: '../web/public/img'
                }]
            }
        },

        modernizr: {
            app: {
                devFile: 'remote',
                parseFiles: true,
                files: {
                    src: [
                        App.js,
                        App.all_scss
                    ]
                },
                outputFile: 'temp/modernizr-custom.js',

                extra: {
                    'shiv': false,
                    'printshiv': false,
                    'load': true,
                    'mq': false,
                    'cssclasses': true
                },
                extensibility: {
                    'addtest': false,
                    'prefixed': false,
                    'teststyles': false,
                    'testprops': false,
                    'testallprops': false,
                    'hasevents': false,
                    'prefixes': false,
                    'domprefixes': false
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-modernizr");
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-combine-media-queries');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-force-task'); // For imagemin

    grunt.registerTask('app-default', [
        'watch:app_scss',
        'watch:app_js',
        'watch:app_images']);

    grunt.registerTask('build-app', [
        'sass:app',
        'cmq:app',
        'cssmin:app',
        'modernizr:app',
        'uglify:app',
        'concat:app',
        'force:imagemin:app']);
};