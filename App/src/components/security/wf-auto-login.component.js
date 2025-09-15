var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "../../services/connector", "../../services/sessionService"], function (require, exports, Connector, SessionService) {
    "use strict";
    var WfAutoLoginComponent = /** @class */ (function () {
        function WfAutoLoginComponent() {
            var _this = this;
            this.settings = this.getQueryStringParameters();
            this.connector = new Connector();
            if (this.settings && this.settings.userName && this.settings.languageId) {
                console.log("webservice url = " + this.settings.protocol + "://" + this.settings.hostname + ":" + this.settings.port);
                this.setClientId();
                wf.utilities.initializeConstants({
                    remoteIISServerUrl: this.settings.hostname,
                    customHeaders: { "studio": this.settings.dsn },
                    remoteIISServerPort: this.settings.port,
                    remoteIISServerProtocol: this.settings.protocol,
                    shouldCheckClientSession: false,
                });
                this.changeLanguage().then(function () { return _this.executeAutoLogin(); });
            }
        }
        WfAutoLoginComponent.prototype.executeAutoLogin = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.connector.login(this.settings.userName, this.settings.password, this.settings.isDomainUser)];
                });
            });
        };
        WfAutoLoginComponent.prototype.changeLanguage = function () {
            return this.connector.setLanguageAsync(this.settings.languageId);
        };
        WfAutoLoginComponent.prototype.setClientId = function () {
            SessionService.setClientId("3ae9c4ce-6825-49ab-c888-5a5fbff889b9");
        };
        WfAutoLoginComponent.prototype.getQueryStringParameters = function () {
            //http://localhost/wfspa3/#wf-user-manager?languageId=9&protocol=http&hostname=localhost&port=80&dsn=3RD4Iop3BZInMgDEUmqGDTkmkuQuwcVHaf4g392RnppBEkVj%2bdxNJnpmtJci8q7K6aVE126BfKL21%2bk6ctClv8n546gAJ8a%2fX%2bYUdb%2fmNlBFCzYvNAyZlbTuNA8phJJor6rZPdHeW7u0hNGpFeQes%2fxgMI8YFsaN1ll%2fkqSp8Fv2EwOsdkIfNBr81yHymdlF&userName=SzfmwuUhTfxoghYiW73zD%2f99fE%2bbSU%2fHfECYDnjOaulTJTKC11zTr%2fVv3cmHrr7h&password=5rm8hCi8bPGdKLOAwvIUYZ%2fash1OkP8a%2bT6BHrTAfhQ%3d&isDomainUser=True
            //http://localhost/wfspa3/#wf-user-manager?languageId=7&protocol=http&hostname=localhost&port=80&dsn=dnss&userName=webfactory&password=webfactory&isDomainUser=false
            //"index.html?languageId={0}&protocol={1}&hostname={2}&port={3}&dsn={4}&userName={5}&password={6}&isDomainUser={7}"
            var source = decodeURI(document.location.href);
            if (source.indexOf("?") === -1) {
                return null;
            }
            return {
                languageId: Number.parseInt(this.extractStringInformation(source, "languageId", "&")),
                protocol: this.extractStringInformation(source, "protocol", "&"),
                hostname: this.extractStringInformation(source, "hostname", "&"),
                port: Number.parseInt(this.extractStringInformation(source, "port", "&")),
                dsn: this.extractStringInformation(source, "dsn", "&"),
                userName: this.extractStringInformation(source, "userName", "&"),
                password: this.extractStringInformation(source, "password", "&"),
                isDomainUser: this.extractStringInformation(source, "isDomainUser", "&").toLowerCase() === "true",
            };
        };
        WfAutoLoginComponent.prototype.extractStringInformation = function (source, prefix, endString) {
            prefix = prefix ? prefix : "";
            if (prefix !== "" && prefix.indexOf("=") === -1) {
                prefix = prefix + "=";
            }
            var startIndex = source.indexOf(prefix) === -1
                ? 0
                : source.indexOf(prefix) + prefix.length;
            var nextEndIndex = source.indexOf(endString, startIndex);
            var endIndex = nextEndIndex === -1 ? source.length : nextEndIndex;
            return source.substring(startIndex, endIndex);
        };
        return WfAutoLoginComponent;
    }());
    return WfAutoLoginComponent;
});
//# sourceMappingURL=wf-auto-login.component.js.map