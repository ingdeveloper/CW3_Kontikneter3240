declare var JsonNetDecycle;

interface JSON {
    decycle(object: any, replacer?: (item: any) => any): any;
    retrocycle(object: any): any;
}

class SerializationService {
    public static retrocycle<T>(obj: T): T {
        // ReSharper disable once TsResolvedFromInaccessibleModule
        (JSON as any).retrocycle(obj);
        return obj;
    }

    public static decycle(obj: any): any {
        // ReSharper disable once TsResolvedFromInaccessibleModule
        return (JSON as any).decycle(obj);
    }

    public static deserialize<T>(val: string): T {
        let object = this.parseJson(val);
        object = this.retrocycle(object);

        return object as T;
    }

    public static serialize<T>(obj: T): string {
        return JSON.stringify(obj);
    }

    public static serializeWithIndentation<T>(obj: T, indentation: string): string {
        return JSON.stringify(obj, null, indentation);
    }

    private static parseJson(val: string) {
        if (JSON && JSON.parse) return JSON.parse(val);
        return eval(`(${val})`);
    }
}
export = SerializationService;