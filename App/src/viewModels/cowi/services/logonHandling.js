define(["require", "exports", "../../../services/connector", "./CryptoJS"], function (require, exports, signalsConnector, CryptoJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.userLogHandle = void 0;
    var LogonHandling = /** @class */ (function () {
        function LogonHandling() {
        }
        LogonHandling.Decrypt = function (encryptedText) {
            var key = CryptoJS.enc.Utf8.parse("CYMR9Fzu45P3H9k7");
            var encryptedData = CryptoJS.enc.Base64.parse(encryptedText);
            // Der IV ist die ersten 16 Bytes des verschlüsselten Textes
            var iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4));
            // Der eigentliche verschlüsselte Text beginnt nach den ersten 16 Bytes
            var ciphertext = CryptoJS.lib.WordArray.create(encryptedData.words.slice(4));
            var decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
                iv: iv,
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        };
        LogonHandling.prototype.login = function (ub) {
            try {
                var parsedParameter = JSON.parse(LogonHandling.Decrypt(ub).replace(/'/g, '"'));
                LogonHandling.connector.login(parsedParameter.user, parsedParameter.pass, false);
            }
            catch (error) {
                console.error("Fehler beim Userlogin", error);
            }
        };
        /** WF-Connector */
        LogonHandling.connector = new signalsConnector();
        return LogonHandling;
    }());
    exports.userLogHandle = new LogonHandling();
});
//# sourceMappingURL=logonHandling.js.map