import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");

interface IWfLanguageSelectorParams extends IComponentBaseParams {
    textStyle: string;
    iconStyle: string;
    dropdownAlignment: string;
    iconClass: string;
    cssClass: string;
}

class WfLanguageSelectorComponent extends ComponentBaseModel<IWfLanguageSelectorParams> {
    private textStyle: string;
    private iconStyle: string;
    private dropdownAlignment: string;
    private iconClass: string;
    private cssClass: string;
    private selectedLanguageName: KnockoutComputed<string>;
    private selectedLanguageId: KnockoutObservable<number>;
    private availableLanguages: KnockoutObservableArray<LanguageDTO>;

    constructor(params: IWfLanguageSelectorParams) {
        super(params);
        this.initializeComputeds();
        this.getLanguagesAsync();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.availableLanguages = ko.observableArray<LanguageDTO>();
        this.selectedLanguageId = ko.observable<number>();

        this.cssClass = ko.unwrap(this.settings.cssClass) || "btn btn-variant-dark";
        this.iconClass = ko.unwrap(this.settings.iconClass) || "wf wf-language";
        this.dropdownAlignment = ko.unwrap(this.settings.dropdownAlignment) || "left";
        this.iconStyle = ko.unwrap(this.settings.iconStyle) || "";
        this.textStyle = ko.unwrap(this.settings.textStyle) || "";

        this.selectedLanguageId = this.connector.currentLanguageId;
        this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);

    }

    private initializeComputeds() {
        this.selectedLanguageName = ko.pureComputed(() => {
            var languageNameObject = _.findWhere(this.availableLanguages(), { Id: this.selectedLanguageId() });
            if (languageNameObject) {
                return languageNameObject.Name;
            }
            return null;
        });
    }

    private async getLanguagesAsync() {
        try {
            const languages = await this.connector.getLanguagesAsync();
            this.availableLanguages(languages.filter(x => x.IsActive));
        } catch (error) {
            this.connector.handleError(WfLanguageSelectorComponent)(error);
        }
    }

    private changeLanguage(name, id) {

        this.connector.setLanguageAsync(id);
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfLanguageSelectorComponent;
