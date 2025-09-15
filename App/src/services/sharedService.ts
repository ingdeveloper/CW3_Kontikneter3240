class SharedService {
    private static globaleVariable = 123;
    private static globaleObservable = ko.observable("XYZ");
    private static time = ko.observable();

    public static getTime() {
        var currentTimeStamp = moment();
        this.time(currentTimeStamp);

        setTimeout(
            () => {
                this.getTime();
            }, 500);

        return currentTimeStamp;
    }

}

export = SharedService;

//define(

//    function () {
//        return {
//            globaleVariable: 123,
//            sharedObservable: ko.observable('CCW'),
//            time: ko.observable('ZEIT'),
//            rezept: ko.observable('CoWi Rezept'),
//            unit: 'CCW',

//            getTime:
//            function getTime() {
//                var self = this;

//                var currentTimeStamp = moment();
//                //var currentTime = moment().format("HH:mm:ss");

//                self.time(currentTimeStamp);

//                setTimeout(
//                    function () {
//                        self.getTime();
//                    }, 500);
//            }

//        };
//    });