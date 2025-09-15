/*
ccw-wf-alarm-viewer
Erstellung 10.02.2022 amueller
Wichtig: Webservice WsCcw ab dem 9.02.2022 muss vorhanden sein.

Updates:
15.02.2022: amueller V1.0
- Erprobung in Linie RTE
- VErsions-Anzeige in Komponente

11.02.2022: amueller
- Fehler-Anzeige in einer Box und Link + Dokument aus SQL-Tabelle lesen
- Fehlerkorrekturen

10.02.2022: amueller
- Webservice bekommt die Ergebnis-Eigenschaft "success"

*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "src/services/models/alarmsFilter", "src/decorators/busyIndicator", "src/services/errorCodeService", "src/services/connectorEnums", "src/components/component-base.model", "src/components/services/alarm-horn.service", "src/components/services/convert-csv.service", "src/components/services/secured.service", "src/components/services/standalone-parameters-replacement.service"], function (require, exports, AlarmsFilter, BusyIndicator, ErrorCodeService, connectorEnums_1, ComponentBaseModel, AlarmHornService, ConvertCsvService, SecuredService, StandaloneParametersReplacementService) {
    "use strict";
    var WfAlarmViewerComponent = /** @class */ (function (_super) {
        __extends(WfAlarmViewerComponent, _super);
        function WfAlarmViewerComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.pollAlarm = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.onlineAlarmsMode() === false || !this.showDialog())
                                return [2 /*return*/];
                            return [4 /*yield*/, this.updateSelectedAlarm()];
                        case 1:
                            _a.sent();
                            // Trigger the next poll
                            this.pollTimer = setTimeout(this.pollAlarm, 1000);
                            return [2 /*return*/];
                    }
                });
            }); };
            _this.convertCsvService = new ConvertCsvService(_this.settings);
            _this.getData();
            return _this;
        }
        WfAlarmViewerComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);
            this.showDialog = ko.observable(false);
            this.showSettingsDialog = ko.observable(false);
            this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
            this.activeAndNotAcknowledgedAlarmIds = [];
            this.alarmHornService = new AlarmHornService(this.settings);
            var columns = this.getNameOfAlarmFields(ko.unwrap(this.settings.columns) || ["Priority", "StatusText", "Active", "Group", "Type", "Text"]); // default
            var fields = this.getNameOfAlarmFields(ko.unwrap(this.settings.fields) || ["Priority", "Type", "Text", "Active", "Acknowledged", "Gone"]); // default
            this.fields = {
                headers: ko.observableArray(this.getColumnHeaders(fields)),
                data: ko.observableArray(fields)
            };
            this.columns = {
                headers: ko.observableArray(this.getColumnHeaders(columns)),
                data: ko.observableArray(columns)
            };
            this.isShowAlarmTypeSymbolicTextTranslation = ko.computed(function () {
                return _this.fields.data.indexOf('AlarmTypeSymbolicTextTranslation') > -1;
            });
            this.isShowPriority = ko.computed(function () {
                return _this.fields.data.indexOf('Priority') > -1;
            });
            this.busyContext = new BusyIndicator(this);
            this.filtersChanged = ko.observable(false);
            this.progress = ko.observable(true); // Flag property for long time loading indicator in the view
            this.height = ko.observable(ko.unwrap(this.settings.height) || null);
            this.panelBodyHeight = ko.pureComputed(function () {
                if (!_this.height()) {
                    return null;
                }
                if (_this.headerVisibility()) {
                    return _this.height() - 42;
                }
                return _this.height();
            });
            this.titleText = ko.observable(ko.unwrap(this.settings.titleText) !== undefined ? ko.unwrap(this.settings.titleText) : "CCW AlarmViewer");
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
            this.rowItemCssClass = ko.unwrap(this.settings.rowItemCssClass) || "";
            this.tileItemsCssClass = ko.unwrap(this.settings.tileItemsCssClass) || "col-lg-4 col-md-6";
            this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);
            this.warningCssClass = "btn btn-warning";
            this.ackButtonVisibility = ko.observable(ko.unwrap(this.settings.ackButtonVisibility) !== undefined ? ko.unwrap(this.settings.ackButtonVisibility) : true);
            this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true);
            this.configurationButtonVisibility = ko.observable(ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true);
            this.templateSwitchVisibility = ko.observable(ko.unwrap(this.settings.templateSwitchVisibility) !== undefined ? ko.unwrap(this.settings.templateSwitchVisibility) : true);
            this.exportButtonVisibility = ko.observable(ko.unwrap(this.settings.exportButtonVisibility) !== undefined ? ko.unwrap(this.settings.exportButtonVisibility) : true);
            //#region export project authorization
            this.exportProjectAuthorization = (ko.unwrap(this.settings.exportProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.exportSecuredService = new SecuredService(this.exportProjectAuthorization);
            this.hasExportAuthorization = this.exportSecuredService.hasAuthorization;
            //#endregion
            this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);
            this.groupFilterVisibility = ko.observable(ko.unwrap(this.settings.groupFilterVisibility) !== undefined ? ko.unwrap(this.settings.groupFilterVisibility) : true);
            this.typeFilterVisibility = ko.observable(ko.unwrap(this.settings.typeFilterVisibility) !== undefined ? ko.unwrap(this.settings.typeFilterVisibility) : true);
            this.stateFilterVisibility = ko.observable(ko.unwrap(this.settings.stateFilterVisibility) !== undefined ? ko.unwrap(this.settings.stateFilterVisibility) : true);
            this.priorityFilterVisibility = ko.observable(ko.unwrap(this.settings.priorityFilterVisibility) !== undefined ? ko.unwrap(this.settings.priorityFilterVisibility) : true);
            this.columnsHeaderVisibility = ko.observable(ko.unwrap(this.settings.columnsHeaderVisibility) !== undefined ? ko.unwrap(this.settings.columnsHeaderVisibility) : true);
            this.rowNumberVisibility = ko.observable(ko.unwrap(this.settings.rowNumberVisibility) !== undefined ? ko.unwrap(this.settings.rowNumberVisibility) : true);
            this.columnFilterVisibility = ko.observable(ko.unwrap(this.settings.columnFilterVisibility) !== undefined ? ko.unwrap(this.settings.columnFilterVisibility) : true);
            this.tableView = ko.observable(ko.unwrap(this.settings.tableView) !== undefined ? ko.unwrap(this.settings.tableView) : false);
            this.onlineAlarmsMode = ko.observable(ko.unwrap(this.settings.onlineAlarmsMode) !== undefined ? ko.unwrap(this.settings.onlineAlarmsMode) : true);
            this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset) : "days"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
            this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 7;
            this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset) : "days"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
            this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall) ? ko.unwrap(this.settings.endOffsetIntervall) : 0;
            this.isRollingTimeWindow = ko.observable(ko.unwrap(this.settings.isRollingTimeWindow) !== undefined ? ko.unwrap(this.settings.isRollingTimeWindow) : false);
            this.initializeColors();
            this.initializeFilter();
            this.linkTarget = ko.unwrap(this.settings.linkTarget) !== undefined ? ko.unwrap(this.linkTarget) : "_self";
            this.selectedAlarm = ko.observable({});
            this.selectedAlarmId = ko.observable();
            this.showAckButton = ko.observable(false);
            this.commentAckAlarm = ko.observable();
            this.pollTimer = null;
            this.alarmGroups = ko.observableArray();
            this.alarmTypes = ko.observableArray();
            this.selectedAlarmGroups = ko.observableArray([]);
            this.selectedAlarmTypes = ko.observableArray([]);
            this.selectedAlarmGroups.subscribe(function (newValue) {
                _this.filter.alarmGroups(newValue.concat([]));
            });
            this.selectedAlarmTypes.subscribe(function (newValue) {
                _this.filter.alarmTypes(newValue.concat([]));
            });
            this.initializeAlarmStates();
            this.updateRate = ko.unwrap(this.settings.updateRate);
            this.onlineAlarmsSource = ko.computed(function () {
                return _this.onlineAlarmsMode() === true ? _this.connector.getOnlineAlarms(_this.filter, _this.updateRate) : _this.connector.getOfflineAlarms(_this.filter);
            });
            this.sortingData = ko.observable(null);
            this.onlineAlarms = ko.pureComputed(function () {
                var alarms = _.map(_this.onlineAlarmsSource().alarms(), function (alarm) { return _this.appendAlarmFunctionality(alarm); });
                if (_this.isRollingTimeWindow() && !_this.showSettingsDialog()) {
                    _this.updateFilterTimeInterval();
                    _this.onlineAlarmsSource().filter = _this.filter;
                }
                if (!_this.sortingData())
                    return alarms;
                return alarms.sort(function (a, b) {
                    var x = a[_this.columns.data()[_this.sortingData().index]];
                    var y = b[_this.columns.data()[_this.sortingData().index]];
                    return _this.sortingData().asc ? ((x < y) ? -1 : ((x > y) ? 1 : 0)) : ((x > y) ? -1 : ((x < y) ? 1 : 0));
                });
            }, this);
            this.alarmPrioritys = ko.observableArray([]);
            this.onlineAlarms.subscribe(function (alarms) {
                _this.playSoundforActiveAndNotAcknowledgedAlarms(alarms);
                if (!ko.unwrap(_this.priorityFilterVisibility))
                    _this.alarmPrioritys([]);
                //recive list with uniq priority
                var prioroties = _.uniq(_.map(alarms, function (element, index, list) {
                    return element.Priority;
                }));
                //if recived new priority from server, need update list priorities
                var oldPriorities = _this.alarmPrioritys();
                var isNew = false;
                _.each(prioroties, function (priority) {
                    if (_.indexOf(oldPriorities, priority) === -1)
                        isNew = true;
                });
                if (isNew) {
                    var sortedAlarmPrioritys = _.sortBy(prioroties, function (num) { return num; });
                    _this.alarmPrioritys(sortedAlarmPrioritys);
                }
            });
            this.selectedAlarmPriority = ko.observable();
            this.selectedAlarmPriority.subscribe(function (newValue) {
                if (newValue !== undefined && newValue !== null) {
                    _this.filter.minimumPriority(newValue);
                    _this.filter.maximumPriority(newValue);
                }
                else {
                    _this.filter.minimumPriority(ko.unwrap(_this.settings.minimumPriority) || 0);
                    _this.filter.maximumPriority(ko.unwrap(_this.settings.maximumPriority) || 100);
                }
            });
            this.progress(false);
            this.showFilterActivLabel = ko.observable(false);
            this.newChunkOfflineAlarmsLoading = ko.computed(function () {
                return _this.onlineAlarmsSource().isPolling() && !_this.onlineAlarmsMode();
            });
            this.settingsButtonBarCssClass = ko.computed(function () {
                return _this.filtersChanged() ? _this.warningCssClass : _this.buttonBarCssClass;
            });
            this.isAcknowledgeAll = ko.observable(false);
            this.initializeConfiguration();
            this.isOnlineMode = ko.observable(this.onlineAlarmsMode());
            this.isOnlineMode.subscribe(function () {
                _this.filtersChanged(true);
            });
            this.tempSelectedAlarm = ko.observable();
            this.dateTimeFormat = ko.unwrap(this.settings.dateTimeFormat) ? ko.unwrap(this.settings.dateTimeFormat) : "";
            this.initializeNotDefaultObservables();
            this.herstellerFehlerNr = ko.observable(0);
            this.herstellerTypNr = ko.observable(0);
            this.herstellerTypName = ko.observable("Typ-Bezeichnung");
            this.herstellerBeschreibung1 = ko.observable("Text1");
            this.herstellerBeschreibung2 = ko.observable("Text2");
            this.herstellerBeschreibung3 = ko.observable("Text3");
            this.btnAlarmUrlVisible = ko.observable(false);
            this.btnAlarmUrlText = ko.observable("");
            this.herstellerLink = ko.observable("");
            this.herstellerDokumentPfad = ko.observable("");
            this.herstellerIconPfad = ko.observable("");
            this.infoBoxHerstellerVisible = ko.observable(false);
        };
        WfAlarmViewerComponent.prototype.setColumnFilters = function () {
            var _this = this;
            this.filter.column(FilterColumnType[ko.unwrap(this.settings.columnFilter)] || FilterColumnType.None);
            this.filter.columnFilters(ko.unwrap([this.settings.columnFilterPattern] || [""]));
            var filterColumnTypes = Object.keys(FilterColumnType)
                .map(function (k) {
                return FilterColumnType[k];
            })
                .filter(function (x) {
                return typeof x === "number";
            })
                .map(function (x) {
                return {
                    id: x,
                    name: FilterColumnType[x]
                };
            });
            this.availableColumnFilters = ko.observableArray(filterColumnTypes);
            this.columnFilters = ko.computed({
                read: function () {
                    return _.first(_this.filter.columnFilters());
                },
                write: function (value) {
                    _this.filter.columnFilters([value || ""]);
                },
            });
        };
        WfAlarmViewerComponent.prototype.getData = function () {
            var _this = this;
            this.busyContext.runLongAction("Getting Alarm Groups and Alarm Types", function () { return __awaiter(_this, void 0, void 0, function () {
                var alarmPromis, alarmTypePromis, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            alarmPromis = this.getAlarmGroups();
                            alarmTypePromis = this.getAlarmTypes();
                            return [4 /*yield*/, alarmPromis];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, alarmTypePromis];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.loadInitialConfiguration()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            this.connector.handleError(WfAlarmViewerComponent)(error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfAlarmViewerComponent.prototype.getAlarmGroups = function () {
            return __awaiter(this, void 0, void 0, function () {
                var alarmGroups;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.getAlarmGroups(this.filter.languageId())];
                        case 1:
                            alarmGroups = _a.sent();
                            this.alarmGroups(alarmGroups);
                            // If an alarm group is preset by settings then it should be selected
                            this.selectedAlarmGroups(ko.unwrap(this.settings.alarmGroups || (this.settings.alarmGroup ? [this.settings.alarmGroup] : [])));
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmViewerComponent.prototype.getAlarmTypes = function () {
            return __awaiter(this, void 0, void 0, function () {
                var alarmTypes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.getAlarmTypes(this.filter.languageId())];
                        case 1:
                            alarmTypes = _a.sent();
                            this.alarmTypes(alarmTypes);
                            // If an alarm type is preset by settings then it should be selected
                            this.selectedAlarmTypes(ko.unwrap(this.settings.alarmTypes || (this.settings.alarmType ? [this.settings.alarmType] : [])));
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmViewerComponent.prototype.initializeColors = function () {
            this.acknowledgedAlarmBackground = ko.unwrap(this.settings.acknowledgedAlarmBackground) ? ko.unwrap(this.settings.acknowledgedAlarmBackground) : "#E08F00";
            this.acknowledgedAlarmForeground = ko.unwrap(this.settings.acknowledgedAlarmForeground) ? ko.unwrap(this.settings.acknowledgedAlarmForeground) : "#FFFFFF";
            this.acknowledgedAndGoneAlarmBackground = ko.unwrap(this.settings.acknowledgedAndGoneAlarmBackground) ? ko.unwrap(this.settings.acknowledgedAndGoneAlarmBackground) : "#00CC66";
            this.acknowledgedAndGoneAlarmForeground = ko.unwrap(this.settings.acknowledgedAndGoneAlarmForeground) ? ko.unwrap(this.settings.acknowledgedAndGoneAlarmForeground) : "#FFFFFF";
            this.activeAlarmBackground = ko.unwrap(this.settings.activeAlarmBackground) ? ko.unwrap(this.settings.activeAlarmBackground) : "#990100";
            this.activeAlarmForeground = ko.unwrap(this.settings.activeAlarmForeground) ? ko.unwrap(this.settings.activeAlarmForeground) : "#FFFFFF";
            this.inactiveAlarmBackground = ko.unwrap(this.settings.inactiveAlarmBackground) ? ko.unwrap(this.settings.inactiveAlarmBackground) : "#0c9900";
            this.inactiveAlarmForeground = ko.unwrap(this.settings.inactiveAlarmForeground) ? ko.unwrap(this.settings.inactiveAlarmForeground) : "#FFFFFF";
        };
        WfAlarmViewerComponent.prototype.initializeConfiguration = function () {
            this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
            this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
            this.controlType = connectorEnums_1.ConfigControlType.Alarmliste;
        };
        WfAlarmViewerComponent.prototype.initializeAlarmStates = function () {
            this.availableAlarmStates = ko.observableArray([
                { Number: 16, Description: this.connector.translate('I4SCADA_All') },
                { Number: 2, Description: this.connector.translate('I4SCADA_Not_acknowledged') },
                { Number: 8, Description: this.connector.translate('I4SCADA_Gone') },
                { Number: 4, Description: this.connector.translate('I4SCADA_Active') },
                { Number: 0, Description: this.connector.translate('I4SCADA_Active_and_or_not_acknowledged') }
            ]);
        };
        WfAlarmViewerComponent.prototype.initializeFilter = function () {
            var _this = this;
            this.filter = new AlarmsFilter();
            this.setColumnFilters();
            this.filterAlarmGroupsByUser = ko.unwrap(this.settings.filterAlarmGroupsByUser) !== undefined ? ko.unwrap(this.settings.filterAlarmGroupsByUser) : false;
            this.filter.languageId = this.connector.currentLanguageId;
            this.filter.languageId.subscribe(function () {
                // Trigger a refresh on language change
                _this.applyFilterSettings();
            });
            this.filter.alarmGroups(["*"]);
            this.filter.alarmTypes(["*"]);
            this.filter.minimumPriority(ko.unwrap(this.settings.minimumPriority) || 0);
            this.filter.maximumPriority(ko.unwrap(this.settings.maximumPriority) || 100);
            this.filter.sortOrder(ServerSortOrder[ko.unwrap(this.settings.sortOrder)] || ServerSortOrder.DateDescending);
            this.filter.maxRowCount(ko.unwrap(this.settings.maxRowCount) || 100);
            //this.filter.alarmStatusFilter(ko.unwrap(this.settings.alarmStatusFilter) || 16);
            this.filter.alarmStatusFilter(AlarmStatusFilter[ko.unwrap(this.settings.alarmStatusFilter) !== undefined ? ko.unwrap(this.settings.alarmStatusFilter) : AlarmStatusFilter.All]);
            this.filter.isRollingTimeWindow(this.isRollingTimeWindow());
            this.updateFilterTimeInterval();
            this.filter.isRollingTimeWindow.subscribe(function () {
                _this.filtersChanged(true);
            });
            this.filter.startDate.subscribe(function () {
                _this.filtersChanged(true);
            });
            this.filter.endDate.subscribe(function () {
                _this.filtersChanged(true);
            });
            this.setFilterAlarmGroupsByUser();
            this.connector.currentLoggedInUser.subscribe(function (newValue) {
                _this.setFilterAlarmGroupsByUser();
                _this.applyFilterSettings();
            });
        };
        WfAlarmViewerComponent.prototype.selectAlarm = function (alarm, alarmViewer) {
            return __awaiter(this, void 0, void 0, function () {
                var AlarmLinkURL, herstName, fNr, herstellerTypNr, text1, text2, text3, link, dokumentPfad, iconPfad, btnAlarmUrlVisible, btnAlarmUrlText, infoBoxHerstellerVisible, AlarmLinkURLArr, d;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.selectedAlarm(alarm);
                            AlarmLinkURL = this.selectedAlarm().AlarmLinkURL;
                            // wenn im Webfatory-Studio der Alarm-URL so wie hier abgelegt ist, dann ist ein lesen der SQL-Datenbank erforderlich
                            // 'hersteller;##1##;##2##;#internerProjektLink'
                            // 'hersteller;FehlerNr;HerstellerTyp;Diverses(zB URL-Link)'
                            //  0 'hersteller'  => Kennung, das SQL-Daten gelesen werden müssen
                            //  1 '##1##'       => Ersatzwert 1, hier die Fehlernummer des Antriebes
                            //  2 '##2##'       => Ersatzwert 2, hier der Herstellertyp des Antriebes (4=SEW MOVI-C)
                            //  3 '#internerProjektLink'  => wenn auf eine Seite verwiesen werden soll, dann kann der Link mit einem voranstehenden # angegeben werden
                            console.log(AlarmLinkURL);
                            herstName = "";
                            fNr = 0;
                            herstellerTypNr = 0;
                            text1 = "";
                            text2 = "";
                            text3 = "";
                            link = "";
                            dokumentPfad = "";
                            iconPfad = "";
                            btnAlarmUrlVisible = false;
                            btnAlarmUrlText = "";
                            infoBoxHerstellerVisible = false;
                            if (!(AlarmLinkURL != null)) return [3 /*break*/, 6];
                            if (!(AlarmLinkURL.length > 0)) return [3 /*break*/, 5];
                            if (!(AlarmLinkURL.indexOf("hersteller;", 0) >= 0)) return [3 /*break*/, 4];
                            AlarmLinkURLArr = AlarmLinkURL.split(";");
                            if (!(AlarmLinkURLArr.length >= 3)) return [3 /*break*/, 2];
                            //mindestens 3 Parameter sind übergeben
                            // this.herstellerFehlerNr(parseInt(AlarmLinkURLArr[1]));
                            // this.herstellerTypNr(parseInt(AlarmLinkURLArr[2]));
                            fNr = parseInt(AlarmLinkURLArr[1]);
                            herstellerTypNr = parseInt(AlarmLinkURLArr[2]);
                            btnAlarmUrlVisible = (AlarmLinkURLArr.length > 3);
                            btnAlarmUrlText = (AlarmLinkURLArr.length > 3 ? AlarmLinkURLArr[3] : "");
                            infoBoxHerstellerVisible = (AlarmLinkURLArr.length > 1);
                            return [4 /*yield*/, this.getHerstellerTexte(herstellerTypNr, fNr)];
                        case 1:
                            d = _a.sent();
                            // console.log(d);
                            if (d.Values.length > 0) {
                                herstName = d.Values[0].Hersteller_Name;
                                fNr = d.Values[0].Fehler_Nr;
                                text1 = d.Values[0].Fehler_Info_1;
                                text2 = d.Values[0].Fehler_Info_2;
                                text3 = d.Values[0].Fehler_Info_3;
                                link = d.Values[0].Link;
                                dokumentPfad = d.Values[0].DokumentPfad;
                                iconPfad = d.Values[0].IconPfad;
                            }
                            else {
                                infoBoxHerstellerVisible = false;
                                toastr.error("Die Komponente <b>ccw-wf-alarm-viewer</b> hat festgestellt, dass die Datenbankabfrage <b>kein Ergebnis</b> liefert. <b>Bitte Fehlercode und Hersteller-Typ kontrollieren!</b>");
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            toastr.error("Die Komponente <b>ccw-wf-alarm-viewer</b> hat festgestellt, dass die Parameterübergabe im WF-Feld <b>Alarm URL</b> nicht vollständig ist. Er werden mindestens 3 Parameter in folgender Reihenfolge benötigt: <b>hersteller;##1##;##2##</b>");
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            //hier anzeigen, wenn nur der Text für den URL-Button angezeigt werden soll
                            btnAlarmUrlVisible = true;
                            btnAlarmUrlText = AlarmLinkURL;
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            this.infoBoxHerstellerVisible(false);
                            _a.label = 7;
                        case 7:
                            // Variablen für die HTML-Seite schreiben
                            this.herstellerTypName(herstName);
                            this.herstellerFehlerNr(fNr);
                            this.herstellerBeschreibung1(text1);
                            this.herstellerBeschreibung2(text2);
                            this.herstellerBeschreibung3(text3);
                            this.herstellerLink(link);
                            this.herstellerDokumentPfad(dokumentPfad);
                            this.herstellerIconPfad(iconPfad);
                            this.btnAlarmUrlVisible(btnAlarmUrlVisible);
                            this.btnAlarmUrlText(btnAlarmUrlText);
                            this.infoBoxHerstellerVisible(infoBoxHerstellerVisible);
                            // Dialog öffnen
                            this.showDialog(true);
                            // Store the alarm ID for acknowledgement
                            this.selectedAlarmId(alarm.AlarmID);
                            this.commentAckAlarm(alarm.AckText);
                            // Show ack button if no ack date there for selected alarm
                            this.showAckButton(!alarm.DateAck ? true : false);
                            this.pollTimer = setTimeout(this.pollAlarm, 1000);
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmViewerComponent.prototype.closeModal = function () {
            this.showDialog(false);
            // Clear the pollTimer
            clearTimeout(this.pollTimer);
            // Clear data about selected alarm  
            this.selectedAlarmId(null);
            this.selectedAlarm({});
            this.commentAckAlarm(null);
        };
        WfAlarmViewerComponent.prototype.handleApplyFilterSettings = function () {
            this.closeSettings();
            this.applyFilterSettings();
        };
        WfAlarmViewerComponent.prototype.applyFilterSettings = function (loadConfig) {
            if (loadConfig === void 0) { loadConfig = null; }
            this.isRollingTimeWindow(this.filter.isRollingTimeWindow());
            this.onlineAlarmsSource().stopPolling();
            this.onlineAlarmsMode(this.isOnlineMode());
            if (!this.onlineAlarmsMode())
                this.onlineAlarmsSource().clearPolling();
            if (!loadConfig)
                this.selectedAlarmPriority(this.tempSelectedAlarm());
            this.onlineAlarmsSource().startPolling();
            this.filtersChanged(false);
            if (this.isFilterActive())
                this.showFilterActivLabel(true);
            else
                this.showFilterActivLabel(false);
        };
        WfAlarmViewerComponent.prototype.isFilterActive = function () {
            return this.selectedAlarmTypesIsNotDefault() ||
                this.selectedAlarmStatusIsNotDefault() ||
                this.selectedAlarmGroupsIsNotDefault() ||
                this.selectedAlarmPriorityIsNotDefault() ||
                (this.selectedColumnIsNotDefault() && this.selectedColumnFilterPatternIsNotDefault());
        };
        WfAlarmViewerComponent.prototype.getNewChunkAlarms = function () {
            if (this.onlineAlarmsMode() === true)
                return;
            this.onlineAlarmsSource().startPolling();
        };
        WfAlarmViewerComponent.prototype.onfiltersChanged = function (obj, event) {
            if (event.originalEvent) {
                //Triggered by user changing selection?
                this.filtersChanged(true);
            }
        };
        WfAlarmViewerComponent.prototype.updateSelectedAlarm = function () {
            return __awaiter(this, void 0, void 0, function () {
                var alarmId, data, extendedProperty1, alarm;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.selectedAlarm())
                                return [2 /*return*/];
                            alarmId = ko.unwrap(this.selectedAlarm().AlarmID);
                            return [4 /*yield*/, this.connector.getAlarms([alarmId], this.connector.currentLanguageId())
                                //console.log(data);
                                // const extendedProperty1 = await this.connector.getSignal(this.selectedAlarm().ExtendedProperty1).value();
                            ];
                        case 1:
                            data = _a.sent();
                            extendedProperty1 = this.connector.getSignal('signal_sew_alarm').value();
                            //console.log(extendedProperty1);
                            if (!data || !data.Alarms || data.Alarms.length === 0)
                                return [2 /*return*/];
                            alarm = data.Alarms[0];
                            this.onlineAlarmsSource().adjustAlarmTimeFields(alarm);
                            alarm = this.appendAlarmFunctionality(alarm);
                            this.selectedAlarm(alarm);
                            if (alarm.DateAck && this.showAckButton()) {
                                this.showAckButton(false);
                            }
                            if (!alarm.DateAck && !this.showAckButton()) {
                                this.showAckButton(true);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmViewerComponent.prototype.appendAlarmFunctionality = function (alarm) {
            var _this = this;
            alarm.background = ko.pureComputed(function () {
                if (alarm.DateOff && alarm.DateAck) {
                    return _this.acknowledgedAndGoneAlarmBackground;
                }
                else if (alarm.DateOff) {
                    return _this.inactiveAlarmBackground;
                }
                else if (alarm.DateAck) {
                    return _this.acknowledgedAlarmBackground;
                }
                return _this.activeAlarmBackground;
            });
            alarm.foreground = ko.pureComputed(function () {
                if (alarm.DateOff && alarm.DateAck) {
                    return _this.acknowledgedAndGoneAlarmForeground;
                }
                else if (alarm.DateOff) {
                    return _this.inactiveAlarmForeground;
                }
                else if (alarm.DateAck) {
                    return _this.acknowledgedAlarmForeground;
                }
                return _this.activeAlarmForeground;
            });
            alarm.AcknowledgedWithComment = alarm.DateAck && alarm.AckText ? true : false;
            alarm.Duration =
                alarm.DateOff
                    ? moment.utc(moment(alarm.DateOff).diff(moment(alarm.DateOn))).format("HH:mm:ss")
                    : moment.utc(moment().diff(moment(alarm.DateOn))).format("HH:mm:ss");
            return alarm;
        };
        WfAlarmViewerComponent.prototype.showSettings = function () {
            this.showSettingsDialog(true);
            this.filter.isRollingTimeWindow(this.isRollingTimeWindow());
            if (!this.filtersChanged())
                this.isOnlineMode(this.onlineAlarmsMode());
            this.tempSelectedAlarm(this.selectedAlarmPriority());
        };
        WfAlarmViewerComponent.prototype.closeSettings = function () {
            this.showSettingsDialog(false);
        };
        WfAlarmViewerComponent.prototype.getConfig = function () {
            var content = {
                onlineAlarmsMode: this.onlineAlarmsMode(),
                maxRowCount: this.filter.maxRowCount(),
                startDate: moment(this.filter.startDate()).toMSDate(),
                endDate: moment(this.filter.endDate()).toMSDate(),
                alarmGroup: this.selectedAlarmGroups(),
                alarmStatusFilter: this.filter.alarmStatusFilter(),
                alarmType: this.selectedAlarmTypes(),
                alarmPriority: this.selectedAlarmPriority(),
                filterAlarmGroupsByUser: this.filterAlarmGroupsByUser,
                column: this.filter.column(),
                columnFilterPattern: this.filter.columnFilters(),
                isRollingTimeWindow: this.filter.isRollingTimeWindow()
            };
            return content;
        };
        WfAlarmViewerComponent.prototype.loadConfig = function (content) {
            this.filter.isRollingTimeWindow(content.isRollingTimeWindow !== undefined ? content.isRollingTimeWindow : true);
            this.isRollingTimeWindow(this.filter.isRollingTimeWindow()); //this should be done here in order to keep the startdate from updating while the configuration is being set. This will keep the startDate/endDate that the client saved in the configuration
            this.onlineAlarmsSource().stopPolling();
            this.isOnlineMode(content.onlineAlarmsMode);
            this.filter.maxRowCount(content.maxRowCount);
            this.filter.startDate(moment(content.startDate).toDate());
            this.filter.endDate(ko.unwrap(content.onlineAlarmsMode) ? moment(content.endDate).toDate() : moment().toDate());
            this.selectedAlarmGroups(content.alarmGroup);
            this.filter.alarmStatusFilter(content.alarmStatusFilter);
            this.selectedAlarmTypes(content.alarmType);
            this.selectedAlarmPriority(content.alarmPriority);
            this.filterAlarmGroupsByUser = content.filterAlarmGroupsByUser;
            this.setFilterAlarmGroupsByUser();
            this.filter.column(content.column);
            this.filter.columnFilters(content.columnFilterPattern);
            this.applyFilterSettings(true);
        };
        WfAlarmViewerComponent.prototype.setFilterAlarmGroupsByUser = function () {
            if (this.filterAlarmGroupsByUser) {
                this.filter.filterAlarmGroupsByUser(this.connector.currentLoggedInUser() ? true : false);
                this.filter.userName(this.connector.currentLoggedInUser() ? this.connector.currentLoggedInUser() : null);
            }
            else {
                this.filter.filterAlarmGroupsByUser(false);
                this.filter.userName(null);
            }
        };
        WfAlarmViewerComponent.prototype.acknowledgeAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var needAcknowledge, alarmIds, result, text, translation, text, translation, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isAcknowledgeAll(true);
                            this.onlineAlarmsSource().stopPolling();
                            needAcknowledge = _.filter(this.onlineAlarms(), function (alarm) {
                                return !alarm.DateAck;
                            });
                            alarmIds = _.map(needAcknowledge, function (alarm) { return alarm.AlarmID; });
                            if (alarmIds.length === 0) {
                                this.onlineAlarmsSource().startPolling();
                                this.isAcknowledgeAll(false);
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.acknowledgeAlarms(alarmIds, null)];
                        case 2:
                            result = _a.sent();
                            if (result.Result === true) {
                                text = "I4SCADA_Acknowledgment_successful";
                                translation = ko.unwrap(this.connector.translate(text));
                                this.connector.info(self, translation);
                            }
                            else {
                                text = ErrorCodeService.acknowledgmentErrorCodes[result.ErrorCodes[0].toString()];
                                translation = ko.unwrap(this.connector.translate(text));
                                this.connector.error(this, translation);
                            }
                            this.onlineAlarmsSource().startPolling();
                            this.isAcknowledgeAll(false);
                            return [2 /*return*/, result];
                        case 3:
                            error_2 = _a.sent();
                            this.connector.handleError(WfAlarmViewerComponent)(error_2);
                            this.onlineAlarmsSource().startPolling();
                            this.isAcknowledgeAll(false);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmViewerComponent.prototype.getNameOfAlarmFields = function (columns) {
            console.log(columns);
            return _.map(columns, function (column) {
                switch (column) {
                    case 'Group':
                        return "AlarmGroupSymbolicTextTranslation";
                    case 'Active':
                        return "DateOn";
                    case 'Type':
                        return "AlarmTypeSymbolicTextTranslation";
                    case 'Text':
                        return "AlarmSymbolicTextTranslation";
                    case 'Acknowledged':
                        return "DateAck";
                    case 'StatusText':
                        return "Status";
                    case 'SystemTime':
                        return "SysTime";
                    case 'GeneralComment':
                        return "AlarmComment";
                    case 'AcknowledgeComment':
                        return "AckText";
                    case 'AcknowledgeUserName':
                        return "AckUserName";
                    case 'SignalName':
                        return "SignalAliasName";
                    case 'HttpLink':
                        return "AlarmLinkURL";
                    case 'Gone':
                        return "DateOff";
                    case 'OpcItem':
                        return "SignalName";
                    case 'Name':
                        return "AlarmTag";
                    default:
                        return column;
                }
            });
        };
        WfAlarmViewerComponent.prototype.getColumnHeaders = function (columns) {
            console.log(columns);
            return _.map(columns, function (column) {
                switch (column) {
                    case 'Priority':
                        return "I4SCADA_Alarm_priority";
                    case 'Status':
                        return "I4SCADA_Status";
                    case 'DateOn':
                        return "I4SCADA_Active";
                    case 'AlarmGroupSymbolicTextTranslation':
                        return "I4SCADA_Group";
                    case 'AlarmTypeSymbolicTextTranslation':
                        return "I4SCADA_Type";
                    case 'AlarmSymbolicTextTranslation':
                        return "I4SCADA_Text";
                    case 'DateOff':
                        return "I4SCADA_Gone";
                    case 'DateAck':
                        return "I4SCADA_Confirmed";
                    case 'SysTime':
                        return "I4SCADA_System_Time";
                    case 'HelpCause':
                        return "I4SCADA_Reason";
                    case 'HelpEffect':
                        return "I4SCADA_Impact";
                    case 'HelpRepair':
                        return "I4SCADA_Rectification";
                    case 'AlarmComment':
                        return "I4SCADA_Alarm_Comment";
                    case 'OccurrenceComment':
                        return "I4SCADA_Occurrence_Comment";
                    case 'AckText':
                        return "I4SCADA_Acknowledge_Comment";
                    case 'AckUserName':
                        return "I4SCADA_Acknowledge_UserName";
                    case 'NavigationSource':
                        return "I4SCADA_Navigation_Source";
                    case 'NavigationTarget':
                        return "I4SCADA_Navigation_Target";
                    case 'SignalAliasName':
                        return "I4SCADA_Signal_Name";
                    case 'ServerName':
                        return "I4SCADA_Server";
                    case 'AlarmLinkURL':
                        return "I4SCADA_Alarm_URL";
                    case 'OccurrenceCount':
                        return "I4SCADA_Occurrence_Count";
                    case 'SignalName':
                        return "I4SCADA_OpcItem";
                    case 'AlarmTag':
                        return "I4SCADA_Name";
                    case 'Duration':
                        return "I4SCADA_Duration";
                    case 'AcknowledgedWithComment':
                        return "I4SCADA_Acknowledged_With_Comment";
                }
                if (column.indexOf("ExtendedProperty") > -1) {
                    return "I4SCADA_ExtendedProperty_" + column.replace("ExtendedProperty", "");
                }
            });
        };
        WfAlarmViewerComponent.prototype.isDateField = function (field) {
            return field === 'DateOn' || field === 'DateAck' || field === 'SysTime' || field === 'DateOff';
        };
        WfAlarmViewerComponent.prototype.loadInitialConfiguration = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config, configuration, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.connector.getControlConfigurationsByName(this.initialConfiguration, this.configurationNamespace, this.controlType)];
                        case 1:
                            config = _a.sent();
                            if (config) {
                                configuration = this.standaloneParametersReplacementService.replaceConfigurationParameters(config.Content);
                                this.loadConfig(JSON.parse(configuration));
                            }
                            else {
                                this.applyFilterSettings();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.connector.handleError(WfAlarmViewerComponent)(error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmViewerComponent.prototype.getActiveAndNotAcknowledgedAlarmIds = function (alarms) {
            return _.pluck(alarms.filter(function (item) {
                return item.DateAck == null && item.DateOff == null && item.DateOn != null;
            }), "AlarmID");
        };
        WfAlarmViewerComponent.prototype.checkNewActiveAndNotAcknowledgedAlarms = function (alarmIds, newAlarmIds) {
            if (newAlarmIds.length)
                return _.difference(newAlarmIds, alarmIds);
            else
                return [];
        };
        WfAlarmViewerComponent.prototype.playSoundforActiveAndNotAcknowledgedAlarms = function (alarms) {
            var newAlarms = this.getActiveAndNotAcknowledgedAlarmIds(alarms);
            if (!_.any(newAlarms) && this.alarmHornService.loop) {
                this.alarmHornService.stop();
            }
            var oldAlarms = this.activeAndNotAcknowledgedAlarmIds;
            var newAlarmIds = this.checkNewActiveAndNotAcknowledgedAlarms(oldAlarms, newAlarms);
            this.activeAndNotAcknowledgedAlarmIds = this.getActiveAndNotAcknowledgedAlarmIds(alarms);
            var hasNewAlarm = _.any(newAlarmIds);
            if (this.alarmHornService.loop) {
                if (hasNewAlarm && !this.alarmHornService.isPlaying) {
                    this.alarmHornService.play();
                }
            }
            else {
                if (hasNewAlarm) {
                    this.alarmHornService.play();
                }
            }
        };
        WfAlarmViewerComponent.prototype.handleExport = function () {
            var _this = this;
            var fieldNames = null;
            var fields = null;
            if (this.tableView()) {
                fieldNames = this.columns.headers();
                fields = this.columns.data();
            }
            else {
                fieldNames = this.fields.headers();
                fields = this.fields.data();
            }
            var csvFile = this.convertCsvService.convertAlarmViewertData(this.onlineAlarms(), fieldNames.map(function (item) { return ko.unwrap(_this.connector.translate(item)); }), fields);
            if (csvFile == null)
                return;
            this.convertCsvService.download();
        };
        WfAlarmViewerComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var settingsDialog, settingsBackContainer, alarmDialog, alarmBackContainer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            this.onlineAlarmsSource().stopPolling();
                            settingsDialog = $(document).find('#modal-settings-' + ko.unwrap(this.id));
                            settingsBackContainer = $(document).find('#modal-settings-back-container-' + ko.unwrap(this.id));
                            alarmDialog = $(document).find('#modal-alarm-' + ko.unwrap(this.id));
                            alarmBackContainer = $(document).find('#modal-alarm-back-container-' + ko.unwrap(this.id));
                            settingsDialog.remove();
                            settingsBackContainer.remove();
                            alarmDialog.remove();
                            alarmBackContainer.remove();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmViewerComponent.prototype.initializeNotDefaultObservables = function () {
            var _this = this;
            this.selectedAlarmGroupsIsNotDefault = ko.pureComputed(function () {
                return _this.selectedAlarmGroups().length > 0;
            }, this);
            this.selectedAlarmTypesIsNotDefault = ko.pureComputed(function () {
                return _this.selectedAlarmTypes().length > 0;
            }, this);
            this.selectedColumnIsNotDefault = ko.pureComputed(function () {
                return _this.filter.column() !== FilterColumnType.None;
            }, this);
            this.selectedMaxRowCountIsNotDefault = ko.pureComputed(function () {
                return Number(_this.filter.maxRowCount()) !== 100;
            }, this);
            this.selectedAlarmStatusIsNotDefault = ko.pureComputed(function () {
                return _this.filter.alarmStatusFilter() !== AlarmStatusFilter.All;
            }, this);
            this.selectedAlarmPriorityIsNotDefault = ko.pureComputed(function () {
                return _this.tempSelectedAlarm() !== undefined;
            }, this);
            this.selectedColumnFilterPatternIsNotDefault = ko.pureComputed(function () {
                return _this.filter.columnFilters() !== undefined &&
                    _this.filter.columnFilters() !== null &&
                    _this.filter.columnFilters().length > 0 &&
                    _this.filter.columnFilters()[0] !== "";
            }, this);
        };
        WfAlarmViewerComponent.prototype.getItemCssClass = function (DateOn, DateOff, DateAck) {
            return (DateOn ? 'on' : '') + " " + (DateOff ? 'gone' : '') + " " + (DateAck ? 'acknowledged' : '') + " " + this.rowItemCssClass;
        };
        WfAlarmViewerComponent.prototype.updateFilterTimeInterval = function () {
            if (!this.filter.isRollingTimeWindow()) {
                return;
            }
            var oldFilterChangedValue = this.filtersChanged();
            this.filter.startDate(moment().subtract(this.startOffsetIntervall, this.startOffset).toDate());
            this.filter.endDate(moment().subtract(this.endOffsetIntervall, this.endOffset).toDate());
            this.filtersChanged(oldFilterChangedValue);
        };
        WfAlarmViewerComponent.prototype.getHerstellerTexte = function (herstellerId, fehlerCode) {
            var r = $.Deferred();
            $.ajax({
                // url: 'http://localhost/WsCcw/WsCcw.svc/js/ccwHerstellerTexte',
                url: window.resolveUrl('/WsCcw/WsCcw.svc/js/ccwHerstellerTexte'),
                type: "POST",
                data: JSON.stringify({ herstellerId: herstellerId, fehlerCode: fehlerCode }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log(data.ccwHerstellerTexteResult);
                    //let u = data.ccwGetUserPermissionsResult.UserValues;
                    var d = data.ccwHerstellerTexteResult;
                    r.resolve(d); //Ergebnis positiv "success"
                }
            });
            return r.promise();
        };
        return WfAlarmViewerComponent;
    }(ComponentBaseModel));
    return WfAlarmViewerComponent;
});
//# sourceMappingURL=ccw-wf-alarm-viewer.component.js.map