'use strict';
var version = require("../actions/extract-app-version")();
var gulp = require('gulp');
var FtpDeploy = require('ftp-deploy');
var open = require('gulp-open');
var gutil = require('gulp-util');
var Promise = require('bluebird');
var lib = require('ftp-deploy/src/lib');
var gulpSequence = require('gulp-sequence');

var ftpDeploy = new FtpDeploy()
var config = {
  user: 'Wf_Deploy-User',
  password: 'aE8VqQgi0xx0k',
  host: 'wf-broet3240',
  port: 21,
  localRoot: `releases/${version}/app`,
  remoteRoot: 'Kontikneter',
  include: ['*.*', '**/*'],
  exclude: ['.git', '.idea', 'tmp/*', 'node_modules/*'],
  /** delete ALL existing files at destination before uploading, if true */
  deleteRemote: true,
  // Passive mode is forced (EPSV command is not sent)
  forcePasv: true,
  // use sftp or ftp
  sftp: false,
  /** Anzahl Ordner, die in remoteRoot nach dem löschen bleiben sollen */
  remaining: 5
};
let name = ''
const updateCallback = (data) => {
  if (!name.includes(data.filename)) {
    gutil.log('> ' + gutil.colors.green(((data.transferredFileCount * 100) / data.totalFilesCount).toFixed(2) + '%'), data.filename);
  }
  name = data.filename
}
const errorCallback = (data) => {
  '> ' + gutil.colors.red(data.err)
}
const log = (data) => {
  gutil.log('> ' + gutil.colors.blue(data))
}
ftpDeploy.on('uploading', updateCallback);
ftpDeploy.on('uploaded', updateCallback);
ftpDeploy.on('upload-error', errorCallback);
ftpDeploy.on('log', log);

/**
 * Ziel nach existierenden Ordernamen
 * durchsuchen ggf. Umbenennen
 * @param {JSON} list Liste von allen Ordner im Ziel
 * @param {String} oldName gesuchte Ordnername
 * @returns
 */
const rename = async (list, oldName) => {
  oldName = oldName.replace(/\//g, '');
  gutil.log('> ' + 'suche Ordner: ' + '\'' + oldName + '\'');
  for (var key in list) {
    if (list.hasOwnProperty(key)) {
      var element = list[key]
      if (element.name == oldName && element.type == 'd') {
        var newName = oldName + '_' + (element.date.toISOString().slice(0, 10) + element.date.toLocaleTimeString()).replace(/[\s-:]/gm, '')
        await ftpDeploy.ftp.rename(oldName, newName)
        gutil.log('> ' + 'Ordner gefunden - umbenannt in \'' + newName + '\'')
        return await Promise.resolve()
      }
    }
  }
  gutil.log('> ' + 'Ordner \'' + oldName + '\' nicht gefunden');
  return Promise.resolve()
}

/**
 * Sucht die ältere Ordner und lässt nur die = quantity
 * jüngste Ordner stehen
 * @param {JSON} list Liste von Ordner/Dateien von remoteRoot
 * @param {string} filterName gesuchte Name für Löschen
 * @param {number} quantity Anzahl Ordner, die ungerührt werden sollen
 */
// var delOldOrders = async (list, filterName, quantity) => {
const delOldOrders = (list, filterName, quantity) => {
  return list.filter(f => f.name.includes(filterName.replace(/\//g, '') + '_'))
    .sort((a, b) => b.date - a.date)
    .slice(quantity - 1 || 1)
    .map(d => d.name)
}

/**
 * Dateizähler
 * @param {JSON} files
 * @returns {number} Anzahl gezählten Dateien
 */
const countFiles = (files) => files
  .map(f => f.length)
  .reduce((a, b) => a + b)
const deploy = async () => {
  try {
    await ftpDeploy.connect(config)
    const list = await ftpDeploy.ftp.list('/')
    // 1. aktuellen Ordner umbenennen
    await rename(list, config.remoteRoot)
    // 2. älteste Ordner finden, ggf.  löschen
    const orderNames = delOldOrders(list, config.remoteRoot, config.remaining)
    for (let index = 0; index < orderNames.length; index++) {
      await ftpDeploy.ftp.rmdir(orderNames[index], true)
      gutil.log('> ' + '\'' + orderNames[index] + '\'' + " gelöscht!");
    }
    // 3. deploy Distribution
    await lib.checkIncludes(config)
    await lib.getPassword(config)
    ftpDeploy.deleteRemote(config)
    const resp = await ftpDeploy.checkLocalAndUpload(config)
    ftpDeploy.ftp.end();
    gutil.log('> ' + gutil.colors.yellow("Uploaded: ", countFiles(resp), " files!"))
  } catch (err) {
    throw err
  }
}

// Deploy FTP
gulp.task('deploy', function (done) {
  deploy()
    .then(() => done())
    .catch(err => gutil.log(gutil.colors.red(err)))
  // .catch(err => console.log(err)) // für detailierte logs
});
// öffnen im Browser
gulp.task('open', function (done) {
  gulp.src(__filename)
    .pipe(open({
      // uri: 'http://wf-ersatz-w2k-3/wcfTester',
      uri: 'http://' + config.host + '/' + config.remoteRoot,
      app: 'msedge'
    }))
  done();
});
gulp.task('ftp', gulpSequence('deploy', 'open'));