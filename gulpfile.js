/// <binding BeforeBuild='set-index, build' Clean='clean' ProjectOpened='watch' />
require("require-dir")("_gulp/tasks");
require("./node_modules/ccw-rezeptur/_gulp/tasks/rezept-task.js");
require("./node_modules/ccw-update-files/ccw-update-files-task-v3-8.js"); //Version 3.8   bei Bedarf aktivieren
