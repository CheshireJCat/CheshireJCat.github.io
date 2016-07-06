import gulp from "gulp"
import sass from 'gulp-ruby-sass'
import autoprefixer from 'gulp-autoprefixer'
import browserSync from 'browser-sync'
import babel from 'gulp-babel'
import jshint from 'gulp-jshint'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'
import concat from 'gulp-concat'
import notify from 'gulp-notify'

const reload = browserSync.reload;

const dirs = {
	src:'src',
	css:'',
	js:''
};

const sassPaths = {
	src:`${dirs.src}/**/*.scss`,
	dest:dirs.css
};

const jsPaths = {
	src:`${dirs.src}/**/*.+(es6|js)`,
	dest:dirs.js
};

gulp.task('styles', () => {
	return sass(sassPaths.src,{ style: 'expanded'})
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(sassPaths.dest))
		.pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
	return gulp.src(jsPaths.src)
		.pipe(jshint({'esnext':true}))
	    .pipe(jshint.reporter('default'))
		.pipe(babel({
			presets: ['es2015']
		}))
	    .pipe(concat('index.js'))
		.pipe(gulp.dest(jsPaths.dest))
	    .pipe(rename({ suffix: '.min' }))
	    .pipe(uglify())
	    .pipe(gulp.dest(jsPaths.dest))
	    .pipe(notify({ message: 'Scripts task complete' }))
		.pipe(reload({stream: true}));
});

gulp.task('wjs',()=>{
	gulp.watch(jsPaths.src, function(){
        gulp.run('scripts');
    });
});

gulp.task('watch', () => {
	browserSync.init({
		//files: "**",
		server: {
			baseDir: "./"
		}
	});
	gulp.watch(sassPaths.src, ['styles']).on('change', reload);
	gulp.watch(jsPaths.src, ['scripts']).on('change', reload);
	gulp.watch("*.html").on('change', reload);
})

