'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    sassIncl = require('sass-include-paths'),
    path = require('path').join(__dirname, '/views'),
    shell = require('gulp-shell');


var opt = {
    sass  : {
        src     : [
            path + '/assets/sass/*.scss',
            path + '/assets/sass/**/*.scss'
        ],
        dest    : path + '/assets/css',
        options : {
            outputStyle: 'expanded',
            precision  : 5,
            sourceMaps : true
        },
        prefixer: {
            options: {
                browsers: [
                    'last 2 version',
                    '> 1%',
                    'safari 5',
                    'ie 8',
                    'ie 9',
                    'opera 12.1',
                    'ios 6',
                    'android 4'
                ],
                cascade : true,
                remove  : false
            }
        }
    },
    minify: {
        css: {
            src: [
                path + "/assets/css/style.css"
            ],
            options: {
                compatibility: 'ie7',
                roundingPrecision: -1,
                sourceMap: true,
                discardComments: {
                    removeAll: true
                },
                autoprefixer: false,
                zindex: false
            },
            dest: path + '/public/css'
        },
        js : {
            src    : [
                path + "/assets/js/highcharts.js"
            ],
            dest   : path + '/public/js',
            options: {
                mangle  : false,
                compress: {
                    sequences   : false, // Fix issues with jquery-ui
                    dead_code   : true,
                    conditionals: true,
                    booleans    : true,
                    unused      : true,
                    if_return   : true,
                    join_vars   : true,
                    drop_console: false//true
                },
                output  : {
                    bracketize: true,
                    comments  : true
                }
            }
        }
    }
};

gulp.task('sass', function (cb) {
    opt.sass.options['includePaths'] = sassIncl.bowerComponentsSync();

    gulp.src(opt.sass.src)
        .pipe($.plumber())
        .pipe($.sass.sync(opt.sass.options))
        .pipe($.autoprefixer(opt.sass.prefixer.options))
        .pipe($.plumber.stop())
        .pipe(gulp.dest(opt.sass.dest))
        .on('end', function () {
            gulp.src(opt.minify.css.src)
                .pipe($.plumber())
                .pipe($.cssnano(opt.minify.css.options))
                .pipe($.concat('bundle.min.css'))
                .pipe($.plumber.stop())
                .pipe(gulp.dest(opt.minify.css.dest))
                .on('end', cb);
        });
});

gulp.task('minify-js', shell.task(
    `uglifyjs ` +
    `${opt.minify.js.src.join(' ')} -c -m -o ${path}/public/js/bundle.min.js`
));