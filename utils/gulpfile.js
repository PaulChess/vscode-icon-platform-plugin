const gulp = require('gulp');
const svgSymbols = require('gulp-svg-symbols');
const svgSymbols2js = require('gulp-svg-symbols2js');
const uglify = require('gulp-uglify');
const fs = require('fs-extra');
const minimist = require('minimist');

let options = minimist(process.argv.slice(2));
const svgPath = options['svgPath'];
const outPath = options['outPath'];

fs.removeSync(outPath);

// 生成svg-symbols.js
gulp.task('exportSvgSymbols', () => {
  return gulp
    .src(`${svgPath}/*.svg`)
    .pipe(svgSymbols())
    .pipe(svgSymbols2js())
    .pipe(gulp.dest(`${outPath}`));
});

// 压缩svg-symbols.js
gulp.task('minifySrc', () => {
  return gulp
    .src(`${outPath}/svg-symbols.js`)
    .pipe(uglify())
    .pipe(gulp.dest(outPath));
});

gulp.task('default', gulp.series('exportSvgSymbols', 'minifySrc'));
