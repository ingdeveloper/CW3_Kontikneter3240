define(["require", "exports"], function (require, exports) {
    "use strict";
    var SharedService = /** @class */ (function () {
        function SharedService() {
        }
        SharedService.getTime = function () {
            var _this = this;
            var currentTimeStamp = moment();
            this.time(currentTimeStamp);
            setTimeout(function () {
                _this.getTime();
            }, 500);
            return currentTimeStamp;
        };
        SharedService.globaleVariable = 123;
        SharedService.globaleObservable = ko.observable("XYZ");
        SharedService.time = ko.observable();
        return SharedService;
    }());
    return SharedService;
});
//define(
//    function () {
//        return {
//            globaleVariable: 123,
//            sharedObservable: ko.observable('CCW'),
//            time: ko.observable('ZEIT'),
//            rezept: ko.observable('CoWi Rezept'),
//            unit: 'CCW',
//            getTime:
//            function getTime() {
//                var self = this;
//                var currentTimeStamp = moment();
//                //var currentTime = moment().format("HH:mm:ss");
//                self.time(currentTimeStamp);
//                setTimeout(
//                    function () {
//                        self.getTime();
//                    }, 500);
//            }
//        };
//    });
//# sourceMappingURL=sharedService.js.map