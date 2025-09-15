 class SignalLogTagFilter {
     public signalId = ko.observable<string>();
     public logTag = ko.observable<string>();

     constructor(signalId: string, logTag: string) {
         this.signalId(signalId);
         this.logTag(logTag);
     }
}

 export = SignalLogTagFilter;