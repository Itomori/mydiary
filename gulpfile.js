let path = require('path');
let gulp = require('gulp'),
    cleanCss = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpClean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    license = require('gulp-header-license'),
    browserSync = require('browser-sync').create(),
    injectString = require('gulp-inject-string'),
    rename = require('gulp-rename'),
    reload = browserSync.reload,
    cached = require('gulp-cached'),
    sequence = require('gulp-sequence'),
    babel = require('gulp-babel'),
    fs = require('fs');
let { i18n, style, getThirdparty } = require('./gulp/tasks');
let config = require('./gulp/config.json');
let argv = require('./gulp/resolve_argv.js');

/*
clean
1st:i18n style3rd js3rd
2nd:style js assets
3rd:inject
*/

gulp.task('clean', function () {
    return gulp.src('./dist', {
        read: false
    })
        .pipe(gulpClean({ force: true }));
});

gulp.task('style:3rd', function () {
    return gulp.src(getThirdparty('style'))
        .pipe(style())
        .pipe(cleanCss())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(reload({
            stream: true
        }));
    //no sms needed for 3rdparty plugins.
});

gulp.task('style', function () {
    return gulp.src([
        './src/less/**/*.less',
        './src/css/**/*.css',
    ])
        .pipe(cached('style'))
        .pipe(sourcemaps.init())
        .pipe(style())
        .pipe(cleanCss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('assets:img', function () {
    return gulp.src('./src/images/**/*')
        .pipe(gulp.dest('./dist/images/'));
});
gulp.task('assets:fonts', function () {
    return gulp.src('./src/font/**/*')
        .pipe(gulp.dest('./dist/font/'));
});
gulp.task('assets:font3rd', function() {
    return gulp.src(getThirdparty('font'))
        .pipe(gulp.dest('./dist/font'));
})
gulp.task('assets', sequence(['assets:img', 'assets:fonts', 'assets:font3rd']));

gulp.task('i18n', function () {
    return gulp.src('./src/i18n/*.txt')
        .pipe(i18n())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('js:es6', function () {
    return gulp.src( './src/es6/**/*')
        .pipe(cached('jses6'))
        .pipe( babel({
            presets: [ 'es2015' ]
        }))
        .pipe(uglify())
        .pipe(license(fs.readFileSync('misc/license-head.txt','utf-8')))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(reload({
            stream: true
        }));
})

gulp.task('js:3rd', function () {
    return gulp.src(getThirdparty('js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(rename({ prefix: 'pre-' }))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('js', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(cached('js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(license(fs.readFileSync('misc/license-head.txt','utf-8')))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('directcopy', function () {
    return gulp.src('./src/directcopy/**/*')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('inject', function () {
    //Mar 7 2017 - fixed injection seq.
    
    let presetOpts = Object.assign({
        isRelease: !!argv.release,
        apiRoot: argv['api-root'] || '/api/v0',
        misc: JSON.parse(argv['preset-misc'] || '{}')
    }, config);
    return gulp.src('./src/index.html')
        .pipe(
            inject(
                gulp.src(['./dist/js/**/pre-*.js'], { read: false }),
                {
                    ignorePath: '/dist',
                    removeTags: true,
                    starttag: '<!-- inject:pre:{{ext}} -->'
                }
            )
        )
        .pipe(
            inject(
                gulp.src(['./dist/js/**/*.js',
                    '!./dist/js/**/pre-*.js',
                    './dist/css/**/*.css'], { read: false }),
                {
                    ignorePath: '/dist',
                    removeTags: true,
                    starttag: '<!-- inject:{{ext}} -->'
                }
            )
        )
        .pipe(
            injectString.replace(
                '<!-- intron:1 -->', 
                `<script>window.diaryPresetOpts = ${JSON.stringify(presetOpts)};</script>`
            )
        )
        .pipe(gulp.dest('./dist/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('sync', function () {
    return gulp.src(config.sync)
    .pipe(gulp.dest('./src/directcopy'));
});

//This should work and looks pretty good:
gulp.task('default', sequence(
    'clean',
    ['i18n', 'style:3rd', 'js:3rd', 'js:es6'],
    ['style', 'js', 'assets'],
    'directcopy',
    'inject'
));

gulp.task('serve', ['default'], function () {
    browserSync.init({
        server: './dist'
    });

    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/images/**/*', ['assets']);
    gulp.watch('./src/fonts/**/*', ['assets']);
    gulp.watch('./src/css/**/*', ['style']);
    gulp.watch('./src/less/**/*', ['style']);
    gulp.watch('./src/*.html', ['inject']);
});
