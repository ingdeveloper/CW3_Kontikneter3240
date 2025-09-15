define(['../../services/connector', 
        '../../components/services/states.service'],

    function (signalsConnector, statesService) {

        var machine = function (id, statusSignalName, header, productionId, tooltipPosition) {
            this.id = id;
            this.statusSignal = statusSignalName;
            this.header = header;
            this.productionId = productionId;
            this.tooltipPosition = tooltipPosition;
        };

        var ctor = function () {
            var self = this;
            self.id = ko.observable(uuid.v4());
            self.editMode = ko.observable(false);
            self.showProductionDialog = ko.observable(false);
            self.connector = new signalsConnector();
        };

        ctor.prototype = {
            activate: function () {
                var self = this;
                self.tilesView = ko.observable(false);
                self.markerView = ko.observable(true);

                self.currentScale = ko.observable({ x: 0, y: 0 });

                self.currentScaleText = ko.computed(function () {
                    if (!self.currentScale() || !self.currentScale().x || !self.currentScale().y)
                        return "";

                    return "X:" + self.currentScale().x + "; Y: " + self.currentScale().y;
                }, self);

                self.machines = ko.observableArray([
                    new machine(
                        1,
                        "Setpoint 1",
                        "M1 - Drehen",
                        "PWK9120931",
                        "bottom"),

                    new machine(
                        2,
                        "Setpoint 2",
                        "M2 - Fräsen DMG",
                        "PWK9120932",
                        "bottom"),

                    new machine(
                        3,
                        "Setpoint 3",
                        "M3 - Drehen / Bohren",
                        "PWK9120933",
                        "top"),

                    new machine(
                        4,
                        "OperationMode1",
                        "M4 - Fräsen DMG",
                        "WK9120940",
                        "left"),

                    new machine(
                        5,
                        "OperationMode2",
                        "M5 - Waschen BVL",
                        "PWK9120950",
                        "right"),
                    new machine(
                        6,
                        "OperationMode3",
                        "M6 - Induktionshärten",
                        "PWK9120960",
                        "bottom"),
                    new machine(
                        7,
                        "Setpoint 1",
                        "M7 - Drehen / Bohren",
                        "WK9120970",
                        "left"),

                    new machine(
                        8,
                        "OperationMode2",
                        "M8 - Drehen / Bohren",
                        "PWK9120980",
                        "top"),
                    new machine(
                        9,
                        "OperationMode1",
                        "M9 - Induktionshärten",
                        "PWK9120990",
                        "top")
                ]);


                // self.statusUC1 = new statesService({ stateSignalName1: self.machines()[0].statusSignal, maskSignal1: 1, stateSignalName2: self.machines()[0].statusSignal, maskSignal2: 2, stateSignalName3: self.machines()[0].statusSignal, maskSignal3: 3, stateSignalName4: self.machines()[0].statusSignal, maskSignal4: 4 });
                // self.statusUC2 = new statesService({ stateSignalName1: self.machines()[1].statusSignal, maskSignal1: 1, stateSignalName2: self.machines()[1].statusSignal, maskSignal2: 2, stateSignalName3: self.machines()[1].statusSignal, maskSignal3: 3, stateSignalName4: self.machines()[1].statusSignal, maskSignal4: 4 });
                // self.statusUC3 = new statesService({ stateSignalName1: self.machines()[2].statusSignal, maskSignal1: 1, stateSignalName2: self.machines()[2].statusSignal, maskSignal2: 2, stateSignalName3: self.machines()[2].statusSignal, maskSignal3: 3, stateSignalName4: self.machines()[2].statusSignal, maskSignal4: 4 });
                // self.statusUC4 = new statesService({ stateSignalName1: self.machines()[3].statusSignal, maskSignal1: 1, stateSignalName2: self.machines()[3].statusSignal, maskSignal2: 2, stateSignalName3: self.machines()[3].statusSignal, maskSignal3: 3, stateSignalName4: self.machines()[3].statusSignal, maskSignal4: 4 });
                // self.statusUC5 = new statesService({ stateSignalName1: self.machines()[4].statusSignal, maskSignal1: 1, stateSignalName2: self.machines()[4].statusSignal, maskSignal2: 2, stateSignalName3: self.machines()[4].statusSignal, maskSignal3: 3, stateSignalName4: self.machines()[4].statusSignal, maskSignal4: 4 });
                // self.statusUC6 = new statesService({ stateSignalName1: self.machines()[5].statusSignal, maskSignal1: 1, stateSignalName2: self.machines()[5].statusSignal, maskSignal2: 2, stateSignalName3: self.machines()[5].statusSignal, maskSignal3: 3, stateSignalName4: self.machines()[5].statusSignal, maskSignal4: 4 });
                // self.statusUC7 = new statesService({ stateSignalName1: self.machines()[6].statusSignal, maskSignal1: 1, stateSignalName2: self.machines()[6].statusSignal, maskSignal2: 2, stateSignalName3: self.machines()[6].statusSignal, maskSignal3: 3, stateSignalName4: self.machines()[6].statusSignal, maskSignal4: 4 });
                // self.statusUC8 = new statesService({ stateSignalName1: self.machines()[7].statusSignal, maskSignal1: 1, stateSignalName2: self.machines()[7].statusSignal, maskSignal2: 2, stateSignalName3: self.machines()[7].statusSignal, maskSignal3: 3, stateSignalName4: self.machines()[7].statusSignal, maskSignal4: 4 });
                // self.statusUC9 = new statesService({ stateSignalName1: self.machines()[8].statusSignal, maskSignal1: 1, stateSignalName2: self.machines()[8].statusSignal, maskSignal2: 2, stateSignalName3: self.machines()[8].statusSignal, maskSignal3: 3, stateSignalName4: self.machines()[8].statusSignal, maskSignal4: 4 });

            },
            // attached: function () {
            //         $(".marker").on("touchstart", function (e) {
            //             e.stopImmediatePropagation();
            //         });
            //         $(".marker").on("mousedown", function (e) {
            //             e.stopImmediatePropagation();
            //     })
            // },
            switchView: function () {
                var self = this;
                if (self.tilesView()) {
                    self.tilesView(false);
                    // $(".marker").on("touchstart", function (e) {
                    //     e.stopImmediatePropagation();
                    // });
                    // $(".marker").on("mousedown", function (e) {
                    //     e.stopImmediatePropagation();
                    // })
                } else {
                    self.tilesView(true);
                }
            },
            showKpi: function () {
                var self = this;
                self.showProductionDialog(true);
            },
            closeKpiModal: function(){
                var self = this;
                self.showProductionDialog(false);
            },
            deactivate: function(){
                var container = $(document).find('#modal-demo-production-container-' + ko.unwrap(this.id));
                var production = $(document).find('#modal-demo-production-' + ko.unwrap(this.id));
                container.remove();
                production.remove();
            }
        };
        return ctor;
    });