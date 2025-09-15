import HttpApi = require("./httpApi");
import { ISymbolicTextsServiceApi } from "../i4/models/ISymbolicTextsServiceApi";

class SymbolicTextsServiceApi extends HttpApi implements ISymbolicTextsServiceApi {
    public getAllLanguages = () => this.post<LanguageDTO[]>("SymbolicTextsService", "GetAllLanguages", null);

    public getSymbolicTextTranslations = (languageIds: number[], startIndex: number, count: number, includedSymbolicTexts: IncludedSymbolicTexts) => this.post <SymbolicTextDTO[]>("SymbolicTextsService","GetSymbolicTextTranslations", {
        languageIDs: languageIds,
        startIndex: startIndex,
        count: count,
        includedSymbolicTexts: includedSymbolicTexts
    });
}

export = SymbolicTextsServiceApi;