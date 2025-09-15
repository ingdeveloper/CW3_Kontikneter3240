var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./httpApi"], function (require, exports, HttpApi) {
    "use strict";
    var SymbolicTextsServiceApi = /** @class */ (function (_super) {
        __extends(SymbolicTextsServiceApi, _super);
        function SymbolicTextsServiceApi() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getAllLanguages = function () { return _this.post("SymbolicTextsService", "GetAllLanguages", null); };
            _this.getSymbolicTextTranslations = function (languageIds, startIndex, count, includedSymbolicTexts) { return _this.post("SymbolicTextsService", "GetSymbolicTextTranslations", {
                languageIDs: languageIds,
                startIndex: startIndex,
                count: count,
                includedSymbolicTexts: includedSymbolicTexts
            }); };
            return _this;
        }
        return SymbolicTextsServiceApi;
    }(HttpApi));
    return SymbolicTextsServiceApi;
});
//# sourceMappingURL=symbolicTextsServiceApi.js.map