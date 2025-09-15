export class ErrorCode {
    public readonly error: string;
    public readonly code: number;
    public readonly xhr: JQueryXHR;
    constructor(xhr: JQueryXHR) {
        this.error = xhr.statusText;
        this.code = xhr.status;
        this.xhr = xhr;
    }

    public toString() {
        return `[${this.code}] ${this.error}`;
    }
}