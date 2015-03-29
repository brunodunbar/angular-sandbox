var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var $ = require('gulp-load-plugins')(['gulp-*']);

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = {
    src: 'app',
    dist: 'dist',
    environment: process.env.NODE_ENV
};

function isProduction() {
    return config.environment === 'production';
}

function isDevelopment() {
    return !isProduction();
}

gulp.plumbedSrc = function( ) {
    return gulp.src.apply(gulp, arguments)
            .pipe($.plumber({errorHandler: function(error) {
                    console.log(error);
                    this.emit('end');
                }}));
};

gulp.task('font:bower', function() {
    return gulp.plumbedSrc(mainBowerFiles({filter: '**/fonts/*'}))
            .pipe(gulp.dest(config.dist + '/fonts'))
            .pipe(reload({stream: true}));
});

gulp.task('css:bower', function() {
    return gulp.plumbedSrc(mainBowerFiles({filter: '**/*.css'}))
            .pipe($.if(isDevelopment(), $.sourcemaps.init()))
            .pipe($.concat('vendor.css'))
            .pipe($.if(isDevelopment(), $.sourcemaps.write()))
            .pipe(gulp.dest(config.dist))
            .pipe(reload({stream: true}));
});

gulp.task('css', function() {
    return gulp.plumbedSrc([config.src + '/**/*.css'])
            .pipe($.if(isDevelopment(), $.sourcemaps.init()))
            .pipe($.concat('app.css'))
            .pipe($.if(isDevelopment(), $.sourcemaps.write()))
            .pipe(gulp.dest(config.dist))
            .pipe(reload({stream: true}));
});

gulp.task('js:template', function() {
    return gulp.plumbedSrc([config.src + '/**/*.html', '!' + config.src + '/index.html'])
            .pipe($.if(isProduction(), $.minifyHtml()))
            .pipe($.angularTemplatecache({module: 'app'}))
            .pipe(gulp.dest(config.dist))
            .pipe(reload({stream: true}));
});

gulp.task('js:bower', function() {

    var filter = [
        '**/*.js',
        '!**/angular-mocks.js',
        '!**/bootstrap*.js'
    ];

    return gulp.plumbedSrc(mainBowerFiles({filter: filter}))
            .pipe($.if(isDevelopment(), $.sourcemaps.init()))
            .pipe($.concat('vendor.js'))
            //.pipe($.if(isProduction(), $.uglify()))
            .pipe($.if(isDevelopment(), $.sourcemaps.write()))
            .pipe(gulp.dest(config.dist))
            .pipe(reload({stream: true}));
});

gulp.task('js', function() {
    return gulp.plumbedSrc([config.src + '/**/*.js', '!' + config.src + '/**/*.spec.js'])
            .pipe($.angularFilesort())
            .pipe($.jshint())
            .pipe($.jshint.reporter('default'))
            .pipe($.jscs())
            .pipe($.if(isDevelopment(), $.sourcemaps.init()))
            .pipe($.concat('app.js'))
            .pipe($.if(isProduction(), $.uglify()))
            .pipe($.if(isDevelopment(), $.sourcemaps.write()))
            .pipe(gulp.dest(config.dist))
            .pipe(reload({stream: true}));
});

gulp.task('html', function() {
    return gulp.plumbedSrc([config.src + '/index.html'])
            .pipe(gulp.dest(config.dist))
            .pipe(reload({stream: true}));
});

gulp.task('clean', function(done) {
    del([config.dist], done);
});

gulp.task('build', ['clean'], function(done) {
    runSequence(['js:template', 'js:bower', 'js', 'css:bower', 'css', 'font:bower', 'html'], done);
});

gulp.task('watch', ['build'], function() {
    gulp.watch([config.src + '/**/*.html', '!' + config.src + '/index.html'], ['js:template']);
    gulp.watch(['bower.json'], ['css:bower', 'js:bower', 'font:bower']);
    gulp.watch([config.src + '/**/*.js', '!' + config.src + '/**/*.spec.js'], ['js']);
    gulp.watch([config.src + '/**/*.css'], ['css']);
    gulp.watch([config.src + '/index.html'], ['html']);
});

gulp.task('serve', ['watch'], function() {
    browserSync({
        server: config.dist
    });
});