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
define(["require", "exports", "./api", "./logger", "./localSymbolicTextService", "./connectorBase", "./i4/i4SymbolicTextsServiceApi", "./cookieService"], function (require, exports, Api, Logger, LocalSymbolicTextService, ConnectorBase, i4SymbolicTextsServiceApi, CookieService) {
    "use strict";
    var SymbolicTextLoadOptions = /** @class */ (function () {
        function SymbolicTextLoadOptions(languageId) {
            this.startIndex = 0;
            this.count = 2000000;
            this.includedSymbolicTexts = IncludedSymbolicTexts.SymbolicTexts | IncludedSymbolicTexts.ExtendedAlarmProperties; // | SymbolicTextOptions.InternallyUsed;
            this._isLoaded = false;
            this.languageIds = [languageId];
        }
        Object.defineProperty(SymbolicTextLoadOptions.prototype, "isLoaded", {
            get: function () {
                return this._isLoaded;
            },
            set: function (value) {
                this._isLoaded = value;
            },
            enumerable: false,
            configurable: true
        });
        return SymbolicTextLoadOptions;
    }());
    var SymbolicTextsService = /** @class */ (function () {
        function SymbolicTextsService() {
        }
        Object.defineProperty(SymbolicTextsService, "symbolicTextApi", {
            get: function () {
                {
                    var symbolicTextApi = void 0;
                    symbolicTextApi = Api.symbolicTextsService;
                    if (window.usei4Connector) {
                        symbolicTextApi = new i4SymbolicTextsServiceApi();
                    }
                    return symbolicTextApi;
                }
            },
            enumerable: false,
            configurable: true
        });
        SymbolicTextsService.setLanguageId = function (languageId) {
            CookieService.set(SymbolicTextsService.languageCookieName, languageId, {
                expires: 30
            });
            this.currentLanguageId(languageId);
            this.updateClientConfiguration();
        };
        // private static getLanguagesAsyncPromise: Promise<LanguageDTO[]> = null;
        SymbolicTextsService.getLanguagesAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!!SymbolicTextsService.languages) return [3 /*break*/, 2];
                            _a = SymbolicTextsService;
                            return [4 /*yield*/, SymbolicTextsService.symbolicTextApi.getAllLanguages()];
                        case 1:
                            _a.languages = _b.sent();
                            _b.label = 2;
                        case 2: return [2 /*return*/, SymbolicTextsService.languages];
                    }
                });
            });
        };
        SymbolicTextsService.setLanguageAsync = function (languageId, loadSymbolicTexts) {
            if (loadSymbolicTexts === void 0) { loadSymbolicTexts = true; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            SymbolicTextsService.translations[languageId] = SymbolicTextsService.translations[languageId] || [];
                            SymbolicTextsService.setLanguageId(languageId);
                            if (!loadSymbolicTexts) return [3 /*break*/, 2];
                            return [4 /*yield*/, SymbolicTextsService.loadSymbolicTextsAsync()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4 /*yield*/, this.setValidationLanguage()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SymbolicTextsService.ensureObservableSymbolicTextExists = function (symbolicTextName) {
            SymbolicTextsService.registeredTexts[symbolicTextName] = SymbolicTextsService.registeredTexts[symbolicTextName]
                || ko.computed(function () {
                    var languageId = SymbolicTextsService.currentLanguageId();
                    var translations = SymbolicTextsService.translations;
                    var languageTranslations = translations[languageId] || [];
                    translations[languageId] = languageTranslations;
                    languageTranslations[symbolicTextName] = languageTranslations[symbolicTextName] || ko.observable(symbolicTextName);
                    var translation = languageTranslations[symbolicTextName]();
                    return translation;
                });
        };
        SymbolicTextsService.translate = function (symbolicTextName) {
            if (!symbolicTextName)
                return ko.observable(symbolicTextName);
            if (!SymbolicTextsService.translations[SymbolicTextsService.currentLanguageId()]) {
                SymbolicTextsService.loadSymbolicTextsAsync();
            }
            SymbolicTextsService.ensureObservableSymbolicTextExists(symbolicTextName);
            return SymbolicTextsService.registeredTexts[symbolicTextName];
        };
        SymbolicTextsService.getLoadOptions = function (languageId) {
            var options = SymbolicTextsService
                .loadOptions[languageId] = SymbolicTextsService.loadOptions[languageId] ||
                new SymbolicTextLoadOptions(languageId);
            return options;
        };
        SymbolicTextsService.setDefaultLanguage = function (languages) {
            var languageId;
            for (var i = 0; i < languages.length; i++) {
                if (languages[i].IsDefault) {
                    languageId = languages[i].Id;
                    SymbolicTextsService.setLanguageAsync(languageId, false);
                    Logger.info(SymbolicTextsService, "Setting default language to " + languages[i].Name + " (" + languageId + ")");
                    return languageId;
                }
            }
            languageId = languages[0].Id;
            Logger.warn(SymbolicTextsService, "No default language set in the project. Setting language to " + languages[0].Name + " (" + languageId + ")");
            SymbolicTextsService.setLanguageAsync(languageId, false);
            return languageId;
        };
        SymbolicTextsService.initializeLanguageAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var languageId, languages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            languageId = SymbolicTextsService.currentLanguageId();
                            if (!!languageId) return [3 /*break*/, 2];
                            Logger.warn(SymbolicTextsService, "No language set, setting default language instead");
                            return [4 /*yield*/, SymbolicTextsService.getLanguagesAsync()];
                        case 1:
                            languages = _a.sent();
                            languageId = SymbolicTextsService.setDefaultLanguage(languages);
                            _a.label = 2;
                        case 2: return [2 /*return*/, languageId];
                    }
                });
            });
        };
        SymbolicTextsService.loadSymbolicTextsAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var languageId, options, symbolicTexts, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, SymbolicTextsService.initializeLanguageAsync()];
                        case 1:
                            languageId = _a.sent();
                            options = SymbolicTextsService.getLoadOptions(languageId);
                            if (options.isLoaded) {
                                console.log("Translations for language " + languageId + " already loaded");
                                return [2 /*return*/];
                            }
                            console.log("Loading translations for language " + languageId);
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, SymbolicTextsService.symbolicTextApi.getSymbolicTextTranslations(options.languageIds, options.startIndex, options.count, options.includedSymbolicTexts)];
                        case 3:
                            symbolicTexts = _a.sent();
                            return [4 /*yield*/, SymbolicTextsService.updateTranslations(symbolicTexts, languageId, options)];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            options.isLoaded = false;
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SymbolicTextsService.updateTranslations = function (symbolicTexts, languageId, options) {
            return __awaiter(this, void 0, void 0, function () {
                var symbolicTexts_1, symbolicTexts_1_1, item, data, data_1, data_1_1, item;
                var e_1, _a, e_2, _b;
                return __generator(this, function (_c) {
                    console.log("Updating translations for language " + languageId);
                    try {
                        for (symbolicTexts_1 = __values(symbolicTexts), symbolicTexts_1_1 = symbolicTexts_1.next(); !symbolicTexts_1_1.done; symbolicTexts_1_1 = symbolicTexts_1.next()) {
                            item = symbolicTexts_1_1.value;
                            SymbolicTextsService.updateSymbolicText(languageId, item);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (symbolicTexts_1_1 && !symbolicTexts_1_1.done && (_a = symbolicTexts_1.return)) _a.call(symbolicTexts_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (symbolicTexts.length < options.count) {
                        options.isLoaded = true;
                        data = LocalSymbolicTextService.getData(languageId);
                        try {
                            for (data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                                item = data_1_1.value;
                                SymbolicTextsService.updateSymbolicText(languageId, item);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (data_1_1 && !data_1_1.done && (_b = data_1.return)) _b.call(data_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        return [2 /*return*/];
                    }
                    options.startIndex = options.startIndex + options.count;
                    return [2 /*return*/, SymbolicTextsService.loadSymbolicTextsAsync()];
                });
            });
        };
        SymbolicTextsService.updateSymbolicText = function (languageId, item) {
            var languageTexts = SymbolicTextsService.translations[languageId];
            var symbolicTextName = item.SymbolicText;
            languageTexts[symbolicTextName] = languageTexts[symbolicTextName] || ko.observable(symbolicTextName);
            if (item.Translations.length > 0) {
                languageTexts[symbolicTextName](item.Translations[0].Translation);
            }
            var symbolicTextRegistration = SymbolicTextsService.registeredTexts[symbolicTextName];
            if (symbolicTextRegistration) {
                symbolicTextRegistration.notifySubscribers(symbolicTextRegistration());
            }
            else {
                SymbolicTextsService.ensureObservableSymbolicTextExists(symbolicTextName);
            }
        };
        SymbolicTextsService.getGenericCulture = function (lcid) {
            var genericCulture = SymbolicTextsService.languageDetails[lcid.toString()];
            return genericCulture ? genericCulture : 'de';
        };
        SymbolicTextsService.getNumeralLanguage = function (lcid) {
            var genericCulture = SymbolicTextsService.numeralLanguage[lcid.toString()];
            return genericCulture ? genericCulture : 'de';
        };
        SymbolicTextsService.getD3Language = function (lcid) {
            var genericCulture = SymbolicTextsService.d3Language[lcid.toString()];
            return genericCulture ? genericCulture : 'de-DE';
        };
        SymbolicTextsService.getAmchartsLanguage = function (lcid) {
            var genericCulture = SymbolicTextsService.amchartsLanguage[lcid.toString()];
            return genericCulture ? genericCulture : 'de_DE';
        };
        SymbolicTextsService.updateClientConfiguration = function () {
            var clientConfiguration = ConnectorBase.getOrCreateClientConfiguration();
            clientConfiguration.languageCode = SymbolicTextsService.currentGenericCulture();
        };
        SymbolicTextsService.setValidationLanguage = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, ruleName, msg, rule;
                var e_3, _c;
                return __generator(this, function (_d) {
                    Logger.info(this, "Localizing validation rule messages");
                    try {
                        for (_a = __values(Object.getOwnPropertyNames(SymbolicTextsService.symbolicTextsValidation)), _b = _a.next(); !_b.done; _b = _a.next()) {
                            ruleName = _b.value;
                            if (ko.validation.rules.hasOwnProperty(ruleName)) {
                                msg = SymbolicTextsService.symbolicTextsValidation[ruleName];
                                rule = ko.validation.rules[ruleName];
                                rule.message = msg;
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    return [2 /*return*/];
                });
            });
        };
        SymbolicTextsService.languageCookieName = "wf_languageId";
        SymbolicTextsService.registeredTexts = [];
        SymbolicTextsService.loadOptions = [];
        SymbolicTextsService.translations = [];
        SymbolicTextsService.currentLanguageId = ko.observable(Number(CookieService.get(SymbolicTextsService.languageCookieName)) || 0);
        // private static initializedPromise: Promise<any> = null;
        SymbolicTextsService.languageDetails = { "1": "ar", "2": "bg", "3": "ca", "4": "zh-CHS", "5": "cs", "6": "da", "7": "de", "8": "el", "9": "en", "10": "es", "11": "fi", "12": "fr", "13": "he", "14": "hu", "15": "is", "16": "it", "17": "ja", "18": "ko", "19": "nl", "20": "nb", "21": "pl", "22": "pt", "23": "rm", "24": "ro", "25": "ru", "26": "hr", "27": "sk", "28": "sq", "29": "sv", "30": "th", "31": "tr", "32": "ur", "33": "id", "34": "uk", "35": "be", "36": "sl", "37": "et", "38": "lv", "39": "lt", "40": "tg-Cyrl", "41": "fa", "42": "vi", "43": "hy", "44": "az-Latn", "45": "eu", "46": "hsb", "47": "mk", "48": "st", "49": "ts", "50": "tn", "51": "ve", "52": "xh", "53": "zu", "54": "af", "55": "ka", "56": "fo", "57": "hi", "58": "mt", "59": "se", "60": "ga", "61": "yi", "62": "ms", "63": "kk", "64": "ky", "65": "sw", "66": "tk", "67": "uz-Latn", "68": "tt", "69": "bn", "70": "pa", "71": "gu", "72": "or", "73": "ta", "74": "te", "75": "kn", "76": "ml", "77": "as", "78": "mr", "79": "sa", "80": "mn-Cyrl", "81": "bo", "82": "cy", "83": "km", "84": "lo", "85": "my", "86": "gl", "87": "kok", "88": "mni", "89": "sd-Arab", "90": "syr", "91": "si", "92": "chr-Cher", "93": "iu-Latn", "94": "am", "95": "tzm-Latn", "96": "ks-Arab", "97": "ne", "98": "fy", "99": "ps", "100": "fil", "101": "dv", "102": "bin", "103": "ff-Latn", "104": "ha-Latn", "105": "ibb", "106": "yo", "107": "quz", "108": "nso", "109": "ba", "110": "lb", "111": "kl", "112": "ig", "113": "kr", "114": "om", "115": "ti", "116": "gn", "117": "haw", "118": "la", "119": "so", "120": "ii", "121": "pap", "122": "arn", "124": "moh", "126": "br", "127": "", "128": "ug", "129": "mi", "130": "oc", "131": "co", "132": "gsw", "133": "sah", "134": "quc-Latn", "135": "rw", "136": "wo", "140": "prs", "145": "gd", "146": "ku-Arab", "1120": "ks-Arab", "25626": "bs-Cyrl", "26650": "bs-Latn", "27674": "sr-Cyrl", "28698": "sr-Latn", "28731": "smn", "29740": "az-Cyrl", "29755": "sms", "30724": "zh-CHS", "30740": "nn", "30746": "bs-Latn", "30764": "az-Latn", "30779": "sma", "30787": "uz-Cyrl", "30800": "mn-Cyrl", "30813": "iu-Cans", "30815": "tzm-Tfng", "31748": "zh-CHT", "31764": "nb", "31770": "sr-Latn", "31784": "tg-Cyrl", "31790": "dsb", "31803": "smj", "31811": "uz-Latn", "31814": "pa-Arab", "31824": "mn-Mong", "31833": "sd-Arab", "31836": "chr-Cher", "31837": "iu-Latn", "31839": "tzm-Latn", "31847": "ff-Latn", "31848": "ha-Latn", "31878": "quc-Latn", "31890": "ku-Arab" };
        SymbolicTextsService.numeralLanguage = { "1": "ar", "2": "bg", "3": "ca", "4": "zh-CHS", "5": "cs", "6": "da-dk", "7": "de", "8": "el", "9": "en", "10": "es", "11": "fi", "12": "fr", "13": "he", "14": "hu", "15": "is", "16": "it", "17": "ja", "18": "ko", "19": "nl-nl", "20": "nb", "21": "pl", "22": "pt", "23": "rm", "24": "ro", "25": "ru", "26": "hr", "27": "sk", "28": "sq", "29": "sv", "30": "th", "31": "tr", "32": "ur", "33": "id", "34": "uk", "35": "be", "36": "sl", "37": "et", "38": "lv", "39": "lt", "40": "tg-Cyrl", "41": "fa", "42": "vi", "43": "hy", "44": "az-Latn", "45": "eu", "46": "hsb", "47": "mk", "48": "st", "49": "ts", "50": "tn", "51": "ve", "52": "xh", "53": "zu", "54": "af", "55": "ka", "56": "fo", "57": "hi", "58": "mt", "59": "se", "60": "ga", "61": "yi", "62": "ms", "63": "kk", "64": "ky", "65": "sw", "66": "tk", "67": "uz-Latn", "68": "tt", "69": "bn", "70": "pa", "71": "gu", "72": "or", "73": "ta", "74": "te", "75": "kn", "76": "ml", "77": "as", "78": "mr", "79": "sa", "80": "mn-Cyrl", "81": "bo", "82": "cy", "83": "km", "84": "lo", "85": "my", "86": "gl", "87": "kok", "88": "mni", "89": "sd-Arab", "90": "syr", "91": "si", "92": "chr-Cher", "93": "iu-Latn", "94": "am", "95": "tzm-Latn", "96": "ks-Arab", "97": "ne", "98": "fy", "99": "ps", "100": "fil", "101": "dv", "102": "bin", "103": "ff-Latn", "104": "ha-Latn", "105": "ibb", "106": "yo", "107": "quz", "108": "nso", "109": "ba", "110": "lb", "111": "kl", "112": "ig", "113": "kr", "114": "om", "115": "ti", "116": "gn", "117": "haw", "118": "la", "119": "so", "120": "ii", "121": "pap", "122": "arn", "124": "moh", "126": "br", "127": "", "128": "ug", "129": "mi", "130": "oc", "131": "co", "132": "gsw", "133": "sah", "134": "quc-Latn", "135": "rw", "136": "wo", "140": "prs", "145": "gd", "146": "ku-Arab", "1120": "ks-Arab", "25626": "bs-Cyrl", "26650": "bs-Latn", "27674": "sr-Cyrl", "28698": "sr-Latn", "28731": "smn", "29740": "az-Cyrl", "29755": "sms", "30724": "zh-CHS", "30740": "nn", "30746": "bs-Latn", "30764": "az-Latn", "30779": "sma", "30787": "uz-Cyrl", "30800": "mn-Cyrl", "30813": "iu-Cans", "30815": "tzm-Tfng", "31748": "zh-CHT", "31764": "nb", "31770": "sr-Latn", "31784": "tg-Cyrl", "31790": "dsb", "31803": "smj", "31811": "uz-Latn", "31814": "pa-Arab", "31824": "mn-Mong", "31833": "sd-Arab", "31836": "chr-Cher", "31837": "iu-Latn", "31839": "tzm-Latn", "31847": "ff-Latn", "31848": "ha-Latn", "31878": "quc-Latn", "31890": "ku-Arab" };
        SymbolicTextsService.d3Language = { "3": "ca-ES", "4": "zh-CN", "7": "de-DE", "9": "en-GB", "10": "es-ES", "11": "fi-FI", "12": "fr-FR", "13": "he-IL", "14": "hu-HU", "16": "it-IT", "17": "ja-JP", "18": "ko-KR", "19": "nl-NL", "21": "pl-PL", "22": "pt-BR", "25": "ru-RU", "29": "sv-SE", "47": "mk-MK" };
        SymbolicTextsService.amchartsLanguage = { "1": "ar", "3": "ca_ES", "4": "zh_Hans", "5": "cs_CZ", "6": "da_DK", "7": "de_DE", "8": "el_GR", "9": "en", "10": "es_ES", "11": "fi_FI", "12": "fr_FR", "13": "he_IL", "14": "hu_HU", "16": "it_IT", "17": "ja_JP", "18": "ko_KR", "19": "nl_NL", "21": "pl_PL", "22": "pt_BR", "25": "ru_RU", "29": "sv_SE", "30": "th_TH", "31": "tr_TR", "42": "vi_VN" };
        SymbolicTextsService.symbolicTextsValidation = {
            required: "I4SCADA_This_field_is_required",
            min: "I4SCADA_Please_enter_a_value_greater_than_or_equal_to_0",
            max: "I4SCADA_Please_enter_a_value_less_than_or_equal_to_0",
            minLength: "I4SCADA_Please_enter_at_least_0_characters",
            maxLength: "I4SCADA_Please_enter_no_more_than_0_characters",
            pattern: "I4SCADA_Please_check_this_value",
            step: "I4SCADA_The_value_must_increment_by_0",
            email: "I4SCADA_This_is_not_a_proper_email_address",
            date: "I4SCADA_Please_enter_a_proper_date",
            dateISO: "I4SCADA_Please_enter_a_proper_date",
            number: "I4SCADA_Please_enter_a_number",
            digit: "I4SCADA_Please_enter_a_digit",
            phoneUS: "I4SCADA_Please_specify_a_valid_phone_number",
            equal: "I4SCADA_Values_must_equal",
            notEqual: "I4SCADA_Please_choose_another_value",
            unique: "I4SCADA_Please_make_sure_the_value_is_unique"
        };
        SymbolicTextsService.currentGenericCulture = ko.computed(function () {
            return SymbolicTextsService.getGenericCulture(SymbolicTextsService.currentLanguageId());
        });
        SymbolicTextsService.languages = null;
        return SymbolicTextsService;
    }());
    return SymbolicTextsService;
});
//# sourceMappingURL=symbolicTextsService.js.map