import Logger = require("../../services/logger");

class RecipeJSONService {

    public async load(inputId: string) {

        if (typeof (<any>window).FileReader !== 'function') {
            Logger.warn(this, "The file API isn't supported");
            return;
        }

        const input = document.getElementById(inputId);
        if (!input) {
            throw "Couldn't find the fileinput element.";
        }
        else if (!(<any>input).files) {
            throw "This browser doesn't seem to support the `files` property of file inputs.";
        }
        else if (!(<any>input).files[0]) {
            throw "Please select a file before clicking 'Load'";
        }
        else {
            const files: Blob[] = (<any>input).files;
            const content: string[] = [];
            for (let file of files) {
                const data = await this.readFileAsync(file);
                content.push(data);
            }
            (<any>input).value = "";
            return content;
        }
    }

    public async readFileAsync(file: Blob) {
        const fileReader = new FileReader();
        const resultFile = await new Promise<string>((resolve, reject) => {
            fileReader.onerror = () => {
                fileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            fileReader.onload = () => {
                resolve(fileReader.result as string);
            };
            fileReader.readAsText(file);
        });
        return resultFile;
    }

    public download(
        content: string,
        exportFileName: string
    ) {
        const binaryData = new Blob(["\ufeff", content], { type: "application/json" });

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(binaryData, `${exportFileName}.json`);
        } else {
            const link = window.document.createElement('a');
            const objectURL = window.URL.createObjectURL(binaryData)
            link.setAttribute('href', objectURL);
            link.setAttribute('download', `${exportFileName}.json`);

            // Append anchor to body.
            document.body.appendChild(link)
            link.click();

            // Remove anchor from body
            document.body.removeChild(link);
            window.URL.revokeObjectURL(objectURL);
        }
    }


}

export = RecipeJSONService;