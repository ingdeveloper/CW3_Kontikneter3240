import Connector = require("../../services/connector");
import SessionService = require("../../services/sessionService");
declare var wf: any;

interface IWfAutoLoginParams {
    languageId: number,
    protocol: string,
    hostname: string,
    port: number,
    dsn: string,
    userName: string,
    password: string,
    isDomainUser: boolean,
}

class WfAutoLoginComponent {
    private readonly connector: Connector;
    private readonly settings: IWfAutoLoginParams;

    constructor() {
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

            this.changeLanguage().then(()=>this.executeAutoLogin());
        }
    }

    private async executeAutoLogin() {
        return this.connector.login(this.settings.userName, this.settings.password, this.settings.isDomainUser);
    }

    private changeLanguage() {
        return this.connector.setLanguageAsync(this.settings.languageId);
    }

    private setClientId() {
        SessionService.setClientId("3ae9c4ce-6825-49ab-c888-5a5fbff889b9");
    }

    private getQueryStringParameters(): IWfAutoLoginParams {
        //http://localhost/wfspa3/#wf-user-manager?languageId=9&protocol=http&hostname=localhost&port=80&dsn=3RD4Iop3BZInMgDEUmqGDTkmkuQuwcVHaf4g392RnppBEkVj%2bdxNJnpmtJci8q7K6aVE126BfKL21%2bk6ctClv8n546gAJ8a%2fX%2bYUdb%2fmNlBFCzYvNAyZlbTuNA8phJJor6rZPdHeW7u0hNGpFeQes%2fxgMI8YFsaN1ll%2fkqSp8Fv2EwOsdkIfNBr81yHymdlF&userName=SzfmwuUhTfxoghYiW73zD%2f99fE%2bbSU%2fHfECYDnjOaulTJTKC11zTr%2fVv3cmHrr7h&password=5rm8hCi8bPGdKLOAwvIUYZ%2fash1OkP8a%2bT6BHrTAfhQ%3d&isDomainUser=True
        //http://localhost/wfspa3/#wf-user-manager?languageId=7&protocol=http&hostname=localhost&port=80&dsn=dnss&userName=webfactory&password=webfactory&isDomainUser=false
        //"index.html?languageId={0}&protocol={1}&hostname={2}&port={3}&dsn={4}&userName={5}&password={6}&isDomainUser={7}"
        const source = decodeURI(document.location.href);
        
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
            }
    }

    private extractStringInformation(source: string, prefix: string, endString: string): string {
        prefix = prefix ? prefix : "";

        if (prefix !== "" && prefix.indexOf("=") === -1) {
            prefix = prefix + "=";
        }

        const startIndex = source.indexOf(prefix) === -1
                               ? 0
                               : source.indexOf(prefix) + prefix.length;

        const nextEndIndex = source.indexOf(endString, startIndex);
        const endIndex = nextEndIndex === -1 ? source.length : nextEndIndex;

        return source.substring(startIndex, endIndex);
    }

}
export = WfAutoLoginComponent;