 class SignalDefinitionsFilter {
     public serverNames = ko.observableArray<string>([]);
     public aliasNames = ko.observableArray<string>([]);
     public logTags = ko.observableArray<string>([]);
     public resultsFilter = ko.observable<SignalDefinitionResultsFilter>();

     constructor(serverNames: string[], aliasNames: string[], logTags: string[], resultsFilter: SignalDefinitionResultsFilter) {
         this.serverNames(serverNames);
         this.aliasNames(aliasNames);
         this.logTags(logTags);
         this.resultsFilter(resultsFilter);
     }

     public toDto(): GetSignalDefinitionsFilterDTO {
         var dto: GetSignalDefinitionsFilterDTO = {
             AliasNames: this.aliasNames(),
             LogTags: this.logTags(),
             ResultsFilter: this.resultsFilter(),
             ServerNames: this.serverNames()
         };
         return dto;
     }
}

 export = SignalDefinitionsFilter;