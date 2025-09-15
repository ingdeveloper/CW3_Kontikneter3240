define(["require", "exports", "./http"], function (require, exports, HttpService) {
    "use strict";
    var ExampleService = /** @class */ (function () {
        function ExampleService() {
        }
        ExampleService.prototype.getScadaVersion = function () {
            var url = "/_SERVICES/WebServices/WCF/UtilityServices.svc/js/GetCurrentVersion";
            return HttpService.post(url)
                .then(function (response) {
                return response.d;
            });
        };
        ExampleService.prototype.getWeather = function (city, apiKey) {
            if (city === void 0) { city = null; }
            if (apiKey === void 0) { apiKey = null; }
            var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "}&APPID=" + apiKey;
            return HttpService.get(url)
                .then(function (response) {
                return response;
            });
        };
        return ExampleService;
    }());
    return ExampleService;
});
//# sourceMappingURL=exampleService.js.map