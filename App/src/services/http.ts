import SerializationService = require("./serialization");
import { FileBlob } from "./file-blob";
import { ErrorCode } from "./error-code";
import { CancellationToken } from "./models/cancellation-token-source";

class SysHttp {
    /**
         * The name of the callback parameter to inject into jsonp requests by default.
         * @property {string} callbackParam
         * @default callback
         */
    static callbackParam = 'callback';
    /**
     * Converts the data to JSON.
     * @method toJSON
     * @param {object} data The data to convert to JSON.
     * @return {string} JSON.
     */
    static toJSON(data) {
        return ko.toJSON(data);
    }
    /**
     * Makes an HTTP GET request.
     * @method get
     * @param {string} url The url to send the get request to.
     * @param {object} [query] An optional key/value object to transform into query string parameters.
     * @param {object} [headers] The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
     * @return {Promise} A promise of the get response data.
     */
    static get(url, query, headers) {
        return $.ajax(url, { data: query, headers: ko.toJS(headers) });
    }
    /**
     * Makes an JSONP request.
     * @method jsonp
     * @param {string} url The url to send the get request to.
     * @param {object} [query] An optional key/value object to transform into query string parameters.
     * @param {string} [callbackParam] The name of the callback parameter the api expects (overrides the default callbackParam).
     * @param {object} [headers] The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
     * @return {Promise} A promise of the response data.
     */
    static jsonp(url, query, callbackParam, headers) {
        if (url.indexOf('=?') == -1) {
            callbackParam = callbackParam || SysHttp.callbackParam;

            if (url.indexOf('?') == -1) {
                url += '?';
            } else {
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
    }
    /**
     * Makes an HTTP PUT request.
     * @method put
     * @param {string} url The url to send the put request to.
     * @param {object} data The data to put. It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
     * @param {object} [headers] The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
     * @return {Promise} A promise of the response data.
     */
    static put(url, data, headers) {
        return $.ajax({
            url: url,
            data: this.toJSON(data),
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            headers: ko.toJS(headers)
        });
    }
    /**
     * Makes an HTTP POST request.
     * @method post
     * @param {string} url The url to send the post request to.
     * @param {object} data The data to post. It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
     * @param {object} [headers] The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
     * @return {Promise} A promise of the response data.
     */
    static post(url, data, headers) {
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
    }
    static postXhr(url, data, headers, xhr) {
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
    }
    /**
     * Makes an HTTP DELETE request.
     * @method remove
     * @param {string} url The url to send the delete request to.
     * @param {object} [query] An optional key/value object to transform into query string parameters.
     * @param {object} [headers] The data to add to the request header.  It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
     * @return {Promise} A promise of the get response data.
     */
    static remove(url, query, headers) {
        return $.ajax({
            url: url,
            data: query,
            type: 'DELETE',
            headers: ko.toJS(headers)
        });
    }
}

class HttpService {
    public static readonly cacheKey = moment().milliseconds();

    public static get<T>(url: string, query?: any, headers?: any): Promise<T> {
        url = window.resolveUrl(url);
        headers = window.resolveHeaders(headers);

        //query = _.extend(query || {}, {
        //    __c: window.cacheKey
        //});

        return new Promise<T>((resolve, reject) => {
            (SysHttp.get(url, query, headers))
                .then((result: any) => resolve(SerializationService.retrocycle(result)))
                .fail(error => reject(error))
                .done();
        });
    }


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

    private static async execRestfulMethod<T>(method: "GET" | "POST" | "PUT" | "DELETE", url: string, data: any, useJson: boolean, settings: JQueryAjaxSettings, headers?: any) {
        url = window.resolveUrl(url);
        url = this.appendCacheInvalidation(url);
        settings = settings || {};
        settings.type = method;
        settings.headers = window.resolveHeaders(headers);
        settings.data = data;
        this.prepareQuery(settings);
        if (useJson) {
            settings.data = SysHttp.toJSON(data);// this.serializationService.serialize(settings.data);
            settings.contentType = settings.contentType || "application/json";
            settings.dataType = settings.dataType || "json";
        }

        const result = await new Promise<T>((resolve, reject) => {
            $.ajax(url, settings as JQueryAjaxSettings)
                .then((data: T, _textStatus: any, xhr: any) => {
                    delete xhr.then;
                    resolve(data);
                }, (xhr) => {
                    delete xhr.then;

                    reject(xhr);
                });
        });

        //this.serializationService.retrocycle(result);
        return result;
    }

    protected static prepareQuery(settings: JQueryAjaxSettings) {
        settings.data = settings.data || {};
    }

    private static appendCacheInvalidation(url: string) {

        const cacheParam = `__c=${HttpService.cacheKey}`;

        if (~url.indexOf("?")) {
            url += "&";
        } else {
            url += "?";
        }
        url += cacheParam;
        return url;
    }

    protected prepareQuery(settings: JQueryAjaxSettings) {
        settings.data = settings.data || {};
    }

    public static async downloadFile(url: string, data: any = undefined, headers?: any, settings?: any): Promise<FileBlob> {
        url = window.resolveUrl(url);

        settings = settings || {};
        settings.type = "POST";
        settings.headers = headers;

        settings.data = SysHttp.toJSON(data);
        this.prepareQuery(settings);
        settings.contentType = settings.contentType || "application/json";
        settings.responseType = "arraybuffer";

        return new Promise<any>((resolve, reject) => {
            $.ajax(url, settings)
                .done((response: ArrayBuffer, _textStatus: any, xhr: JQueryXHR) => {
                    delete xhr.then;
                    let file: any = null;
                    if (response !== undefined) {
                        const name = this.extractNameFromXhr(xhr);
                        const mimeType = this.extractMimeFromXhr(xhr);
                        file = new FileBlob(response, name, mimeType);
                    }
                    resolve(file);
                })
                .fail((xhr: JQueryXHR) => {
                    delete xhr.then;
                    reject(new ErrorCode(xhr));
                })
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
        });
    }

    private static extractMimeFromXhr(xhr: JQueryXHR) {
        return xhr.getResponseHeader("content-type");
    }

    private static extractNameFromXhr(xhr: JQueryXHR) {
        const name = xhr.getResponseHeader("content-name");
        if (name) return name;

        const disposition = xhr.getResponseHeader("content-disposition");
        if (disposition) {
            const split = disposition.split(";");
            if (split.length > 1) {
                const split2 = split[1].split("=");
                if (split2.length > 1) {
                    return split2[1];
                }
            }

            return split[0];
        }

        return "file";
    }

    public static post<T>(url: string, query?: any, headers?: any, token: CancellationToken = new CancellationToken()): Promise<T> {
        url = window.resolveUrl(url);
        headers = window.resolveHeaders(headers);

        //query = _.extend(query || {}, {
        //    __c: window.cacheKey
        //});

        return new Promise<T>((resolve, reject) => {
            const request = SysHttp.post(url, query, headers);
            token.abort = request.abort;
            request.then((result: any) => resolve(SerializationService.retrocycle(result)))
                .fail(error => { reject(error) })
                .done();
        });
    }

    public static postXhr<T>(url: string, query?: any, headers?: any, xhr?: any): Promise<T> {
        url = window.resolveUrl(url);
        //query = _.extend(query || {}, {
        //    __c: window.cacheKey
        //});

        return new Promise<T>((resolve, reject) => {
            (SysHttp.postXhr(url, query, headers, xhr))
                .then((result: any) => resolve(SerializationService.retrocycle(result)))
                .fail(error => reject(error))
                .done();
        });
    }

    public static put<T>(url: string, query?: any, headers?: any): Promise<T> {
        url = window.resolveUrl(url);
        headers = window.resolveHeaders(headers);

        //query = _.extend(query || {}, {
        //    __c: window.cacheKey
        //});
        return new Promise<T>((resolve, reject) => {
            (SysHttp.put(url, query, headers))
                .then((result: any) => resolve(SerializationService.retrocycle(result)))
                .fail(error => reject(error))
                .done();
        });
    }

    public static remove<T>(url: string, query?: any, headers?: any): Promise<T> {
        url = window.resolveUrl(url);
        headers = window.resolveHeaders(headers);

        //query = _.extend(query || {}, {
        //    __c: window.cacheKey
        //});
        return new Promise<T>((resolve, reject) => {
            (SysHttp.remove(url, query, headers))
                .then((result: any) => resolve(SerializationService.retrocycle(result)))
                .fail(error => reject(error))
                .done();
        });
    }
}

export = HttpService;