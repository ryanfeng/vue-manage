var gulp = require('gulp'),
    rjs = require('gulp-requirejs'),
    livereload = require('gulp-livereload'),
    minifyCss = require('gulp-clean-css'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify');           //压缩

/*,
notify = require('gulp-notify'),
minifyCss = require('gulp-minify-css')*/

gulp.task('watch', function () {    // 这里的watch，是自定义的，写成live或者别的也行
    var server = livereload(); 
    //压缩less为css
    gulp.watch('css/**/*.less', function (file) {
        gulp.src(['css/**/*.less','!css/public/{base,header,icon,public,reset,alone,colorVar,compatibilityVar,form,list,menu,model,var,table,tools,page,selectordie_theme,alertbox}.less']) //该任务针对的文件
            .pipe(less()) //该任务调用的模块
            .pipe(gulp.dest('css/')) //将会在src/css下生成index.css
            .pipe(minifyCss())
            .pipe(gulp.dest('css/'));
    });
    //压缩js
    gulp.watch(['js/public/*.js','js/config.js'], function (file) {
        rjs({ 
            baseUrl: './js',
            out: 'common.js',
            findNestedDependencies: true,
            mainConfigFile: './js/config.js',
            name : "common_init"
            // ... more require.js options
        }).pipe(gulp.dest('js/')); // pipe it to the output DIR  .pipe(uglify())
    });
});

gulp.task('js',function(){
    rjs({
        baseUrl: './js',
        out: 'common.js',
        findNestedDependencies: true,
        mainConfigFile: './js/config.js',
        name : "common_init"
        // ... more require.js options
    }).pipe(uglify()).pipe(gulp.dest('js/')); // pipe it to the output DIR  .pipe(uglify())
});