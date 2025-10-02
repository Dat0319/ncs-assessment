const gulp = require('gulp');
const shell = require('gulp-shell');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const argv = require('argv');

function minifyHTML() {
  return gulp
    .src('dist/assets/html/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true,
        removeEmptyElements: true,
      })
    )
    .pipe(gulp.dest('dist/assets/html'));
}

function minifyJS() {
  return gulp.src('dist/').pipe(uglify()).pipe(gulp.dest('dist'));
}

gulp.task('genDocument', (done) => {
  return shell.task(['apidoc-swagger -i src/ -o doc/'])(done);
});

gulp.task('copyNonTS', gulp.parallel(minifyHTML, minifyJS));

gulp.task('watch', (done) => {
  return shell.task([
    'gulp genDocument',
    `cross-env NODE_ENV=${
      argv['env'] || 'local'
    } nodemon --watch 'src/**/*.ts' --ignore src/migrations --exec node --inspect --require ts-node/register ./src/index.ts`,
    gulp.watch('src/**/*.ts', gulp.series('genDocument')),
  ])(done);
});

gulp.task('test', (done) => {
  return shell.task(['jest'])(done);
});

gulp.task('test:coverage', (done) => {
  return shell.task(['rimraf coverage', 'jest --coverage'])(done);
});

gulp.task('start:local', (done) => {
  return shell.task('gulp watch --env=local')(done);
});

gulp.task('start:production', (done) => {
  return shell.task('gulp watch --env=production')(done);
});

gulp.task('build:base', (done) => {
  return shell.task(['rimraf dist/', 'tsc'])(done);
  // return shell.task(['gulp test:coverage', 'rimraf dist/', 'tsc'])(done);
});

gulp.task('build:local', async (done) => {
  return shell.task(['gulp build:base'])(done);
});

gulp.task('build:production', async (done) => {
  return shell.task(['gulp build:base', 'gulp copyNonTS'])(done);
});
