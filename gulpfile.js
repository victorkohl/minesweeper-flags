const gulp = require('gulp');
const eslint = require('gulp-eslint');
const excludeGitignore = require('gulp-exclude-gitignore');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');

gulp.task('static', function() {
  return gulp
    .src(['**/*.js', '!dist/**'])
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', function(cb) {
  let mochaErr;

  gulp
    .src('test/**/*.js')
    .pipe(
      mocha({
        reporter: 'dot',
        compilers: 'js:babel-core/register,babel-polyfill'
      })
    )
    .on('error', function(err) {
      mochaErr = err;
    })
    .on('end', function() {
      cb(mochaErr);
    });
});

gulp.task('build', function() {
  return gulp
    .src('lib/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('prepublish', ['build']);
gulp.task('default', ['static', 'test']);
