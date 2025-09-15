define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FileBlob = void 0;
    var FileBlob = /** @class */ (function () {
        function FileBlob(data, name, mimeType) {
            this.name = name;
            this.mimeType = mimeType;
            if (!mimeType) {
                this.blob = new Blob([data]);
            }
            else {
                this.blob = new Blob([data], { type: mimeType });
            }
        }
        return FileBlob;
    }());
    exports.FileBlob = FileBlob;
});
//# sourceMappingURL=file-blob.js.map