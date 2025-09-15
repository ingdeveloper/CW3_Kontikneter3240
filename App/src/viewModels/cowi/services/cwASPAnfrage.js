define(["require", "exports", "../../../services/http"], function (require, exports, HttpService) {
    "use strict";
    var WebserviceLog = /** @class */ (function () {
        function WebserviceLog() {
        }
        WebserviceLog.prototype.getAspLogdataSite = function (url) {
            return HttpService.get(url)
                .then(function (response) {
                //console.info(response);
                return response;
            });
        };
        WebserviceLog.prototype.getAspRezeptInfo = function (url) {
            return HttpService.get(url)
                .then(function (response) {
                //console.info(response);
                return response;
            })
                .catch(function (err) {
                //console.info(err);
                return err;
            });
        };
        WebserviceLog.prototype.getAspLocal = function (urlLocal, urlRemote, queryStrings) {
            return HttpService.get(urlLocal + '?urlRemote=' + urlRemote + '&queryStrings=' + queryStrings)
                .then(function (response) {
                //console.info(response);
                return response;
            })
                .catch(function (err) {
                //console.info(err);
                return err;
            });
        };
        WebserviceLog.prototype.getAsp = function (url) {
            return HttpService.get(url)
                .then(function (response) {
                // console.info(response);
                return response;
            })
                .catch(function (err) {
                // console.info(err);
                return err;
            });
        };
        return WebserviceLog;
    }());
    return WebserviceLog;
});
//# sourceMappingURL=cwASPAnfrage.js.map