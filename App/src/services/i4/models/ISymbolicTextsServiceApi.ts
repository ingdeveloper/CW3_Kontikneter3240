export interface ISymbolicTextsServiceApi {
    getAllLanguages: () => Promise<LanguageDTO[]>;
    getSymbolicTextTranslations: (languageIds: number[], startIndex: number, count: number, includedSymbolicTexts: IncludedSymbolicTexts) => Promise<SymbolicTextDTO[]>;
}