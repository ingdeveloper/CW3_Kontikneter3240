var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define(["require", "exports", "../../services/logger"], function (require, exports, Logger) {
    "use strict";
    var RecipeJSONService = /** @class */ (function () {
        function RecipeJSONService() {
        }
        RecipeJSONService.prototype.load = function (inputId) {
            return __awaiter(this, void 0, void 0, function () {
                var input, files, content, files_1, files_1_1, file, data, e_1_1;
                var e_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (typeof window.FileReader !== 'function') {
                                Logger.warn(this, "The file API isn't supported");
                                return [2 /*return*/];
                            }
                            input = document.getElementById(inputId);
                            if (!!input) return [3 /*break*/, 1];
                            throw "Couldn't find the fileinput element.";
                        case 1:
                            if (!!input.files) return [3 /*break*/, 2];
                            throw "This browser doesn't seem to support the `files` property of file inputs.";
                        case 2:
                            if (!!input.files[0]) return [3 /*break*/, 3];
                            throw "Please select a file before clicking 'Load'";
                        case 3:
                            files = input.files;
                            content = [];
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 9, 10, 11]);
                            files_1 = __values(files), files_1_1 = files_1.next();
                            _b.label = 5;
                        case 5:
                            if (!!files_1_1.done) return [3 /*break*/, 8];
                            file = files_1_1.value;
                            return [4 /*yield*/, this.readFileAsync(file)];
                        case 6:
                            data = _b.sent();
                            content.push(data);
                            _b.label = 7;
                        case 7:
                            files_1_1 = files_1.next();
                            return [3 /*break*/, 5];
                        case 8: return [3 /*break*/, 11];
                        case 9:
                            e_1_1 = _b.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 11];
                        case 10:
                            try {
                                if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 11:
                            input.value = "";
                            return [2 /*return*/, content];
                    }
                });
            });
        };
        RecipeJSONService.prototype.readFileAsync = function (file) {
            return __awaiter(this, void 0, void 0, function () {
                var fileReader, resultFile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileReader = new FileReader();
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    fileReader.onerror = function () {
                                        fileReader.abort();
                                        reject(new DOMException("Problem parsing input file."));
                                    };
                                    fileReader.onload = function () {
                                        resolve(fileReader.result);
                                    };
                                    fileReader.readAsText(file);
                                })];
                        case 1:
                            resultFile = _a.sent();
                            return [2 /*return*/, resultFile];
                    }
                });
            });
        };
        RecipeJSONService.prototype.download = function (content, exportFileName) {
            var binaryData = new Blob(["\ufeff", content], { type: "application/json" });
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(binaryData, exportFileName + ".json");
            }
            else {
                var link = window.document.createElement('a');
                var objectURL = window.URL.createObjectURL(binaryData);
                link.setAttribute('href', objectURL);
                link.setAttribute('download', exportFileName + ".json");
                // Append anchor to body.
                document.body.appendChild(link);
                link.click();
                // Remove anchor from body
                document.body.removeChild(link);
                window.URL.revokeObjectURL(objectURL);
            }
        };
        return RecipeJSONService;
    }());
    return RecipeJSONService;
});
//# sourceMappingURL=recipe-json.service.js.map