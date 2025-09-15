class CookieService {
    public static set(name: string, value: any, options?: any) {
        $.cookie.raw = true;

        $.cookie(name, encodeURIComponent(value), options);
    }

    public static get(name: string, converter?: (value: string) => any): any {
        $.cookie.raw = true;

        const result = $.cookie(name, converter);
        if (result === undefined)
            return result;
        return decodeURIComponent(result);
    }

    public static remove(name: string, options?: any): boolean {
        return $.removeCookie(name, options);
    }
}
export = CookieService;