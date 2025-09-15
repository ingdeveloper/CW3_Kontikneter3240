import HttpService = require("../http");
import { ISymbolicTextsServiceApi } from "./models/ISymbolicTextsServiceApi";

class i4SymbolicTextsServiceApi implements ISymbolicTextsServiceApi {
    public getAllLanguages = async () => {
        const url = window.resolveUrl(window.i4InstallationUrl + `/${window.i4PostfixInstallationUrl}/languages/list`);
        const languages = await HttpService.get<any[]>(url);
        return languages.map((language) => {
            return {
                Id: language.id,
                Name: language.name,
                IsActive: true,
                IsDefault: false
            } as LanguageDTO;
        });
    }

    public getSymbolicTextTranslations = async (languageIds: number[], startIndex: number, count: number, includedSymbolicTexts: IncludedSymbolicTexts) => {
        const url = window.resolveUrl(window.i4InstallationUrl + `/${window.i4PostfixInstallationUrl}/translations/${languageIds[0]}/list?namespaceNames=SCADA`);
        const languages = await HttpService.get<any>(url);
        const portals: any[] = languages.scada;
        return portals.map((language) => {
            return {
                SymbolicText: language.key,
                Translations: [{
                    LanguageID: languageIds[0],
                    Translation: language.value
                }] as SymbolicTextTranslationDTO[]

            } as SymbolicTextDTO;
        });
    }
}

export = i4SymbolicTextsServiceApi;