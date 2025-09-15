define(["require", "exports"], function (require, exports) {
    "use strict";
    var CookieService = /** @class */ (function () {
        function CookieService() {
        }
        CookieService.set = function (name, value, options) {
            $.cookie.raw = true;
            $.cookie(name, encodeURIComponent(value), options);
        };
        CookieService.get = function (name, converter) {
            $.cookie.raw = true;
            var result = $.cookie(name, converter);
            if (result === undefined)
                return result;
            return decodeURIComponent(result);
        };
        CookieService.remove = function (name, options) {
            return $.removeCookie(name, options);
        };
        return CookieService;
    }());
    return CookieService;
});
//# sourceMappingURL=cookieService.js.map