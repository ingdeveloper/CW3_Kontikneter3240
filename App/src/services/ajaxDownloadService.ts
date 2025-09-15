import { FileBlob } from "./file-blob";

declare function download(data: File | Blob | string, fileName: string, mimeType?: string | null | undefined): void;

export class AjaxDownloadService {
    public async clientDownload(file: FileBlob) {
        download(file.blob, file.name, file.mimeType);
    }
}