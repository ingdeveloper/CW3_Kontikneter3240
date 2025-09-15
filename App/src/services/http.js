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
define(["require", "exports", "./serialization", "./file-blob", "./error-code", "./models/cancellation-token-source"], function (require, exports, SerializationService, file_blob_1, error_code_1, cancellation_token_source_1) {
    "use strict";
    var SysHttp = /** @class */ (function () {
        function SysHttp() {
        }
        /**
         * Converts the data to JSON.
         * @method toJSON
         * @param {object} data The data to convert to JSON.
         * @return {string} JSON.
         */
        SysHttp.toJSON = function (data) {
            return ko.toJSON(data);
        };
        /**
         * Makes an HTTP GET request.
         * @method get
         * @param {string} url The url to send the get request to.
         * @param {object} [query] An optional key/value object to transform into query string parameters.
         * @param {object} [headers] The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
         * @return {Promise} A promise of the get response data.
         */
        SysHttp.get = function (url, query, headers) {
            return $.ajax(url, { data: query, headers: ko.toJS(headers) });
        };
        /**
         * Makes an JSONP request.
         * @method jsonp
         * @param {string} url The url to send the get request to.
         * @param {object} [query] An optional key/value object to transform into query string parameters.
         * @param {string} [callbackParam] The name of the callback parameter the api expects (overrides the default callbackParam).
         * @param {object} [headers] The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
         * @return {Promise} A promise of the response data.
         */
        SysHttp.jsonp = function (url, query, callbackParam, headers) {
            if (url.indexOf('=?') == -1) {
                callbackParam = callbackParam || SysHttp.callbackParam;
                if (url.indexOf('?') == -1) {
                    url += '?';
                }
                else {
                    url += '&';
                }
                url += callbackParam + '=?';
            }
            return $.ajax({
                url: url,
                dataType: 'jsonp',
                data: query,
                headers: ko.toJS(headers)
            });
        };
        /**
         * Makes an HTTP PUT request.
         * @method put
         * @param {string} url The url to send the put request to.
         * @param {object} data The data to put. It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
         * @param {object} [headers] The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
         * @return {Promise} A promise of the response data.
         */
        SysHttp.put = function (url, data, headers) {
            return $.ajax({
                url: url,
                data: this.toJSON(data),
                type: 'PUT',
                contentType: 'application/json',
                dataType: 'json',
                headers: ko.toJS(headers)
            });
        };
        /**
         * Makes an HTTP POST request.
         * @method post
         * @param {string} url The url to send the post request to.
         * @param {object} data The data to post. It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
         * @param {object} [headers] The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
         * @return {Promise} A promise of the response data.
         */
        SysHttp.post = function (url, data, headers) {
            return $.ajax({
                url: url,
                data: this.toJSON(data),
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                //cache: false,
                //async: true,
                headers: ko.toJS(headers)
            });
        };
        SysHttp.postXhr = function (url, data, headers, xhr) {
            return $.ajax({
                url: url,
                data: this.toJSON(data),
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                //cache: false,
                //async: true,
                xhrFields: ko.toJS(xhr),
                headers: ko.toJS(headers)
            });
        };
        /**
         * Makes an HTTP DELETE request.
         * @method remove
         * @param {string} url The url to send the delete request to.
         * @param {object} [query] An optional key/value object to transform into query string parameters.
         * @param {object} [headers] The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
         * @return {Promise} A promise of the get response data.
         */
        SysHttp.remove = function (url, query, headers) {
            return $.ajax({
                url: url,
                data: query,
                type: 'DELETE',
                headers: ko.toJS(headers)
            });
        };
        /**
             * The name of the callback parameter to inject into jsonp requests by default.
             * @property {string} callbackParam
             * @default callback
             */
        SysHttp.callbackParam = 'callback';
        return SysHttp;
    }());
    var HttpService = /** @class */ (function () {
        function HttpService() {
        }
        HttpService.get = function (url, query, headers) {
            url = window.resolveUrl(url);
            headers = window.resolveHeaders(headers);
            //query = _.extend(query || {}, {
            //    __c: window.cacheKey
            //});
            return new Promise(function (resolve, reject) {
                (SysHttp.get(url, query, headers))
                    .then(function (result) { return resolve(SerializationService.retrocycle(result)); })
                    .fail(function (error) { return reject(error); })
                    .done();
            });
        };
        /**
         * Performs a POST request. The service will automatically inject a cache-invalidation token
         * and will setup the right security headers for secure requests.
         * @param url The (rooted) URL where the request should be made.
         * @param data The request parameters.
         * @param headers Specific HTTP headers. These will be automatically extended with the necessary security headers.
         * @returns A promise that resolves to the result of the request.
         */
        //public static async post<T>(url: string, data?: any, headers?: any, settings?: JQueryAjaxSettings|any, useJson = true): Promise<T> {
        //    return await this.execRestfulMethod<T>("POST", url, data, useJson, settings, headers);
        //}
        HttpService.execRestfulMethod = function (method, url, data, useJson, settings, headers) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = window.resolveUrl(url);
                            url = this.appendCacheInvalidation(url);
                            settings = settings || {};
                            settings.type = method;
                            settings.headers = window.resolveHeaders(headers);
                            settings.data = data;
                            this.prepareQuery(settings);
                            if (useJson) {
                                settings.data = SysHttp.toJSON(data); // this.serializationService.serialize(settings.data);
                                settings.contentType = settings.contentType || "application/json";
                                settings.dataType = settings.dataType || "json";
                            }
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    $.ajax(url, settings)
                                        .then(function (data, _textStatus, xhr) {
                                        delete xhr.then;
                                        resolve(data);
                                    }, function (xhr) {
                                        delete xhr.then;
                                        reject(xhr);
                                    });
                                })];
                        case 1:
                            result = _a.sent();
                            //this.serializationService.retrocycle(result);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        HttpService.prepareQuery = function (settings) {
            settings.data = settings.data || {};
        };
        HttpService.appendCacheInvalidation = function (url) {
            var cacheParam = "__c=" + HttpService.cacheKey;
            if (~url.indexOf("?")) {
                url += "&";
            }
            else {
                url += "?";
            }
            url += cacheParam;
            return url;
        };
        HttpService.prototype.prepareQuery = function (settings) {
            settings.data = settings.data || {};
        };
        HttpService.downloadFile = function (url, data, headers, settings) {
            if (data === void 0) { data = undefined; }
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    url = window.resolveUrl(url);
                    settings = settings || {};
                    settings.type = "POST";
                    settings.headers = headers;
                    settings.data = SysHttp.toJSON(data);
                    this.prepareQuery(settings);
                    settings.contentType = settings.contentType || "application/json";
                    settings.responseType = "arraybuffer";
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            $.ajax(url, settings)
                                .done(function (response, _textStatus, xhr) {
                                delete xhr.then;
                                var file = null;
                                if (response !== undefined) {
                                    var name_1 = _this.extractNameFromXhr(xhr);
                                    var mimeType = _this.extractMimeFromXhr(xhr);
                                    file = new file_blob_1.FileBlob(response, name_1, mimeType);
                                }
                                resolve(file);
                            })
                                .fail(function (xhr) {
                                delete xhr.then;
                                reject(new error_code_1.ErrorCode(xhr));
                            });
                            // .then((response: ArrayBuffer, _textStatus: any, xhr: JQueryXHR) => {
                            //     delete xhr.then;
                            //     let file: any = null;
                            //     if (response !== undefined) {
                            //         const name = this.extractNameFromXhr(xhr);
                            //         const mimeType = this.extractMimeFromXhr(xhr);
                            //         file = new FileBlob(response, name, mimeType);
                            //     }
                            //     resolve(file);
                            // }, (xhr) => {
                            //     delete xhr.then;
                            //     reject(new ErrorCode(xhr));
                            // });
                        })];
                });
            });
        };
        HttpService.extractMimeFromXhr = function (xhr) {
            return xhr.getResponseHeader("content-type");
        };
        HttpService.extractNameFromXhr = function (xhr) {
            var name = xhr.getResponseHeader("content-name");
            if (name)
                return name;
            var disposition = xhr.getResponseHeader("content-disposition");
            if (disposition) {
                var split = disposition.split(";");
                if (split.length > 1) {
                    var split2 = split[1].split("=");
                    if (split2.length > 1) {
                        return split2[1];
                    }
                }
                return split[0];
            }
            return "file";
        };
        HttpService.post = function (url, query, headers, token) {
            if (token === void 0) { token = new cancellation_token_source_1.CancellationToken(); }
            url = window.resolveUrl(url);
            headers = window.resolveHeaders(headers);
            //query = _.extend(query || {}, {
            //    __c: window.cacheKey
            //});
            return new Promise(function (resolve, reject) {
                var request = SysHttp.post(url, query, headers);
                token.abort = request.abort;
                request.then(function (result) { return resolve(SerializationService.retrocycle(result)); })
                    .fail(function (error) { reject(error); })
                    .done();
            });
        };
        HttpService.postXhr = function (url, query, headers, xhr) {
            url = window.resolveUrl(url);
            //query = _.extend(query || {}, {
            //    __c: window.cacheKey
            //});
            return new Promise(function (resolve, reject) {
                (SysHttp.postXhr(url, query, headers, xhr))
                    .then(function (result) { return resolve(SerializationService.retrocycle(result)); })
                    .fail(function (error) { return reject(error); })
                    .done();
            });
        };
        HttpService.put = function (url, query, headers) {
            url = window.resolveUrl(url);
            headers = window.resolveHeaders(headers);
            //query = _.extend(query || {}, {
            //    __c: window.cacheKey
            //});
            return new Promise(function (resolve, reject) {
                (SysHttp.put(url, query, headers))
                    .then(function (result) { return resolve(SerializationService.retrocycle(result)); })
                    .fail(function (error) { return reject(error); })
                    .done();
            });
        };
        HttpService.remove = function (url, query, headers) {
            url = window.resolveUrl(url);
            headers = window.resolveHeaders(headers);
            //query = _.extend(query || {}, {
            //    __c: window.cacheKey
            //});
            return new Promise(function (resolve, reject) {
                (SysHttp.remove(url, query, headers))
                    .then(function (result) { return resolve(SerializationService.retrocycle(result)); })
                    .fail(function (error) { return reject(error); })
                    .done();
            });
        };
        HttpService.cacheKey = moment().milliseconds();
        return HttpService;
    }());
    return HttpService;
});
//# sourceMappingURL=http.js.map