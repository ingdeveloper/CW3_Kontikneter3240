define(["src/viewModels/cowi/services/cwASPAnfrage"],
    function (WebserviceLog) {
        var ctor = function () {
            var self = this;
            self.WebserviceLog = new WebserviceLog();


        };
        ctor.prototype = {
            activate: function () {
                var self = this;

                self.myChart = {
                    'x': 'x',
                    'columns': [
                        [
                            'x',
                            '-30',
                            '-25',
                            '-20',
                            '-15',
                            '-10',
                            '-5',
                            '0',
                            '5',
                            '10',
                            '15',
                            '20',
                            '25',
                            '30'
                        ],
                        [
                            'Sollwertkurve',
                            50,
                            45,
                            40,
                            35,
                            30,
                            25,
                            20,
                            20,
                            20,
                            20,
                            20,
                            20,
                            20
                        ]
                    ],
                    'type': 'line',
                    'colors': {
                        'Sollwertkurve': '#ff0000'
                    },
                    'axes': {
                        'Sollwertkurve': 'y'
                    }
                }


                self.asp1a = ko.observable('Head'); //Ergebnis wird in den oberen Bereich kopiert
                self.myArr = ko.observableArray([]);

                self.myArrAnzeige = ko.observableArray([
                    ['x', 1, 22, 3]

                ]);
                console.log("Array")
                console.log(self.myArr());

                self.chart = undefined;

                self.ergChart = ko.observable();
                self.meldung = ko.observable('');
            },
            compositionComplete: function () {
                var self = this;
                console.log("Compo Chart");
                self.chart = c3.generate({
                    bindto: '#chart',
                    data: {
                        x: 'x',
                        // xFormat: '%Y-%m-%d %H:%M:%S',
                        xFormat: '%d.%m.%Y %H:%M:%S',
                        columns: [
                            ['x', '1.01.2013 01:02:03', '2.01.2013 01:02:03', '3.01.2013 01:02:03', '4.01.2013 01:02:03', '05.01.2013 01:02:03', '06.01.2013 01:02:03'],
                            ['data1', 30, 200, 100, 400, 150, 250]
                        ]
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: '%H:%M:%S' //'%Y.%m.%d %H:%M:%S'
                            }
                        }
                    },
                    zoom: {
                        enabled: true
                    }
                });



            },
            getASP: function () {
                var self = this;
                console.log("Anfrage SQL-DB");
                self.asp1a('Bitte warten ...'); //muss rein, sonst keine Anzeige
                self.WebserviceLog.getAsp('ContentCowi/asp/getLogValuesByDateForC3Chart.asp?dbName=Fuell3020&alias=Local Minute&anzahl=1000&start=2018-06.18 07:00:00&ende=2018-06.19 08:00:00')
                    .then(function (data) {
                        //         // console.log('Abfrage erfolgreich: ');
                        //         // console.log("Typ=" + typeof (data));
                        console.log(data);
                        //console.log(JSON.parse(data));
                        //         // console.log(data.split(';'));
                        //         // self.asp1a(data); //muss rein, sonst keine Anzeige
                        //         // self.myArr(data.split(';')); //muss rein, sonst keine Anzeige
                        //         //self.myArrAnzeige.push(['Sollwertkurve', self.myArr()]);


                        //         // var d = data.split(';');  //Das Ergebnis in ein Array verpacken



                        //         // d.splice(0, 0, 'data1');  //1.Eintag muss die Beschriftung sein
                        //         // // console.log(d.join());
                        var d = JSON.parse(data);
                        d.t.splice(0, 0, "x");
                        d.v.splice(0, 0, "data1");
                        //console.log(d.t);
                        self.chart.load({
                            columns: [
                                d.t,
                                d.v
                            ]
                        });
                        self.asp1a('... Fertig.');


                    });
                self.WebserviceLog.getAsp('ContentCowi/asp/getLogValuesByDateForC3Chart.asp?dbName=Fuell3020&alias=Local Second&anzahl=1000&start=2018-06.18 07:00:00&ende=2018-06.19 08:00:00')
                    .then(function (data) {
                        //         // console.log('Abfrage erfolgreich: ');
                        //         // console.log("Typ=" + typeof (data));
                        //console.log(data);
                        //console.log(JSON.parse(data));
                        //         // console.log(data.split(';'));
                        //         // self.asp1a(data); //muss rein, sonst keine Anzeige
                        //         // self.myArr(data.split(';')); //muss rein, sonst keine Anzeige
                        //         //self.myArrAnzeige.push(['Sollwertkurve', self.myArr()]);


                        //         // var d = data.split(';');  //Das Ergebnis in ein Array verpacken



                        //         // d.splice(0, 0, 'data1');  //1.Eintag muss die Beschriftung sein
                        //         // // console.log(d.join());
                        var d = JSON.parse(data);
                        d.t.splice(0, 0, "x");
                        d.v.splice(0, 0, "data2");
                        //console.log(d.t);
                        self.chart.load({
                            columns: [
                                d.t,
                                d.v
                            ]
                        });
                        self.asp1a('... Fertig.');


                    });
            },
            getChart: function () {
                var self = this;
                console.log("Anfrage SQL-DB");
                self.meldung(' Anfrage gestartet ...');
                self.WebserviceLog.getAsp('ContentCowi/asp/getChart.asp?dbName=Fuell3020&alias=Local Minute&anzahl=1000&start=2018-06.18 07:00:00&ende=2018-06.19 08:00:00')
                    .then(function (data) {
                        self.ergChart(data);
                        self.meldung(' ... Fertig');
                    });
                
            }

        };

        return ctor;
    });