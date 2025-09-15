import HttpService = require("src/services/http");

class HttpApi {
    protected async post<T>(serviceName: string, methodName: string, args: any): Promise<T> {
        // var url = `/_SERVICES/WebServices/WCF/${serviceName}.svc/js/${methodName}`;
        var url = `/WsGetChart/WsRezept.svc/js/ReadUserRight`;
        const response: { d: T } = await HttpService.post<{ d: T }>(url, args);
        return response.d;
    }
}

export = HttpApi;