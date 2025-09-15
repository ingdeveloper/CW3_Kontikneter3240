export class FileBlob {
    public readonly blob: Blob;
    constructor(data: ArrayBuffer, public name: string, public mimeType: string | null) {
        if (!mimeType) {
            this.blob = new Blob([data]);
        } else {
            this.blob = new Blob([data], { type: mimeType });
        }
    }
}