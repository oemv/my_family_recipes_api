import gulp from "gulp";
import babel from "gulp-babel";

gulp.task("default", function () {
  return gulp.src("server/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});