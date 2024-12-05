// 定義

const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssSorter = require("css-declaration-sorter");
const mmq = require("gulp-merge-media-queries");
const browserSync = require("browser-sync");
const cleanCss = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const htmlBeautify = require("gulp-html-beautify");



//動作確認(checked)
function test(done){
    console.log("Hello gulp");
    done();
}

//Sass
function compileSass() {
  return gulp.src("./assets/sass/**/*.scss") //入力
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssSorter()]))//ベンダープレフィックスの付与 cssの並び順指定
    .pipe(mmq()) //メディアクエリをまとめる
    .pipe(sass()) //.scssを.cssで出力
    .pipe(gulp.dest("../assets/css")) //出力
    .pipe(cleanCss()) //css圧縮
    .pipe(rename({suffix: ".min"})) //ファイル名に.minを付ける
    .pipe(gulp.dest("../assets/css/")); //圧縮ファイルを出力
}

//更新を監視
function watch() {
	gulp.watch("./assets/sass/**/*.scss",gulp.series(compileSass, browserReload));
	gulp.watch("./assets/js/**/*.js", gulp.series(minJS, browserReload));
	gulp.watch("./assets/*.php", gulp.series(copyPHP, browserReload));
}

//ブラウザの立ち上げ
function browserInit(done) {
	browserSync.init({
		server: {
			baseDir: "../",
        notify: false,
		}
	});
	done();
}

//ブラウザの自動リロード
function browserReload(done) {
	browserSync.reload();
	done();
}

//JSファイルの圧縮
function minJS() {
    return gulp.src("./assets/js/**/*.js") //入力
    .pipe(gulp.dest("../assets/js/")) //圧縮前のファイルを出力
    .pipe(uglify()) //圧縮
    .pipe(rename({suffix: ".min"}))//ファイル名に.minを付ける
    .pipe(gulp.dest("../assets/js/")); //圧縮ファイルの出力
}

exports.test = test;
exports.compileSass = compileSass;
exports.watch = watch;
exports.browserInit = browserInit;
exports.browserReload = browserReload;
exports.minJS = minJS;
exports.develop = gulp.parallel(browserInit, watch);


