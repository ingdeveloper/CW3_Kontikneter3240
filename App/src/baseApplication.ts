import Logger = require("./services/logger");
import ComponentRegistry = require("./componentRegistry");
import CustomComponentRegistry = require("./customComponentRegistry");
import Connector = require("./services/connector");
import NumeralNumber = require("./knockoutExtenders/numeralNumber");
import * as d3Localization from "./services/d3Localization";
import SymbolicTextsService = require("./services/symbolicTextsService");

export abstract class BaseApplication {
    private connector: Connector;

    constructor() {
        this.connector = new Connector();
        window.translate = SymbolicTextsService.translate;
        this.setupLogging();
        this.setupNumeral();
        this.setupD3();
        this.setupValidation();
        Logger.info(this, "Application starting...");
        Logger.info(this, "Framework version " + window.appVersion);

        if (!this.checkProtocol()) {
            throw "Application was started outside the webserver. Please publish the application and run it from the server.";
        }

        this.registerComponents();
        CustomComponentRegistry.register();
    }

    private setupNumeral() {
        NumeralNumber.init(this.connector);
        this.connector.currentLanguageId.subscribe(newLanguageId => this.setNumeralLanguage(newLanguageId), this);
        this.setNumeralLanguage(this.connector.currentLanguageId());
    }

    private setupD3() {
        this.connector.currentLanguageId.subscribe(newLanguageId => this.setD3Language(newLanguageId), this);
        this.setD3Language(this.connector.currentLanguageId());
    }

    private setNumeralLanguage(newLanguageId: number) {
        Logger.info(this, "Setting Numeral language");
        const language = this.connector.getNumeralLanguage(newLanguageId);
        this.setNumeralLocale(language);
    }

    private setD3Language(newLanguageId: number) {
        Logger.info(this, "Setting D3 language");
        const fullLanguageName = this.connector.getD3Language(newLanguageId);
        const localeDefinition = d3Localization.localeDefinitions[fullLanguageName] || d3Localization.localeDefinitions["de-DE"];

        const locale = d3.locale(localeDefinition);
        d3.localizedNumberFormat = _.bind(locale.numberFormat, locale);
        d3.localizedTimeFormat = _.bind(locale.timeFormat, locale);
        d3.localizedTimeFormatUTC = _.bind(locale.timeFormat.utc, locale);
    }

    protected setupLogging() {
        toastr.options.toastClass = 'toast';
        toastr.options.positionClass = 'toast-bottom-right';

        Logger.info(this, "Logging support enabled: {0}", window.debug);
    }

    private checkProtocol(): boolean {
        Logger.info(this, 'Check used Protocol');
        switch (window.location.protocol) {
            case 'http:':
            case 'https:':
                return true;
            case 'file:':
                return false;
            default:
                return false;
        }
    }

    private setupValidation() {
        Logger.info(this, "Setting up validation system");

        ko.validation.init({
            insertMessages: true,
            messageTemplate: "validationErrorTemplate",
            // decorateInputElement: true,
            errorElementClass: "animated fadeIn has-error",
            errorMessageClass: "animated fadeIn help-block text-danger"
        });

        SymbolicTextsService.setValidationLanguage();
    }

    protected registerComponents() {
        return new ComponentRegistry("src/components")
            .mapComponent("wf-arc", "visualization/wf-arc.component")
            .mapComponent("wf-bargraph", "visualization/wf-bargraph.component")
            .mapComponent("wf-gauge-1", "visualization/wf-gauge-1.component")
            .mapComponent("wf-meter", "visualization/wf-meter.component")
            .mapComponent("wf-popover", "visualization/wf-popover.component")
            .mapComponent("wf-rotation-container", "visualization/wf-rotation-container.component")
            .mapComponent("wf-sensor", "visualization/wf-sensor.component")
            .mapComponent("wf-signal-information-popover", "visualization/wf-signal-information-popover.component")
            .mapComponent("wf-signal-information", "visualization/wf-signal-information.component")
            .mapComponent("wf-signal-list", "visualization/wf-signal-list.component")
            .mapComponent("wf-state-indicator", "visualization/wf-state-indicator.component")
            .mapComponent("wf-state-symbol", "visualization/wf-state-symbol.component")
            .mapComponent("wf-state-text", "visualization/wf-state-text.component")
            .mapComponent("wf-value", "visualization/wf-value.component")
            .mapComponent("wf-value-display", "visualization/wf-value-display.component")
            .mapComponent("wf-watchdog", "visualization/wf-watchdog.component")
            .mapComponent("wf-motion-container", "visualization/wf-motion-container")
            .mapComponent("wf-switch-gear", "visualization/wf-switch-gear.component")
            .mapComponent("wf-switch-symbol", "visualization/wf-switch-symbol.component")
            .mapComponent("wf-switch-transformer", "visualization/wf-switch-transformer.component")
            .mapComponent("wf-transformer", "visualization/wf-transformer.component")
            .mapComponent("wf-setpoint-chart", "visualization/wf-setpoint-chart.component")
            .mapComponent("wf-signal-information-popup-list", "visualization/wf-signal-information-popup-list.component")

            //control
            .mapComponent("wf-buffer-button", "control/wf-buffer-button.component")
            .mapComponent("wf-button", "control/wf-button.component")
            .mapComponent("wf-combobox", "control/wf-combobox.component")
            .mapComponent("wf-date-time-picker", "control/wf-date-time-picker.component")
            .mapComponent("wf-input", "control/wf-input.component")
            .mapComponent("wf-radio-buttons", "control/wf-radio-buttons.component")
            .mapComponent("wf-slider", "control/wf-slider.component")
            .mapComponent("wf-switch-3-states", "control/wf-switch-3-states.component")
            .mapComponent("wf-switch", "control/wf-switch.component")
            .mapComponent("wf-time-range", "control/wf-time-range.component")
            .mapComponent("wf-toggle-button", "control/wf-toggle-button.component")

            //control/wf-signal-alarm-list
            .mapComponent("wf-signal-alarm-list", "control/wf-signal-alarm-list/wf-signal-alarm-list.component")
            .mapComponent("wf-combobox-discrete-value", "control/wf-signal-alarm-list/wf-combobox-discrete-value.component")
            .mapComponent("wf-signal-alarm-list-signals-browser-dialog", "control/wf-signal-alarm-list/wf-signal-alarm-list-signals-browser-dialog.component")
            .mapComponent("wf-signal-alarm-list-configuration-dialog", "control/wf-signal-alarm-list/wf-signal-alarm-list-configuration-dialog.component")

            //historical
            .mapComponent("wf-chart-1", "historical/wf-chart-1.component")
            .mapComponent("wf-log-table", "historical/wf-log-table.component")
            .mapComponent("wf-logtag-analytics", "historical/wf-logtag-analytics.component")
            .mapComponent("wf-logtag-arc", "historical/wf-logtag-arc.component")
            .mapComponent("wf-historical-data-chart", "historical/wf-historical-data-chart.component")
            .mapComponent("wf-historical-data-series-details", "historical/wf-historical-data-series-details.component")
            .mapComponent("wf-historical-data-cursor-details", "historical/wf-historical-data-cursor-details.component")
            .mapComponent("wf-chart-1-popup", "historical/wf-chart-1-popup.component")
            //historical-toolbox
            .mapComponent("wf-historical-data-toolbox", "historical/toolbox/wf-historical-data-toolbox.component")
            .mapComponent("wf-historical-data-toolbox-pause-resume", "historical/toolbox/wf-historical-data-toolbox-pause-resume.component")
            .mapComponent("wf-historical-data-toolbox-time-settings", "historical/toolbox/wf-historical-data-toolbox-time-settings.component")
            .mapComponent("wf-historical-data-toolbox-export", "historical/toolbox/wf-historical-data-toolbox-export.component")
            .mapComponent("wf-historical-data-toolbox-load-configuration", "historical/toolbox/wf-historical-data-toolbox-load-configuration.component")
            .mapComponent("wf-historical-data-toolbox-save-configuration", "historical/toolbox/wf-historical-data-toolbox-save-configuration.component")
            .mapComponent("wf-historical-data-toolbox-back", "historical/toolbox/wf-historical-data-toolbox-back.component")
            .mapComponent("wf-historical-data-toolbox-forward", "historical/toolbox/wf-historical-data-toolbox-forward.component")
            //historical-dialog
            .mapComponent("wf-historical-data-dialog-axes", "historical/dialog/wf-historical-data-dialog-axes.component")
            .mapComponent("wf-historical-data-dialog-data", "historical/dialog/wf-historical-data-dialog-data.component")
            .mapComponent("wf-historical-data-dialog-regions", "historical/dialog/wf-historical-data-dialog-regions.component")
            .mapComponent("wf-historical-data-dialog-toolbox", "historical/dialog/wf-historical-data-dialog-toolbox.component")
            //historical-common
            .mapComponent("wf-historical-data-signal-selector", "historical/common/wf-historical-data-signal-selector.component")
            .mapComponent("wf-historical-data-log-selector", "historical/common/wf-historical-data-log-selector.component")
            .mapComponent("wf-historical-data-horizontal-line", "historical/common/wf-historical-data-horizontal-line.component")
            .mapComponent("wf-historical-data-color-picker", "historical/common/wf-historical-data-color-picker.component")
            .mapComponent("wf-historical-data-input", "historical/common/wf-historical-data-input.component")
            .mapComponent("wf-historical-data-cursors", "historical/common/wf-historical-data-cursors.component")

            //internationalisation
            .mapComponent("wf-language-selector", "internationalisation/wf-language-selector.component")
            .mapComponent("wf-symbolictext", "internationalisation/wf-symbolictext.component")

            //security
            .mapComponent("wf-enable-container", "security/wf-enable-container.component")
            .mapComponent("wf-secured-container", "security/wf-secured-container.component")
            .mapComponent("wf-user-authorizations-list", "security/wf-user-authorizations-list.component")
            .mapComponent("wf-user-information", "security/wf-user-information.component")
            .mapComponent("wf-user-login", "security/wf-user-login.component")
            .mapComponent("wf-auto-login", "security/wf-auto-login.component")
            //user manager
            .mapComponent("wf-user-manager", "security/wf-user-manager.component")
            .mapComponent("wf-um-access-authorizations", "security/wf-user-manager/wf-um-access-authorizations/wf-um-access-authorizations.component")
            .mapComponent("wf-um-access-groups", "security/wf-user-manager/wf-um-access-groups/wf-um-access-groups.component")
            .mapComponent("wf-um-authorization-groups", "security/wf-user-manager/wf-um-authorization-groups/wf-um-authorization-groups.component")
            .mapComponent("wf-um-projects-authorizations", "security/wf-user-manager/wf-um-projects-authorizations/wf-um-projects-authorizations.component")
            .mapComponent("wf-um-user-actions", "security/wf-user-manager/wf-um-user-actions/wf-um-user-actions.component")
            .mapComponent("wf-um-users", "security/wf-user-manager/wf-um-users/wf-um-users.component")
            // common
            .mapComponent("wf-um-check-box-group", "security/wf-user-manager/shared/wf-um-check-box-group.component")
            //dialogs
            .mapComponent("wf-um-confirmation-dialog", "security/wf-user-manager/shared/wf-um-confirmation-dialog.component")
            .mapComponent("wf-um-cloned-name-dialog", "security/wf-user-manager/shared/wf-um-cloned-name-dialog.component")
            .mapComponent("wf-um-change-password-dialog", "security/wf-user-manager/wf-um-users/wf-um-change-password-dialog.component")
            .mapComponent("wf-um-default-settings-dialog", "security/wf-user-manager/wf-um-users/wf-um-default-settings-dialog.component")
            .mapComponent("wf-um-password-policy-dialog", "security/wf-user-manager/wf-um-users/wf-um-password-policy-dialog.component")
            .mapComponent("wf-um-add-edit-user-dialog", "security/wf-user-manager/wf-um-users/wf-um-add-edit-user-dialog.component")
            .mapComponent("wf-um-add-edit-auth-groups-dialog", "security/wf-user-manager/wf-um-authorization-groups/wf-um-add-edit-auth-groups-dialog.component")
            .mapComponent("wf-um-add-edit-project-auth-dialog", "security/wf-user-manager/wf-um-projects-authorizations/wf-um-add-edit-project-auth-dialog.component")
            .mapComponent("wf-um-add-edit-access-group-dialog", "security/wf-user-manager/wf-um-access-groups/wf-um-add-edit-access-group-dialog.component")
            .mapComponent("wf-um-add-edit-access-auth-dialog", "security/wf-user-manager/wf-um-access-authorizations/wf-um-add-edit-access-auth-dialog.component")
            .mapComponent("wf-um-time-interval-dialog", "security/wf-user-manager/wf-um-user-actions/wf-um-time-interval-dialog.component")
            .mapComponent("wf-um-filter-dialog", "security/wf-user-manager/wf-um-user-actions/wf-um-filter-dialog.component")

            .mapComponent("wf-visibility-container", "security/wf-visibility-container.component")
            .mapComponent("wf-write-secure-signal", "security/wf-write-secure-signal.component")

            //events
            .mapComponent("wf-alarm-ack-button", "events/wf-alarm-ack-button.component")
            .mapComponent("wf-alarm-ack-dialog-button", "events/wf-alarm-ack-dialog-button.component")
            .mapComponent("wf-alarm-group-ack-button", "events/wf-alarm-group-ack-button.component")
            .mapComponent("wf-alarm-viewer", "events/wf-alarm-viewer.component")
            .mapComponent("wf-logbook-viewer", "events/wf-logbook-viewer.component")
            .mapComponent("wf-logbook", "events/wf-logbook.component")
            .mapComponent("wf-events", "events/wf-events.component")
            .mapComponent("wf-alarm-state-manager", "events/wf-alarm-state-manager.component")

            //navigation
            .mapComponent("wf-breadcrumb", "navigation/wf-breadcrumb.component")

            .mapComponent("wf-modal-dialog", "wf-modal-dialog.component")
            .mapComponent("wf-configuration", "wf-configuration.component")
            .mapComponent("wf-signals-buffer-viewer", "wf-signals-buffer-viewer.component")
            .mapComponent("wf-log-browser", "wf-log-browser.component")
            .mapComponent("wf-modal-dialog-button", "navigation/wf-modal-dialog-button.component")

            //svg
            .mapComponent("wf-svg-path", "svg/wf-svg-path.component")
            .mapComponent("wf-svg-arc", "svg/wf-svg-path.component", "svg/wf-svg-arc.component")
            .mapComponent("wf-svg-rectangle", "svg/wf-svg-rectangle.component")

            // utility
            .mapComponent("wf-local-array-splitter", "utility/wf-local-array-splitter.component")
            .mapComponent("wf-local-script", "utility/wf-local-script.component")

            // recipe
            .mapComponent("wf-recipe-management", "recipe/wf-recipe-management.component")
            .mapComponent("wf-recipe", "recipe/wf-recipe.component");
    }

    private numeralLocaleCache: object = null;

    private setNumeralLocale(language: string): void {
        if (numeral["locales"][language]) {
            try {
                numeral.locale(language);
            } catch (e) {
                this.setNumeralLocale("de");
            }
            return;
        }

        this.ensureLocaleCacheIsSet();

        const numeralLocaleCacheValue = this.numeralLocaleCache[language];

        if (numeralLocaleCacheValue) {
            numeral.register("locale", language, numeralLocaleCacheValue);
            numeral.locale(language);
        }
        else {
            console.warn(`the current language [${language}] does not have a registered numeral locale, defaulting to [de]`);
            this.setNumeralLocale("de");
        }
    }

    private ensureLocaleCacheIsSet() {
        if (this.numeralLocaleCache) return;

        this.numeralLocaleCache = {
            "nb1": {
                delimiters: {
                    thousands: ' ',
                    decimal: ','
                },
                abbreviations: {
                    thousand: 't',
                    million: 'm',
                    billion: 'b',
                    trillion: 'q'
                },
                ordinal: function (number) {
                    return number;
                },
                currency: {
                    symbol: 'kr'
                }
            }
        };
    }
}