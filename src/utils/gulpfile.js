const gulp = require('gulp');
const svgSymbols = require('gulp-svg-symbols');
const svgSymbols2js = require('gulp-svg-symbols2js');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const fs = require('fs-extra');
const minimist = require('minimist');
const { join } = require('path');

let options = minimist(process.argv.slice(2));
const svgPath = options['svgPath'];
const outPath = options['outPath'];

fs.removeSync(outPath);

// 生成svg-symbols.js
gulp.task('exportSvgSymbols', (done) => {
  return gulp
    .src(`${svgPath}/*.svg`)
    .pipe(svgSymbols())
    .pipe(svgSymbols2js())
    .pipe(gulp.dest(`${outPath}`));
});

// 压缩svg-symbols.js
gulp.task('minifySrc', (done) => {
  return gulp
    .src(`${outPath}/svg-symbols.js`)
    .pipe(uglify())
    .pipe(gulp.dest(outPath));
    done();
});

gulp.task('default', gulp.series('exportSvgSymbols', 'minifySrc'));