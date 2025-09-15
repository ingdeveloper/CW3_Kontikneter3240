import Api = require("./api");
import Logger = require("./logger");
import LocalSymbolicTextService = require("./localSymbolicTextService");
import ConnectorBase = require("./connectorBase");
import { ISymbolicTextsServiceApi } from "./i4/models/ISymbolicTextsServiceApi";
import i4SymbolicTextsServiceApi = require("./i4/i4SymbolicTextsServiceApi");
import CookieService = require("./cookieService");

class SymbolicTextLoadOptions {
    public languageIds: number[];
    public startIndex = 0;
    public count = 2000000;
    public includedSymbolicTexts = IncludedSymbolicTexts.SymbolicTexts | IncludedSymbolicTexts.ExtendedAlarmProperties; // | SymbolicTextOptions.InternallyUsed;
    private _isLoaded = false;

    public get isLoaded() {
        return this._isLoaded;
    }

    public set isLoaded(value: boolean) {
        this._isLoaded = value;
    }

    constructor(languageId: number) {
        this.languageIds = [languageId];
    }
}

class SymbolicTextsService {
    private static get symbolicTextApi(): ISymbolicTextsServiceApi {
        {
            let symbolicTextApi: ISymbolicTextsServiceApi;
            symbolicTextApi = Api.symbolicTextsService;
            if (window.usei4Connector) {
                symbolicTextApi = new i4SymbolicTextsServiceApi();
            }
            return symbolicTextApi;
        }
    }

    private static languageCookieName = "wf_languageId";
    private static registeredTexts: KnockoutComputed<string>[] = [];
    private static loadOptions: SymbolicTextLoadOptions[] = [];
    private static translations: KnockoutObservable<string>[][] = [];

    public static currentLanguageId = ko.observable(Number(CookieService.get(SymbolicTextsService.languageCookieName)) || 0);
    // private static initializedPromise: Promise<any> = null;

    public static languageDetails: { [index: string]: string } = { "1": "ar", "2": "bg", "3": "ca", "4": "zh-CHS", "5": "cs", "6": "da", "7": "de", "8": "el", "9": "en", "10": "es", "11": "fi", "12": "fr", "13": "he", "14": "hu", "15": "is", "16": "it", "17": "ja", "18": "ko", "19": "nl", "20": "nb", "21": "pl", "22": "pt", "23": "rm", "24": "ro", "25": "ru", "26": "hr", "27": "sk", "28": "sq", "29": "sv", "30": "th", "31": "tr", "32": "ur", "33": "id", "34": "uk", "35": "be", "36": "sl", "37": "et", "38": "lv", "39": "lt", "40": "tg-Cyrl", "41": "fa", "42": "vi", "43": "hy", "44": "az-Latn", "45": "eu", "46": "hsb", "47": "mk", "48": "st", "49": "ts", "50": "tn", "51": "ve", "52": "xh", "53": "zu", "54": "af", "55": "ka", "56": "fo", "57": "hi", "58": "mt", "59": "se", "60": "ga", "61": "yi", "62": "ms", "63": "kk", "64": "ky", "65": "sw", "66": "tk", "67": "uz-Latn", "68": "tt", "69": "bn", "70": "pa", "71": "gu", "72": "or", "73": "ta", "74": "te", "75": "kn", "76": "ml", "77": "as", "78": "mr", "79": "sa", "80": "mn-Cyrl", "81": "bo", "82": "cy", "83": "km", "84": "lo", "85": "my", "86": "gl", "87": "kok", "88": "mni", "89": "sd-Arab", "90": "syr", "91": "si", "92": "chr-Cher", "93": "iu-Latn", "94": "am", "95": "tzm-Latn", "96": "ks-Arab", "97": "ne", "98": "fy", "99": "ps", "100": "fil", "101": "dv", "102": "bin", "103": "ff-Latn", "104": "ha-Latn", "105": "ibb", "106": "yo", "107": "quz", "108": "nso", "109": "ba", "110": "lb", "111": "kl", "112": "ig", "113": "kr", "114": "om", "115": "ti", "116": "gn", "117": "haw", "118": "la", "119": "so", "120": "ii", "121": "pap", "122": "arn", "124": "moh", "126": "br", "127": "", "128": "ug", "129": "mi", "130": "oc", "131": "co", "132": "gsw", "133": "sah", "134": "quc-Latn", "135": "rw", "136": "wo", "140": "prs", "145": "gd", "146": "ku-Arab", "1120": "ks-Arab", "25626": "bs-Cyrl", "26650": "bs-Latn", "27674": "sr-Cyrl", "28698": "sr-Latn", "28731": "smn", "29740": "az-Cyrl", "29755": "sms", "30724": "zh-CHS", "30740": "nn", "30746": "bs-Latn", "30764": "az-Latn", "30779": "sma", "30787": "uz-Cyrl", "30800": "mn-Cyrl", "30813": "iu-Cans", "30815": "tzm-Tfng", "31748": "zh-CHT", "31764": "nb", "31770": "sr-Latn", "31784": "tg-Cyrl", "31790": "dsb", "31803": "smj", "31811": "uz-Latn", "31814": "pa-Arab", "31824": "mn-Mong", "31833": "sd-Arab", "31836": "chr-Cher", "31837": "iu-Latn", "31839": "tzm-Latn", "31847": "ff-Latn", "31848": "ha-Latn", "31878": "quc-Latn", "31890": "ku-Arab" };
    public static numeralLanguage: { [index: string]: string } = { "1": "ar", "2": "bg", "3": "ca", "4": "zh-CHS", "5": "cs", "6": "da-dk", "7": "de", "8": "el", "9": "en", "10": "es", "11": "fi", "12": "fr", "13": "he", "14": "hu", "15": "is", "16": "it", "17": "ja", "18": "ko", "19": "nl-nl", "20": "nb", "21": "pl", "22": "pt", "23": "rm", "24": "ro", "25": "ru", "26": "hr", "27": "sk", "28": "sq", "29": "sv", "30": "th", "31": "tr", "32": "ur", "33": "id", "34": "uk", "35": "be", "36": "sl", "37": "et", "38": "lv", "39": "lt", "40": "tg-Cyrl", "41": "fa", "42": "vi", "43": "hy", "44": "az-Latn", "45": "eu", "46": "hsb", "47": "mk", "48": "st", "49": "ts", "50": "tn", "51": "ve", "52": "xh", "53": "zu", "54": "af", "55": "ka", "56": "fo", "57": "hi", "58": "mt", "59": "se", "60": "ga", "61": "yi", "62": "ms", "63": "kk", "64": "ky", "65": "sw", "66": "tk", "67": "uz-Latn", "68": "tt", "69": "bn", "70": "pa", "71": "gu", "72": "or", "73": "ta", "74": "te", "75": "kn", "76": "ml", "77": "as", "78": "mr", "79": "sa", "80": "mn-Cyrl", "81": "bo", "82": "cy", "83": "km", "84": "lo", "85": "my", "86": "gl", "87": "kok", "88": "mni", "89": "sd-Arab", "90": "syr", "91": "si", "92": "chr-Cher", "93": "iu-Latn", "94": "am", "95": "tzm-Latn", "96": "ks-Arab", "97": "ne", "98": "fy", "99": "ps", "100": "fil", "101": "dv", "102": "bin", "103": "ff-Latn", "104": "ha-Latn", "105": "ibb", "106": "yo", "107": "quz", "108": "nso", "109": "ba", "110": "lb", "111": "kl", "112": "ig", "113": "kr", "114": "om", "115": "ti", "116": "gn", "117": "haw", "118": "la", "119": "so", "120": "ii", "121": "pap", "122": "arn", "124": "moh", "126": "br", "127": "", "128": "ug", "129": "mi", "130": "oc", "131": "co", "132": "gsw", "133": "sah", "134": "quc-Latn", "135": "rw", "136": "wo", "140": "prs", "145": "gd", "146": "ku-Arab", "1120": "ks-Arab", "25626": "bs-Cyrl", "26650": "bs-Latn", "27674": "sr-Cyrl", "28698": "sr-Latn", "28731": "smn", "29740": "az-Cyrl", "29755": "sms", "30724": "zh-CHS", "30740": "nn", "30746": "bs-Latn", "30764": "az-Latn", "30779": "sma", "30787": "uz-Cyrl", "30800": "mn-Cyrl", "30813": "iu-Cans", "30815": "tzm-Tfng", "31748": "zh-CHT", "31764": "nb", "31770": "sr-Latn", "31784": "tg-Cyrl", "31790": "dsb", "31803": "smj", "31811": "uz-Latn", "31814": "pa-Arab", "31824": "mn-Mong", "31833": "sd-Arab", "31836": "chr-Cher", "31837": "iu-Latn", "31839": "tzm-Latn", "31847": "ff-Latn", "31848": "ha-Latn", "31878": "quc-Latn", "31890": "ku-Arab" };
    public static d3Language: { [index: string]: string } = { "3": "ca-ES", "4": "zh-CN", "7": "de-DE", "9": "en-GB", "10": "es-ES", "11": "fi-FI", "12": "fr-FR", "13": "he-IL", "14": "hu-HU", "16": "it-IT", "17": "ja-JP", "18": "ko-KR", "19": "nl-NL", "21": "pl-PL", "22": "pt-BR", "25": "ru-RU", "29": "sv-SE", "47": "mk-MK" };
    public static amchartsLanguage: { [index: string]: string } = { "1": "ar", "3": "ca_ES", "4": "zh_Hans", "5": "cs_CZ", "6": "da_DK", "7": "de_DE", "8": "el_GR", "9": "en", "10": "es_ES", "11": "fi_FI", "12": "fr_FR", "13": "he_IL", "14": "hu_HU", "16": "it_IT", "17": "ja_JP", "18": "ko_KR", "19": "nl_NL", "21": "pl_PL", "22": "pt_BR", "25": "ru_RU", "29": "sv_SE", "30": "th_TH", "31": "tr_TR", "42": "vi_VN" };
    public static symbolicTextsValidation = {
        required: "I4SCADA_This_field_is_required",
        min: "I4SCADA_Please_enter_a_value_greater_than_or_equal_to_0",
        max: "I4SCADA_Please_enter_a_value_less_than_or_equal_to_0",
        minLength: "I4SCADA_Please_enter_at_least_0_characters",
        maxLength: "I4SCADA_Please_enter_no_more_than_0_characters",
        pattern: "I4SCADA_Please_check_this_value",
        step: "I4SCADA_The_value_must_increment_by_0",
        email: "I4SCADA_This_is_not_a_proper_email_address",
        date: "I4SCADA_Please_enter_a_proper_date",
        dateISO: "I4SCADA_Please_enter_a_proper_date",
        number: "I4SCADA_Please_enter_a_number",
        digit: "I4SCADA_Please_enter_a_digit",
        phoneUS: "I4SCADA_Please_specify_a_valid_phone_number",
        equal: "I4SCADA_Values_must_equal",
        notEqual: "I4SCADA_Please_choose_another_value",
        unique: "I4SCADA_Please_make_sure_the_value_is_unique"
    };

    public static currentGenericCulture = ko.computed(() => {
        return SymbolicTextsService.getGenericCulture(SymbolicTextsService.currentLanguageId());
    });

    private static setLanguageId(languageId: number) {
        CookieService.set(SymbolicTextsService.languageCookieName, languageId, {
            expires: 30
        });
        this.currentLanguageId(languageId);

        this.updateClientConfiguration();
    }

    private static languages: LanguageDTO[] = null;

    // private static getLanguagesAsyncPromise: Promise<LanguageDTO[]> = null;

    public static async getLanguagesAsync() {
        if (!SymbolicTextsService.languages) {
            SymbolicTextsService.languages = await SymbolicTextsService.symbolicTextApi.getAllLanguages();
        }
        return SymbolicTextsService.languages;
    }

    public static async setLanguageAsync(languageId: number, loadSymbolicTexts = true) {
        SymbolicTextsService.translations[languageId] = SymbolicTextsService.translations[languageId] || [];
        SymbolicTextsService.setLanguageId(languageId);
        if (loadSymbolicTexts) {
            await SymbolicTextsService.loadSymbolicTextsAsync();
        }
        await this.setValidationLanguage();
    }

    private static ensureObservableSymbolicTextExists(symbolicTextName: string) {
        SymbolicTextsService.registeredTexts[symbolicTextName] = SymbolicTextsService.registeredTexts[symbolicTextName]
            || ko.computed(() => {
                var languageId = SymbolicTextsService.currentLanguageId();
                var translations = SymbolicTextsService.translations;
                var languageTranslations = translations[languageId] || [];
                translations[languageId] = languageTranslations;
                languageTranslations[symbolicTextName] = languageTranslations[symbolicTextName] || ko.observable(symbolicTextName);

                var translation = languageTranslations[symbolicTextName]();
                return translation;
            });
    }

    public static translate(symbolicTextName: string) {
        if (!symbolicTextName) return ko.observable(symbolicTextName);

        if (!SymbolicTextsService.translations[SymbolicTextsService.currentLanguageId()]) {
            SymbolicTextsService.loadSymbolicTextsAsync();
        }

        SymbolicTextsService.ensureObservableSymbolicTextExists(symbolicTextName);
        return SymbolicTextsService.registeredTexts[symbolicTextName];
    }

    private static getLoadOptions(languageId: number) {
        var options = SymbolicTextsService
            .loadOptions[languageId] = SymbolicTextsService.loadOptions[languageId] ||
            new SymbolicTextLoadOptions(languageId);
        return options;
    }

    private static setDefaultLanguage(languages: LanguageDTO[]) {
        var languageId: number;
        for (var i = 0; i < languages.length; i++) {
            if (languages[i].IsDefault) {
                languageId = languages[i].Id;
                SymbolicTextsService.setLanguageAsync(languageId, false);
                Logger.info(SymbolicTextsService, `Setting default language to ${languages[i].Name} (${languageId})`);
                return languageId;
            }
        }
        languageId = languages[0].Id;

        Logger.warn(SymbolicTextsService,
            `No default language set in the project. Setting language to ${languages[0].Name} (${languageId})`);
        SymbolicTextsService.setLanguageAsync(languageId, false);
        return languageId;
    }



    public static async initializeLanguageAsync() {
        let languageId = SymbolicTextsService.currentLanguageId();
        if (!languageId) {
            Logger.warn(SymbolicTextsService, "No language set, setting default language instead");

            const languages = await SymbolicTextsService.getLanguagesAsync();
            languageId = SymbolicTextsService.setDefaultLanguage(languages);
        }

        return languageId;
    }

    private static async loadSymbolicTextsAsync() {
        const languageId = await SymbolicTextsService.initializeLanguageAsync();

        var options = SymbolicTextsService.getLoadOptions(languageId);
        if (options.isLoaded) {
            console.log(`Translations for language ${languageId} already loaded`);
            return;
        }

        console.log(`Loading translations for language ${languageId}`);
        //options.isLoaded = true;
        try {
            const symbolicTexts = await SymbolicTextsService.symbolicTextApi.getSymbolicTextTranslations(options.languageIds, options.startIndex, options.count, options.includedSymbolicTexts);
            await SymbolicTextsService.updateTranslations(symbolicTexts, languageId, options);
        } catch (error) {
            options.isLoaded = false;
        }
    }

    private static async updateTranslations(symbolicTexts: SymbolicTextDTO[], languageId: number, options: SymbolicTextLoadOptions) {
        console.log(`Updating translations for language ${languageId}`);

        for (const item of symbolicTexts) {
            SymbolicTextsService.updateSymbolicText(languageId, item);
        }

        if (symbolicTexts.length < options.count) {
            options.isLoaded = true;

            const data = LocalSymbolicTextService.getData(languageId);
            for (const item of data) {
                SymbolicTextsService.updateSymbolicText(languageId, item);
            }

            return;
        }

        options.startIndex = options.startIndex + options.count;
        return SymbolicTextsService.loadSymbolicTextsAsync();
    }

    private static updateSymbolicText(languageId: number, item) {
        var languageTexts = SymbolicTextsService.translations[languageId];
        var symbolicTextName = item.SymbolicText;
        languageTexts[symbolicTextName] = languageTexts[symbolicTextName] || ko.observable(symbolicTextName);
        if (item.Translations.length > 0) {
            languageTexts[symbolicTextName](item.Translations[0].Translation);
        }
        var symbolicTextRegistration = SymbolicTextsService.registeredTexts[symbolicTextName];
        if (symbolicTextRegistration) {
            symbolicTextRegistration.notifySubscribers(symbolicTextRegistration());
        } else {
            SymbolicTextsService.ensureObservableSymbolicTextExists(symbolicTextName);
        }
    }

    public static getGenericCulture(lcid: number) {
        const genericCulture = SymbolicTextsService.languageDetails[lcid.toString()];
        return genericCulture ? genericCulture : 'de';
    }

    public static getNumeralLanguage(lcid: number) {
        const genericCulture = SymbolicTextsService.numeralLanguage[lcid.toString()];
        return genericCulture ? genericCulture : 'de';
    }

    public static getD3Language(lcid: number) {
        const genericCulture = SymbolicTextsService.d3Language[lcid.toString()];
        return genericCulture ? genericCulture : 'de-DE';
    }

    public static getAmchartsLanguage(lcid: number) {
        const genericCulture = SymbolicTextsService.amchartsLanguage[lcid.toString()];
        return genericCulture ? genericCulture : 'de_DE';
    }

    private static updateClientConfiguration(): void {
        const clientConfiguration = ConnectorBase.getOrCreateClientConfiguration();

        clientConfiguration.languageCode = SymbolicTextsService.currentGenericCulture();
    }

    public static async setValidationLanguage() {
        Logger.info(this, "Localizing validation rule messages");

        for (let ruleName of Object.getOwnPropertyNames(SymbolicTextsService.symbolicTextsValidation)) {
            if (ko.validation.rules.hasOwnProperty(ruleName)) {
                let msg = SymbolicTextsService.symbolicTextsValidation[ruleName];
                let rule = ko.validation.rules[ruleName] as KnockoutValidationRuleDefinition;
                rule.message = msg;
            }
        }
    }
}

export = SymbolicTextsService;