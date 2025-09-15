const gulp = require("gulp");
const fs = require("fs");

// Task zum Erhöhen der Prepatch-Version in package.json
gulp.task("bump-prepatch", function (done) {
  // Lese die package.json Datei
  const pkg = JSON.parse(fs.readFileSync("./package.json"));

  // Teile die Version in Hauptversion und Pre-Release-Teile
  const versionParts = pkg.version.split("-");
  let mainVersion = versionParts[0].split(".");
  let preRelease = versionParts[1] ? versionParts[1].split(".") : ["0"];

  // Überprüfe, ob der Pre-Release-Teil eine Zahl ist und erhöhe ihn
  if (!isNaN(preRelease[0])) {
    preRelease[0] = (parseInt(preRelease[0]) + 1).toString();
  } else {
    // Falls keine Zahl, starte mit '1'
    preRelease = ["1"];
  }

  // Kombiniere die Hauptversion und den erhöhten Pre-Release-Teil
  pkg.version = `${mainVersion.join(".")}-${preRelease.join(".")}`;

  // Schreibe die aktualisierte Version zurück in package.json
  fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
  done();
});

// Optionaler Task zum Anzeigen der neuen Version in der Konsole
gulp.task("show-version", function (done) {
  const pkg = JSON.parse(fs.readFileSync("./package.json"));
  console.log(`Neue Version: ${pkg.version}`);
  done();
});

// Standard-Task zum Ausführen der Tasks bump-prepatch und show-version
gulp.task("prepatch", ["bump-prepatch", "show-version"]);
