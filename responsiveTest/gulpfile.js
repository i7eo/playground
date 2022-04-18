var gulp = require('gulp');
var rev = require('gulp-rev');     //打上版本号，这里的版本号是哈希算法后的一串数字
var revReplace = require('gulp-rev-replace');    //替换版本号
var useref = require('gulp-useref');     //执行bulid注释语句
var filter = require('gulp-filter');     //像水流一样执行
var uglify = require('gulp-uglify');    //压缩js代码插件
var csso = require('gulp-csso');        //压缩css代码插件

gulp.task('default' , function () {
    var jsFilter = filter('**/*.js' , {restore : true});
    var cssFilter = filter('**/*.css' , {restore : true});
    var htmlFilter = filter(['**/*' , '!**/index.html'] , {restore : true});  //'!**/index.html'的意思是版本除了index.html页面其他都可以加，入口文件默认规定不加版本号。

    return gulp.src('src/index.html')//找到package.json中的入口文件，这里需要对应
        .pipe(useref())              //执行index.html中的bulid注释语句，压缩css与js
        .pipe(jsFilter)              //抓取js文件放入开辟的当前管道流中
        .pipe(uglify())              //压缩js代码
        .pipe(jsFilter.restore)      //送回原有的总管道流中
        .pipe(cssFilter)             //css代码与js过程类似
        .pipe(csso())
        .pipe(cssFilter.restore)
        .pipe(htmlFilter)
        .pipe(rev())                  //打上版本号
        .pipe(htmlFilter.restore)
        .pipe(revReplace())           //如若在文件中修改代码，新的版本号会自动覆盖旧的版本号
        .pipe(gulp.dest('dist'))      //打包到dist文件中
});
