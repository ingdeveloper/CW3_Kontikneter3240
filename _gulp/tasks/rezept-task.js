// tslint:disable: object-literal-sort-keys
// tslint:disable: max-line-length
var gulp = require("gulp");
var del = require("del");

var root = ".";
var paths = {
  root: root,
  viewModels: {
    dlg: `${root}/App/src/viewModels/cowi/dialoge`,
    main: `${root}/App/src/viewModels/cowi`,
    comp: `${root}/App/src/customComponents`,
  },
  views: {
    dlg: `${root}/App/src/views/cowi/dialoge`,
    main: `${root}/App/src/views/cowi`,
    comp: `${root}/App/src/customComponents`,
  },
  css: `${root}\\ContentCowi/css`,
  services: `${root}/App/src/viewModels/cowi/services`,
  quelle: `${root}/node_modules/ccw-rezeptur`,
};
// #region Rezept Download
gulp.task("rezUpd:css", () => {
  // console.log(paths.css);
  return gulp.src([
    paths.quelle + "/ContentCowi/css/rezeptur.css"
  ])
    .pipe(gulp.dest(paths.css));
});

gulp.task("rezUpd:services", () => {
  return gulp.src([
    paths.quelle + "/App/src/viewModels/cowi/services/tabBuilder.ts",
    paths.quelle + "/App/src/viewModels/cowi/services/getClientInfo.ts",
    paths.quelle + "/App/src/viewModels/cowi/services/rezLog.ts",
    paths.quelle + "/App/src/viewModels/cowi/services/rezValues.ts",
    paths.quelle + "/App/src/viewModels/cowi/services/rezHttpApi.ts",
    paths.quelle + "/App/src/viewModels/cowi/services/rezService.ts",
    paths.quelle + "/App/src/viewModels/cowi/services/rezServiceApi.ts",
    paths.quelle + "/App/src/viewModels/cowi/services/dtHandle.ts",
    paths.quelle + "/App/src/viewModels/cowi/services/ccw-contextmenu.ts",
  ])
    .pipe(gulp.dest(paths.services));
});

gulp.task("rezUpd:viewModels", () => {
  return gulp.src([
    paths.quelle + "/App/src/viewModels/cowi/dialoge/cwRezDlg*.ts",
    paths.quelle + "/App/src/viewModels/cowi/dialoge/cwBdeDlg.ts"
  ])
    .pipe(gulp.dest(paths.viewModels.dlg));
});

gulp.task("rezUpd:views", () => {
  return gulp.src([
    paths.quelle + "/App/src/views/cowi/dialoge/cwRezDlg*.html",
    paths.quelle + "/App/src/views/cowi/dialoge/cwBdeDlg.html"
  ])
    .pipe(gulp.dest(paths.views.dlg));
});

gulp.task("rezUpd:interface", () => {
  return gulp.src([
    paths.quelle + "/App/src/viewModels/cowi/IRezeptur.d.ts",
    paths.quelle + "/App/src/viewModels/cowi/rezepturEnums.ts",
  ])
    .pipe(gulp.dest(paths.viewModels.main));
});

gulp.task("rezUpd:components", () => {
  return gulp.src([
    paths.quelle + "/App/src/customComponents/rez*.component.*",
    paths.quelle + "/App/src/customComponents/component-rezept-base.model.ts"
  ])
    .pipe(gulp.dest(paths.viewModels.comp));
});

// gulp.task("rezUpd:baseModel", () => {
//   return gulp.src(paths.quelle + "/App/src/customComponents/component-rezept-base.model.ts")
//     .pipe(gulp.dest(paths.viewModels.comp));
// });

// Task Rezept Download
// vom Fileserver ins Projekt speichern
gulp.task("rezUpdate", [
  "rezUpd:css",
  "rezUpd:services",
  "rezUpd:components",
  "rezUpd:interface",
  "rezUpd:views",
  "rezUpd:viewModels",
  // "rezUpd:baseModel"
]);
// #endregion

// #region löscht die Rezept-Dateien aus dem Project
// paths.services + '/xmlRequest.ts',
gulp.task("rezDelFiles", () => {
  return del([
    paths.css + "/rezeptur.css",
    paths.services + "/tabBuilder*",
    paths.services + "/getClientInfo*",
    paths.services + "/getGebinde*",
    paths.services + "/rezLog*",
    paths.services + "/rezValues*",
    paths.services + "/rezHttpApi*",
    paths.services + "/rezService*",
    paths.services + "/rezServiceApi*",
    paths.services + "/dtHandle*",
    paths.viewModels.dlg + "/cwRezDlg*.*",
    paths.viewModels.dlg + "/cwBdeDlg.ts",
    paths.viewModels.main + "/IRezeptur*",
    paths.viewModels.main + "/rezepturEnums.*",
    paths.views.dlg + "/cwRezDlg*",
    paths.views.comp + "/rez-*.component.*",
    paths.viewModels.comp + "/component-rezept-base.model.*",
    "/App/src/viewModels/cowi/services/ccw-contextmenu.ts"
  ]);
});
// #endregion