'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpRubySass = require('gulp-ruby-sass');

var _gulpRubySass2 = _interopRequireDefault(_gulpRubySass);

var _gulpAutoprefixer = require('gulp-autoprefixer');

var _gulpAutoprefixer2 = _interopRequireDefault(_gulpAutoprefixer);

var _browserSync = require('browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

var _gulpJshint = require('gulp-jshint');

var _gulpJshint2 = _interopRequireDefault(_gulpJshint);

var _gulpUglify = require('gulp-uglify');

var _gulpUglify2 = _interopRequireDefault(_gulpUglify);

var _gulpRename = require('gulp-rename');

var _gulpRename2 = _interopRequireDefault(_gulpRename);

var _gulpConcat = require('gulp-concat');

var _gulpConcat2 = _interopRequireDefault(_gulpConcat);

var _gulpNotify = require('gulp-notify');

var _gulpNotify2 = _interopRequireDefault(_gulpNotify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reload = _browserSync2.default.reload;

var dirs = {
	src: 'src',
	css: '',
	js: ''
};

var sassPaths = {
	src: dirs.src + '/**/*.scss',
	dest: dirs.css
};

var jsPaths = {
	src: dirs.src + '/**/*.+(es6|js)',
	dest: dirs.js
};

_gulp2.default.task('styles', function () {
	return (0, _gulpRubySass2.default)(sassPaths.src, { style: 'expanded' }).pipe((0, _gulpAutoprefixer2.default)('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')).pipe(_gulp2.default.dest(sassPaths.dest)).pipe(reload({ stream: true }));
});

_gulp2.default.task('scripts', function () {
	return _gulp2.default.src(jsPaths.src).pipe((0, _gulpJshint2.default)({ 'esnext': true })).pipe(_gulpJshint2.default.reporter('default')).pipe((0, _gulpBabel2.default)({
		presets: ['es2015']
	})).pipe((0, _gulpConcat2.default)('index.js')).pipe(_gulp2.default.dest(jsPaths.dest)).pipe((0, _gulpRename2.default)({ suffix: '.min' })).pipe((0, _gulpUglify2.default)()).pipe(_gulp2.default.dest(jsPaths.dest)).pipe((0, _gulpNotify2.default)({ message: 'Scripts task complete' })).pipe(reload({ stream: true }));
});

_gulp2.default.task('wjs', function () {
	_gulp2.default.watch(jsPaths.src, function () {
		_gulp2.default.run('scripts');
	});
});

_gulp2.default.task('watch', function () {
	_browserSync2.default.init({
		//files: "**",
		server: {
			baseDir: "./"
		}
	});
	_gulp2.default.watch(sassPaths.src, ['styles']).on('change', reload);
	_gulp2.default.watch(jsPaths.src, ['scripts']).on('change', reload);
	_gulp2.default.watch("*.html").on('change', reload);
});
