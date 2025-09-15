import HttpService = require("../http");
import { FileBlob } from "../file-blob";
import { CancellationToken } from "../models/cancellation-token-source";

class HttpApi {
    protected async post<T>(serviceName: string, methodName: string, args: any, token?: CancellationToken): Promise<T> {
        var url = `/_SERVICES/WebServices/WCF/${serviceName}.svc/js/${methodName}`;

        const response: { d: T } = await HttpService.post<{ d: T }>(url, args, null, token);
        return response.d;
    }

    protected async downloadFile(serviceName: string, methodName: string, args: any): Promise<FileBlob> {
        var url = `/_SERVICES/WebServices/WCF/${serviceName}.svc/js/${methodName}`;
        return await HttpService.downloadFile(url, args);
    }
    protected async postXhr<T>(serviceName: string, methodName: string, args: any, headers?: any, xhr?: any): Promise<T> {
        var url = `/_SERVICES/WebServices/WCF/${serviceName}.svc/js/${methodName}`;

        const response: { d: T } = await HttpService.postXhr<{ d: T }>(url, args, headers, xhr);
        return response.d;
    }
}

export = HttpApi;