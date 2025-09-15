// Anderung

// 2021-03-24: amueller
// - V0.3.6 Hide-Linie-Label wird durchgestrichen, siehe cowi.css;
// - wenn Hide-Kurve eingeblendet wird, dann wurde nach Updaterate die Kurve wieder auf Hide gestellt. Das ist behoben.
// 2020-06-30: amueller
// - V0.3.5 Linien können mit dem Parameter "hide" bei der Initialisierung versteckt werden 
// - Versionsanzeige bei Klick auf die Versionsnummer oben links  
// 2020-01-17: amueller
// - V0.3.4 MIN-MAX-AVERAGE wird von WF-Datenbank separat geholt, nach dem Füllen der Linien
// - Webservice angepasst, Version V0.3.4
// - Minimum - Maximum - Durchschnitt in der Legende ausgetauscht
// 2019-11-13: amueller
// - V0.3.3 Probleme beim Firefox und dem Zoom-Schatten-Div 
// - Schatten-DIV beim Zoom war nicht in Ordnung. getTooltipPosition() ist anders aufgebaut
// 2019-09-27: amueller
// - V0.3.2 Button im Head "Statistik ein/ausblenden" programmiert
// 2019-09-24: amueller
// - V0.3.2 Parameter "staticLegendText" mit reingenommen. Der Kommentar aus WF-DB kann damit überschrieben werden.
// - Nach dem laden wird statt Spinner ein grüner Haken angezeigt.
// - Parameter "tooltipPosition: 'top-left'" mit reingenommen. Das Tooltip-Fenster kann fest eingestellt werden. Bei Mausberührung im Top-Bereich wird das Fenster auf die andere Seite geschoben.
// 2019-09-19: amueller
// - V0.3.1 Parameter "signalFactor" mit reingenommen. Falls viele Bool-Werte auf einer Linie versetzt angezeigt werden sollen.
// 2019-09-01: amueller
// - V0.3.0 Parameter "staticUnitText" mit reingenommen. Damit kann der Webfactory-Unit-Text überschrieben werden, gerade bei Rezept-Bausteinen hilfreich (Unit ist dort Rez-Name)
// 2019-08-01: amueller
// - V0.2.2 teilweise produktiver Einsatz
// 2019-07-10: amueller
// - ccw-wf-chart-1 jetzt mit Overlay-Div um die Zeitspanne auszuwaehlen


import Connector = require("src/services/connector");
import LogValuesFilter = require("src/services/models/logValuesFilter");
import Signal = require("src/services/models/signal");
import ConvertCsvService = require("src/components/services/convert-csv.service");
import BusyIndicator = require("src/decorators/busyIndicator");
import ComponentBaseModel = require("src/components/component-base.model");
import SecuredService = require("src/components/services/secured.service");
import StandaloneParametersReplacementService = require("src/components/services/standalone-parameters-replacement.service");
import { ConfigControlType } from "src/services/connectorEnums";

import Moment = moment.Moment;
import Wfchart1 = require("src/components/historical/_wf-chart-1");
import IWfChart1Params = Wfchart1.IWfChart1Params;
import IChartAxesConfig = Wfchart1.IChartAxesConfig;
import IChartLine = Wfchart1.IChartLine;
import IChartTooltip = Wfchart1.IChartTooltip;
import IChartAxes = Wfchart1.IChartAxes;
import IChartPadding = Wfchart1.IChartPadding;
import IAxisConfigration = Wfchart1.IAxisConfigration;
import IWfChart1Line = Wfchart1.IWfChart1Line;

import HttpApi = require("src/viewModels/cowi/services/httpApi");
import HttpService = require("src/services/http");

declare var uuid;

interface CCWDatedLogValuesDTO {
  EntriesDate: DateTime | Date;
  // Values: CCWLogValueDTO[];
  Values: number[];  //vorher ein Objekt, jetzt nur Number
}

interface CCWLogValueDTO {
  Value: number;
  Value2: string;
}

interface ccwLogValuesFilterDTO {
  LogID: string[];
  StartDate: moment.MSDateTimeOffset;
  EndDate: moment.MSDateTimeOffset;
  MaxResults?: number;
  SortOrder: LogValuesSortOrder;
  DbName: string;
  IsI4Scada?: boolean;
}
interface IZoomDTO {
  startDate: Date;
  endDate: Date;
}


// Zusaetzliche Parameter Eingaenge, die vorhandenen sind hier als EXETENDS eingebunden
interface ICcwWfChart1Params extends IWfChart1Params {
  dbName: string;
  logsAlsDurchschnittswerte: boolean;
  chartId: string;
  // versionenChartId: KnockoutObservable<string>;
  tooltipPosition:string;
  isI4Scada: boolean;
}

interface CCWGetMinMaxAvgValueDTO {
  Value: number;
  Date: string;
}
interface CCWGetMinMaxAvgValue {
  Min: CCWGetMinMaxAvgValueDTO;
  Max: CCWGetMinMaxAvgValueDTO;
  Avg: number;
}

class ccwLogValuesFilter {
  public logIds = ko.observableArray<string>();
  public startDate = ko.observable<moment.Moment>();
  public endDate = ko.observable<moment.Moment>();
  public maxResults = ko.observable<number>();
  public sortOrder = ko.observable<LogValuesSortOrder>();
  public dbName = ko.observable<string>();
  public isI4Scada? = ko.observable<boolean>();

  constructor(
    logIds: string[],
    startDate: moment.Moment,
    endDate: moment.Moment,
    maxResults: number = null,
    sortOrder: LogValuesSortOrder = LogValuesSortOrder.DateAscending,
    dbName: string = "",
    isI4Scada: boolean = null
  ) {
    this.logIds(logIds);
    this.startDate(startDate);
    this.endDate(endDate);
    this.maxResults(maxResults);
    this.sortOrder(sortOrder);
    this.dbName(dbName);
    this.isI4Scada(isI4Scada);
  }

  public toDto(): ccwLogValuesFilterDTO {
    var dto: ccwLogValuesFilterDTO = {
      LogID: this.logIds(),
      StartDate: moment(this.startDate()).toMSDateTimeOffset(),
      EndDate: moment(this.endDate()).toMSDateTimeOffset(),
      SortOrder: this.sortOrder(),
      MaxResults: this.maxResults(),
      DbName: this.dbName(),
      IsI4Scada: this.isI4Scada()
    };

    return dto;
  }
}
class ObservableAxisConfigration {
  public maxValue = ko.observable<number>();
  public isMaxSignalDependent = ko.observable<boolean>();
  public minValue = ko.observable<number>();
  public isMinSignalDependent = ko.observable<boolean>();
  public label = ko.observable<string>();

  public color = ko.observable<string>();
  public visible = ko.observable<boolean>();
  public isDisplayedInner = ko.observable<boolean>();
  public tickCount = ko.observable<number>();
  public tickFormat = ko.observable<any>();
  public isGridVisible = ko.observable<boolean>();
}

class ObservableChartAxesConfiguration {
  public x: KnockoutObservable<ObservableAxisConfigration>;
  public y1: KnockoutObservable<ObservableAxisConfigration>;
  public y2: KnockoutObservable<ObservableAxisConfigration>;
}



class WfChart1Component extends ComponentBaseModel<ICcwWfChart1Params> {
  private isRealTimeUpdating: KnockoutComputed<boolean>;
  private showOnlyOwnConfigurations: boolean;
  private exportButtonVisibility: KnockoutObservable<boolean>;
  private axisLabels: KnockoutComputed<IChartAxesConfig>;
  private hasSignalSelectionAuthorization: KnockoutComputed<boolean>;
  private hasConfigurationAuthorization: KnockoutComputed<boolean>;
  private hasExportAuthorization: KnockoutComputed<boolean>;
  private signalSecuredService: SecuredService;
  private configurationSecuredService: SecuredService;
  private exportSecuredService: SecuredService;
  private signalSelectionProjectAuthorization: string;
  private configurationProjectAuthorization: string;
  private exportProjectAuthorization: string;

  private y2AxisLabelInput = ko.observable<string>();
  private y2AxisMinValueInput = ko.observable<number>();
  private y2AxisMinIsSignalDependentInput = ko.observable<boolean>();
  private y2AxisMaxValueInput = ko.observable<number>();
  private y2AxisMaxIsSignalDependentInput = ko.observable<boolean>();

  private y1AxisLabelInput = ko.observable<string>();
  private y1AxisMinValueInput = ko.observable<number>();
  private y1AxisMinIsSignalDependentInput = ko.observable<boolean>();
  private y1AxisMaxValueInput = ko.observable<number>();
  private y1AxisMaxIsSignalDependentInput = ko.observable<boolean>();

  private x1AxisLabelInput = ko.observable<string>();

  private endOffsetIntervall: number;
  private endOffset: string;
  private timeRangeDateInput: KnockoutObservable<Date>;
  private selectedRangeInput: KnockoutObservable<CalendarTimeRanges>;
  private selectedRange: KnockoutObservable<CalendarTimeRanges>;
  private isLoading: KnockoutObservable<boolean>;
  private convertCsvService: ConvertCsvService;
  private lineTypes: KnockoutComputed<KeyValuePair<string, string>>;
  private showHistoryManage: KnockoutComputed<boolean>;
  private isSignalLoading: KnockoutObservable<boolean>;
  protected selectedLines: KnockoutObservableArray<IChartLine>;
  private averageValue: KnockoutComputed<number | "">;
  private maxValueTimestamp: KnockoutComputed<Date>;
  private maxValue: KnockoutComputed<number | "-">;
  private minValueTimestamp: KnockoutComputed<Date>;
  private minValue: KnockoutComputed<number | "-">;
  private c3Chart: KnockoutObservable<any>;
  private legendNames: KnockoutComputed<KeyValuePair<string, string>>;
  private hasMorePoints: KnockoutObservable<boolean>;
  private lastDisplayedDate: KnockoutComputed<Date | string | Moment>;
  private firstDisplayedDate: KnockoutComputed<Date | string | Moment>;
  private hasData: KnockoutComputed<boolean>;
  private data: KnockoutObservableArray<KeyValuePair<number, any>>;
  private yAxisStyles: KnockoutComputed<string>;
  private axes: KnockoutComputed<KeyValuePair<string, string>>;
  private timeStamps: KnockoutObservableArray<string | Date>;
  private values: KnockoutObservableArray<any>;
  private timeAxisFormat: KnockoutObservable<string>;
  private sortOrder: KnockoutObservable<LogValuesSortOrder>;
  private getLatestLogdata: boolean;
  private maxResultsInput: KnockoutObservable<number>;
  private endDateInput: KnockoutObservable<Date>;
  private startDateInput: KnockoutObservable<Date>;
  private pollTimer: ReturnType<typeof setTimeout>;
  private endDate: KnockoutObservable<Date>;
  private startDate: KnockoutObservable<Date>;
  private startOffsetIntervall: number;
  private startOffset: string;
  private updateRate: number;
  private autoUpdate: KnockoutObservable<boolean>;
  private isAutoUpdating: KnockoutObservable<boolean>;
  private tooltip: KnockoutObservable<IChartTooltip>;
  private zoomConfig: KnockoutObservable<{ enabled: boolean; rescale: boolean }>;
  private pointsConfig: KnockoutObservable<{ show: boolean; r: number }>;
  private transitionDuration: KnockoutObservable<number>;
  private legendConfig: KnockoutObservable<{ show: boolean; position: string }>; //; item: any
  private subChartConfig: KnockoutObservable<{ show: boolean; size: { height: number } }>;
  private gridConfig: KnockoutObservable<{ x: { show: boolean }; y: { show: boolean } }>;
  private title: KnockoutObservable<string>;
  private maxResults: KnockoutObservable<number>;
  private maxSignalCount: KnockoutObservable<number>;
  private format: string;
  private sizeConfig: KnockoutObservable<{ height: number; width: number }>;
  private axisesColor: KnockoutComputed<KeyValuePair<string, string>>;
  private minValueForAxises: KnockoutComputed<IChartAxes>;
  private maxValueForAxises: KnockoutComputed<IChartAxes>;
  private axisConfig: KnockoutComputed<IChartAxesConfig>;
  private removePaddingForY2: KnockoutComputed<boolean>;
  private removePaddingForY: KnockoutComputed<boolean>;
  private showSecondAxis: KnockoutComputed<boolean>;
  private showFirstAxis: KnockoutComputed<boolean>;
  protected lines: KnockoutObservableArray<IChartLine>;
  private chartPadding: KnockoutObservable<IChartPadding>;
  private buttonBarCss: string;
  private configurationButtonIconClass: string;
  private panelBarCssClass: string;
  private buttonBarCssClass: string;
  private controlType: ConfigControlType;
  private configurationNamespace: string;
  private initialConfiguration: string;
  private configurationButtonVisibility: KnockoutObservable<boolean>;
  private settingsButtonVisibility: KnockoutObservable<boolean>;
  private signalsButtonVisibility: KnockoutObservable<boolean>;
  // private statisticsVisibility: KnockoutObservable<boolean>;
  private statisticsVisibility: KnockoutComputed<boolean>;
  private footerVisibility: KnockoutObservable<boolean>;
  private headerVisibility: KnockoutObservable<boolean>;
  private chartType: KnockoutObservable<"line" | "step" | "spline" | "bar" | "area" | "area-spline">;
  private chartHeight: KnockoutObservable<number>;
  private chartWidth: KnockoutObservable<number>;
  private placeHolderID: KnockoutComputed<string>;
  private languageId: KnockoutObservable<number>;
  private busyContext: BusyIndicator;
  private signalFilterText: string;
  private legendText: string;
  private showSignalsDialog: KnockoutObservable<boolean>;
  private showDialog: KnockoutObservable<boolean>;
  private showIsStaticColumn: boolean;
  private showDateTimeTooltip: boolean;
  private dateTimeTooltipFormat: string;
  private chartAxes: KnockoutObservable<ObservableChartAxesConfiguration>;
  private standaloneParametersReplacementService: StandaloneParametersReplacementService;
  private isChartZoomed: KnockoutObservable<boolean> = ko.observable<boolean>(false);
  private dbName: string;
  private activeSubchart: KnockoutObservable<boolean>;
  private btnZoomZurueckEnable: KnockoutObservable<boolean>;
  private zoomZurueckArray: IZoomDTO[] = new Array();
  private btnZoomZurueckBackgColor: KnockoutObservable<string>;
  private overlayDivLeft: KnockoutObservable<string>;
  private overlayDivWidth: KnockoutObservable<string>;
  private overlayDivHeight: KnockoutObservable<string>;
  private overlayDivTop: KnockoutObservable<string>;
  private onMouseOverLeft: number;
  private overlayDivClientX1: KnockoutObservable<number>;
  private overlayDivClientX2: KnockoutObservable<number>;
  private overlayDivShow: KnockoutObservable<boolean>;
  private zoomZurueckArrayLen: KnockoutObservable<number>;
  private startDateOld: Date;
  private endDateOld: Date;
  private logsAlsDurchschnittswerte: boolean;
  private chartId: string;
  private tooltipPosition: KnockoutObservable<string>;
  // private getTooltipPosition: KnockoutComputed<string>;
  private statisticsVisibilityIntern: KnockoutObservable<boolean>;
  private btnStatisticCss: KnockoutComputed<string>;
  private minMaxAvgValues: CCWGetMinMaxAvgValue[] = new Array();
  private hideConfig: KnockoutObservableArray<string>;
  // private getHideConfig: KnockoutComputed<any>;  //ist normale Funktion geworden
  private versionenChartId: KnockoutObservable<string>;
  private getHideConfigInit: boolean;  //Hilfsvariable zum initialsieren einer versteckten Linie
  private isI4Scada: boolean;

  constructor(params: ICcwWfChart1Params) {
    super(params);
    this.convertCsvService = new ConvertCsvService(this.settings);
    // console.log(params);
    console.log("CONSTRUKTOR");

    this.chartId = 'myChart-' + uuid.v4();
    this.versionenChartId = ko.observable('versionen_myChart-' + uuid.v4());
    this.getHideConfigInit = false;

    this.initSignalNamen(params);

    this.loadInitialConfiguration();
  }

  protected initializeSettings() {
    super.initializeSettings();

    this.initializeObservables();

    this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);

    this.showOnlyOwnConfigurations =
      this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
    this.showIsStaticColumn = this.settings.showIsStaticColumn || false;
    this.showDateTimeTooltip = this.settings.showDateTimeTooltip || false;
    this.dateTimeTooltipFormat =
      this.settings.dateTimeTooltipFormat !== undefined ? this.settings.dateTimeTooltipFormat : "DD.MM.YYYY HH:mm:ss";

    //#region configuration project authorization
    this.configurationProjectAuthorization = (
      ko.unwrap(this.settings.configurationProjectAuthorization) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.configurationSecuredService = new SecuredService(this.configurationProjectAuthorization);
    this.hasConfigurationAuthorization = this.configurationSecuredService.hasAuthorization;
    //#endregion

    //#region signal selection project authorization
    this.signalSelectionProjectAuthorization = (
      ko.unwrap(this.settings.signalSelectionProjectAuthorization) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalSecuredService = new SecuredService(this.signalSelectionProjectAuthorization);
    this.hasSignalSelectionAuthorization = this.signalSecuredService.hasAuthorization;
    //#endregion

    //#region export project authorization
    this.exportProjectAuthorization = (
      ko.unwrap(this.settings.exportProjectAuthorization) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.exportSecuredService = new SecuredService(this.exportProjectAuthorization);
    this.hasExportAuthorization = this.exportSecuredService.hasAuthorization;
    //#endregion

    this.showDialog = ko.observable(false);
    this.showSignalsDialog = ko.observable(false);

    this.legendText = ko.unwrap(this.settings.legendText) || "AliasName";
    this.signalFilterText = ko.unwrap(this.settings.signalFilterText) || "AliasName";

    this.busyContext = new BusyIndicator(this);

    this.languageId = this.connector.currentLanguageId ? this.connector.currentLanguageId : ko.observable(9);
    this.languageId.subscribe(() => {
      // Reload the signal information on language change
      this.getSignalInformations(true);
    });

    this.placeHolderID = ko.computed(() => {
      return "#" + ko.unwrap(this.id);
    });

    this.chartWidth = ko.observable(ko.unwrap(this.settings.chartWidth));
    this.chartHeight = ko.observable(ko.unwrap(this.settings.chartHeight)) || undefined;
    this.chartType = ko.observable(ko.unwrap(this.settings.chartType) || "line"); //line, step, spline, bar, area, area-spline

    this.headerVisibility = ko.observable(
      ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true
    );
    this.footerVisibility = ko.observable(
      ko.unwrap(this.settings.footerVisibility) !== undefined ? ko.unwrap(this.settings.footerVisibility) : false
    );

    this.statisticsVisibilityIntern = ko.observable(ko.unwrap(this.settings.statisticsVisibility) !== undefined ? ko.unwrap(this.settings.statisticsVisibility) : false);
    this.statisticsVisibility = ko.computed(() => {
      var anzeigen = ko.unwrap(this.statisticsVisibilityIntern);
      return anzeigen;
    });

    this.btnStatisticCss = ko.computed(() => {
      var css = 'btn btn-default';
      if (ko.unwrap(this.statisticsVisibility)) {
        css = 'btn btn-info';
      }
      return css;
    });

    this.signalsButtonVisibility = ko.observable(
      ko.unwrap(this.settings.signalsButtonVisibility) !== undefined
        ? ko.unwrap(this.settings.signalsButtonVisibility)
        : true
    );
    this.settingsButtonVisibility = ko.observable(
      ko.unwrap(this.settings.settingsButtonVisibility) !== undefined
        ? ko.unwrap(this.settings.settingsButtonVisibility)
        : true
    );
    this.configurationButtonVisibility = ko.observable(
      ko.unwrap(this.settings.configurationButtonVisibility) !== undefined
        ? ko.unwrap(this.settings.configurationButtonVisibility)
        : true
    );
    this.exportButtonVisibility = ko.observable(
      ko.unwrap(this.settings.exportButtonVisibility) !== undefined
        ? ko.unwrap(this.settings.exportButtonVisibility)
        : true
    );

    this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(
      this.objectID
    );
    this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(
      this.objectID
    );
    this.controlType = ConfigControlType.LogTagTrend;

    this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
    this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
    this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);
    // DEPRECATED PROPERTY
    // Property "buttonBarCss" is deprecated. Please use "buttonBarCssClass" instead.
    this.buttonBarCss = ko.unwrap(this.settings.buttonBarCssClass) || "";

    this.chartPadding = ko.observable({
      left: ko.unwrap(this.settings.chartPaddingLeft),
      right: ko.unwrap(this.settings.chartPaddingRight),
      top: ko.unwrap(this.settings.chartPaddingTop),
      bottom: ko.unwrap(this.settings.chartPaddingbottom)
    });

    this.lines = ko.observableArray<IChartLine>();

    this.showSecondAxis = ko.computed(() => {
      return ko.unwrap(this.settings.y2AxisVisible) !== undefined
        ? ko.unwrap(this.settings.y2AxisVisible)
        : _.any(this.lines(), line => {
          return line.axis().toLowerCase() === "y2";
        });
    }, this);

    this.showFirstAxis = ko.computed(() => {
      return ko.unwrap(this.settings.y1AxisVisible) !== undefined
        ? ko.unwrap(this.settings.y1AxisVisible)
        : _.any(this.lines(), line => {
          return line.axis().toLowerCase() !== "y2";
        });
    }, this);

    this.removePaddingForY = ko.pureComputed(() => {
      return ko.unwrap(this.chartAxes().y1().minValue) ||
        ko.unwrap(this.chartAxes().y1().maxValue) ||
        ko.unwrap(this.chartAxes().y1().isMinSignalDependent) ||
        ko.unwrap(this.chartAxes().y1().isMaxSignalDependent)
        ? true
        : false;
    });

    this.removePaddingForY2 = ko.pureComputed(() => {
      return ko.unwrap(this.chartAxes().y2().minValue) ||
        ko.unwrap(this.chartAxes().y2().maxValue) ||
        ko.unwrap(this.chartAxes().y2().isMinSignalDependent) ||
        ko.unwrap(this.chartAxes().y2().isMaxSignalDependent)
        ? true
        : false;
    });

    this.initializeAxesConfigurationFromSettigs(this.settings);

    this.dbName = ko.unwrap(this.settings.dbName) || "";
    this.activeSubchart = ko.observable(false);
    this.logsAlsDurchschnittswerte = ko.unwrap(this.settings.logsAlsDurchschnittswerte) || false;
    this.tooltipPosition = ko.observable(this.settings.tooltipPosition || "line"); //line, step, spline, bar, area, area-spline

    this.axisLabels = ko.computed(() => {
      return {
        x:
          this.chartAxes()
            .x()
            .label() || "",
        y:
          this.chartAxes()
            .y1()
            .label() || "",
        y2:
          this.chartAxes()
            .y2()
            .label() || ""
      };
    }, this);

    this.maxValueForAxises = ko.pureComputed(() => {
      const triggerY1MaxSignal = this.chartAxes()
        .y1()
        .isMaxSignalDependent();
      const triggerY2MaxSignal = this.chartAxes()
        .y2()
        .isMaxSignalDependent();

      var value = {
        x: undefined as number | undefined,
        y: undefined as number | undefined,
        y2: undefined as number | undefined
      };
      var lines: IChartLine[] = ko.toJS(this.lines);

      if (triggerY1MaxSignal) {
        var axisY = _.findWhere(lines, { axis: "y1" });
        if (axisY !== undefined) value.y = Number(ko.unwrap(axisY.maxAxis));
      } else if (
        this.chartAxes()
          .y1()
          .maxValue()
      ) {
        value.y = Number(
          this.chartAxes()
            .y1()
            .maxValue()
        );
      }

      if (triggerY2MaxSignal) {
        var axisY2 = _.findWhere(lines, { axis: "y2" });
        if (axisY2 !== undefined) value.y2 = Number(ko.unwrap(axisY2.maxAxis));
      } else if (
        this.chartAxes()
          .y2()
          .maxValue()
      ) {
        value.y2 = Number(
          this.chartAxes()
            .y2()
            .maxValue()
        );
      }

      this.isI4Scada = ko.unwrap(this.settings.isI4Scada);
      
      return value;
    }, this);

    this.minValueForAxises = ko.pureComputed(() => {
      const triggerY1MinSignal = this.chartAxes()
        .y1()
        .isMinSignalDependent();
      const triggerY2MinSignal = this.chartAxes()
        .y2()
        .isMinSignalDependent();

      var value = {
        x: undefined as number | undefined,
        y: undefined as number | undefined,
        y2: undefined as number | undefined
      };
      var lines: IChartLine[] = ko.toJS(this.lines);

      if (triggerY1MinSignal) {
        var axisY = _.findWhere(lines, { axis: "y1" });
        if (axisY !== undefined) value.y = Number(ko.unwrap(axisY.minAxis));
      } else if (
        this.chartAxes()
          .y1()
          .minValue()
      ) {
        value.y = Number(
          this.chartAxes()
            .y1()
            .minValue()
        );
      }

      if (triggerY2MinSignal) {
        var axisY2 = _.findWhere(lines, { axis: "y2" });
        if (axisY2 !== undefined) value.y2 = Number(ko.unwrap(axisY2.minAxis));
      } else if (
        this.chartAxes()
          .y2()
          .minValue()
      ) {
        value.y2 = Number(
          this.chartAxes()
            .y2()
            .minValue()
        );
      }

      return value;
    });

    this.axisConfig = ko.pureComputed(() => {
      var config = {
        y: {
          show: this.chartAxes()
            .y1()
            .visible(),

          label: {
            position: "outer-middle"
            // inner-top : default
            // inner-middle
            // inner-bottom
            // outer-top
            // outer-middle
            // outer-bottom
          },
          inner: this.chartAxes()
            .y1()
            .isDisplayedInner(),
          max: this.maxValueForAxises().y,
          min: this.minValueForAxises().y,
          tick: {
            count: this.chartAxes()
              .y1()
              .tickCount(),
            format:
              this.chartAxes()
                .y1()
                .tickFormat() || d3.format(".1f")
          },
          padding: this.removePaddingForY() ? { top: 0, bottom: 0 } : null
        },
        y2: {
          label: {
            position: "outer-middle"
            // inner-top : default
            // inner-middle
            // inner-bottom
            // outer-top
            // outer-middle
            // outer-bottom
          },
          inner: this.chartAxes()
            .y2()
            .isDisplayedInner(),
          max: this.maxValueForAxises().y2,
          min: this.minValueForAxises().y2,
          tick: {
            count: this.chartAxes()
              .y2()
              .tickCount(),
            format:
              this.chartAxes()
                .y2()
                .tickFormat() || d3.format(".1f")
          },
          padding: this.removePaddingForY2() ? { top: 0, bottom: 0 } : null
        },
        x: {
          show: this.chartAxes()
            .x()
            .visible(),

          label: {
            position: "outer-center"
            // inner-right : default
            // inner-center
            // inner-left
            // outer-right
            // outer-center
            // outer-left
          },

          type: ko.unwrap(this.settings.x1AxisType) || "timeseries",
          tick: {
            format:
              this.chartAxes()
                .x()
                .tickFormat() || "%H:%M:%S %d.%m.%Y",
            fit: ko.unwrap(this.settings.x1AxisTickFit) !== undefined ? ko.unwrap(this.settings.x1AxisTickFit) : false,
            count: this.chartAxes()
              .x()
              .tickCount()
          }
        }
      };
      return config;
    });

    this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
    this.maxResults = ko.observable(ko.unwrap(this.settings.maxResults) ? ko.unwrap(this.settings.maxResults) : 500);
    this.maxSignalCount = ko.observable(
      ko.unwrap(this.settings.maxSignalCount) ? ko.unwrap(this.settings.maxSignalCount) : 50
    );
    this.title = ko.observable(
      (ko.unwrap(this.settings.title) ? ko.unwrap(this.settings.title) : "CCW Chart").stringPlaceholderResolver(
        this.objectID
      )
    );

    this.axisesColor = ko.pureComputed(() => {
      var self = this;
      var colors = {} as KeyValuePair<string, string>;

      _.each(self.lines(), (line, index) => {
        colors[self.getChartLineName(line, index)] = ko.unwrap(line.color);
      });

      return colors;
    });

    this.sizeConfig = ko.observable({
      height: this.chartHeight(),
      width: this.chartWidth()
    });

    this.gridConfig = ko.observable({
      x: {
        show: this.chartAxes()
          .x()
          .isGridVisible()
      },
      y: {
        show: this.chartAxes()
          .y1()
          .isGridVisible()
      }
    });

    const self = this;

    this.activeSubchart(
      ko.unwrap(this.settings.subChartVisible) !== undefined ? ko.unwrap(this.settings.subChartVisible) : false
    );
    this.subChartConfig = ko.observable({
      show: this.activeSubchart(),
      size: {
        height: ko.unwrap(this.settings.subChartHeight) || 50
      },
      onbrush: function (domain) {
        self.onSubchartZoomChanged(this, domain);
      }
    });


    this.legendConfig = ko.observable({
      show: ko.unwrap(this.settings.legendVisible) !== undefined ? ko.unwrap(this.settings.legendVisible) : true,
      position: ko.unwrap(this.settings.legendPosition) || "bottom"
      // item: {  //wenn es aktiviert werdem soll, dann im Header-Bereich das item mit definieren
      //   onclick: (id) => {
      //     return this.onclickLegend(id);
      //   }
      // }
    });

    this.transitionDuration = ko.observable(0);
    this.pointsConfig = ko.observable({
      show: ko.unwrap(this.settings.pointsVisible) !== undefined ? ko.unwrap(this.settings.pointsVisible) : false,
      r: ko.unwrap(this.settings.pointsRadius) || 2.0
    });

    this.zoomConfig = ko.observable({
      enabled: ko.unwrap(this.settings.zoomEnabled) !== undefined ? ko.unwrap(this.settings.zoomEnabled) : false,
      rescale: ko.unwrap(this.settings.zoomRescale) !== undefined ? ko.unwrap(this.settings.zoomRescale) : true
    });


    this.tooltip = ko.observable({
      show: ko.unwrap(this.settings.tooltipVisibility) !== undefined ? ko.unwrap(this.settings.tooltipVisibility) : true,
      contents: (chartthis, d, defaultTitleFormat, defaultValueFormat, color) => {
        return this.getTooltipContents(chartthis, d, defaultTitleFormat, defaultValueFormat, color);
      }
      ,
      // position : undefined
      position: (data, width, height, element) => {
        return this.getTooltipPosition(data, width, height, element);
      }

      // position: this.getTooltipPosition(data, width, height, element)
      // position: function (data, width, height, element) {
      //   var top = d3.mouse(element)[1] + 15;
      //   console.log(top);
      //   top = 0;
      //   var left = parseInt(element.getAttribute('x')) + parseInt(element.getAttribute('width'));
      //   console.log(left);
      //   left = 10;
      //   return { top: top, left: 90 };
      // }
    });

    this.pollTimer = null;
    this.isAutoUpdating = ko.observable(false);
    this.autoUpdate = ko.observable(ko.unwrap(this.settings.autoUpdate) ? ko.unwrap(this.settings.autoUpdate) : false);
    this.updateRate = Math.max(ko.unwrap(this.settings.updateRate) ? ko.unwrap(this.settings.updateRate) : 2000, 100);

    this.isRealTimeUpdating = ko.pureComputed(() => {
      return this.autoUpdate() && !this.isAutoUpdating();
    }, this);

    this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset) : "minutes"; //"seconds", "minutes", "days", "weeks", "months", "years"
    this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall)
      ? ko.unwrap(this.settings.startOffsetIntervall)
      : 30;

    this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset) : "minutes"; //"seconds", "minutes", "days", "weeks", "months", "years"
    this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall)
      ? ko.unwrap(this.settings.endOffsetIntervall)
      : 0;

    this.startDate = ko.observable(
      moment()
        .subtract(this.startOffsetIntervall, this.startOffset)
        .toDate()
    );
    this.endDate = ko.observable(moment().toDate());

    this.startDateInput = ko.observable(this.startDate());
    this.endDateInput = ko.observable(this.endDate());
    this.maxResultsInput = ko.observable(this.maxResults());

    this.selectedRange = ko.observable(CalendarTimeRanges.Custom);
    this.selectedRangeInput = ko.observable(this.selectedRange());
    this.timeRangeDateInput = ko.observable<Date>();

    this.getLatestLogdata =
      this.settings.getLatestLogdata != undefined ? ko.unwrap(this.settings.getLatestLogdata) : true;

    this.sortOrder = ko.observable(LogValuesSortOrder.DateDescending);

    this.timeAxisFormat = ko.observable(ko.unwrap(this.settings.x1AxisTickFormat) || "%H:%M:%S %d.%m.%Y");
    this.values = ko.observableArray();
    this.timeStamps = ko.observableArray<string | Date>();

    this.axes = ko.pureComputed(() => {
      var self = this;
      var axes = {} as KeyValuePair<string, string>;

      _.each(self.lines(), (line, index) => {
        axes[this.getChartLineName(line, index)] = line.axis() && line.axis().toLowerCase() === "y2" ? "y2" : "y";
      });

      return axes;
    }, this);

    this.yAxisStyles = ko.pureComputed(() => {
      var y1AxisStyles =
        "#wf-chart-" +
        ko.unwrap(this.id) +
        " .c3 .c3-axis.c3-axis-y line, #wf-chart-" +
        ko.unwrap(this.id) +
        " .c3 .c3-axis.c3-axis-y path { stroke: " +
        this.chartAxes()
          .y1()
          .color() +
        "} #wf-chart-" +
        ko.unwrap(this.id) +
        " .c3 .c3-axis.c3-axis-y text { fill: " +
        this.chartAxes()
          .y1()
          .color() +
        "}";
      var y2AxisStyles =
        "#wf-chart-" +
        ko.unwrap(this.id) +
        " .c3 .c3-axis.c3-axis-y2 line, #wf-chart-" +
        ko.unwrap(this.id) +
        " .c3 .c3-axis.c3-axis-y2 path { stroke: " +
        this.chartAxes()
          .y2()
          .color() +
        "} #wf-chart-" +
        ko.unwrap(this.id) +
        " .c3 .c3-axis.c3-axis-y2 text { fill: " +
        this.chartAxes()
          .y2()
          .color() +
        "}";

      return y1AxisStyles + " " + y2AxisStyles;
    }, this);

    this.data = ko.observableArray<KeyValuePair<number, any>>([]);
    this.hasData = ko.pureComputed(() => {
      // console.log("ccwChart hasData");
      // console.log(this.data() && this.timeStamps && this.timeStamps().length > 1);

      return this.data() && this.timeStamps && this.timeStamps().length > 1;
    });

    this.firstDisplayedDate = ko.pureComputed(() => {
      return this.hasData() ? this.timeStamps()[1] : this.startDate();
    });

    this.lastDisplayedDate = ko.pureComputed(() => {
      return this.hasData() ? _.last(this.timeStamps()) : this.endDate();
    });

    this.hasMorePoints = ko.observable(false);

    this.legendNames = ko.computed(() => {
      var self = this;
      var names = {} as KeyValuePair<string, string>;
      _.each(self.lines(), (line, index) => {
        names[self.getChartLineName(line, index)] = line.legendText();
      });
      return names;
    });

    this.lineTypes = ko.computed(() => {
      var self = this;
      var types = {} as KeyValuePair<string, string>;
      _.each(self.lines(), (line, index) => {
        types[self.getChartLineName(line, index)] = line.type();
      });
      return types;
    }, this);

    this.minValue = ko.computed(() => {
      var min = _.min(ko.unwrap(this.values));
      return _.isFinite(min) ? min : "-";
    });

    //Parameter "hide" lesen und in Array packen. Linie werden bei Init versteckt dargestellt. amueller 30.06.2020
    // this.getHideConfig = ko.computed(() => {
    //   var self = this;
    //   var hideConfig = [];
    //   _.each(self.lines(), (line, index) => {
    //     if ((line.hide() == true)) {
    //       hideConfig.push(self.getChartLineName(line, index));
    //     }
    //   });
    //   console.log("GetHideConfig()");
    //   console.log(hideConfig);
    //   // console.log(self.lines());

    //   return hideConfig;
    // }, this);



    this.c3Chart = ko.observable(this.getC3ChartObject());

    this.minValueTimestamp = ko.computed(() => {
      var timeStampIndex = _.indexOf(ko.unwrap(this.values), ko.unwrap(this.minValue));
      var timeStamp = this.timeStamps()[timeStampIndex];
      return timeStamp as Date;
    });

    this.maxValue = ko.computed(() => {
      var max = _.max(ko.unwrap(this.values));
      return _.isFinite(max) ? max : "-";
    });

    this.maxValueTimestamp = ko.computed(() => {
      var timeStampIndex = _.indexOf(ko.unwrap(this.values), ko.unwrap(this.maxValue));
      var timeStamp = this.timeStamps()[timeStampIndex];
      return timeStamp as Date;
    });

    this.averageValue = ko.computed(() => {
      var sum = 0;
      if (this.values().length === 0) {
        return "";
      }

      ko.utils.arrayForEach(this.values(), item => {
        if (!isNaN(item)) {
          sum += parseFloat(item);
        }
      });

      return sum / this.values().length;
    });

    //this.lines.subscribe(this.refreshChartData(), this);

    this.selectedLines = ko.observableArray<IChartLine>([]);
    this.isSignalLoading = ko.observable(false);

    this.isLoading = ko.observable(true);

    this.showHistoryManage = ko.computed(() => {
      return !this.autoUpdate() || this.isAutoUpdating();
    });

    //this.monitorIsTabVisible();//Workaround:A bag in c3 chart. Memory leak, when tab is inactive

    this.btnZoomZurueckEnable = ko.observable(false);

    this.btnZoomZurueckBackgColor = ko.observable("btn btn-default");

    this.overlayDivLeft = ko.observable('0px');
    this.overlayDivWidth = ko.observable('0px');
    this.overlayDivHeight = ko.observable((ko.unwrap(this.chartHeight()) - 60) + 'px');  //60px ist die Fläche für die X-Achse
    this.overlayDivTop = ko.observable('15px');

    this.onMouseOverLeft = 0;
    this.overlayDivClientX1 = ko.observable(0);
    this.overlayDivClientX2 = ko.observable(0);

    this.overlayDivShow = ko.observable(false);
    this.zoomZurueckArrayLen = ko.observable(0);

    this.startDateOld = new Date();
    this.endDateOld = new Date();

    //this.c3Chart = ko.observable(this.getC3ChartObject());

  }

  private monitorIsTabVisible() {
    // Set the name of the hidden property and the change event for visibility
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof (document as any).msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof (document as any).webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
      console.log(
        "This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API."
      );
    } else {
      // Handle page visibility change
      document.addEventListener(visibilityChange, () => {
        if (!this.autoUpdate()) return;

        if (document[hidden]) this.isAutoUpdating(true);
        // must stopp chart
        else this.isAutoUpdating(false); // must run chart

        this.handleAutoUpdate();
      });
    }
  }

  private toggleIsAutoUpdating() {
    this.isAutoUpdating(!this.isAutoUpdating());
    this.handleAutoUpdate();
  }

  protected async triggerRefreshChartData() {
    this.isLoading(true);
    this.zoomZurueckArray = []; //lösche Array
    this.zoomZurueckArrayLen(this.zoomZurueckArray.length);
    this.btnZoomZurueckEnable(false);
    this.btnZoomZurueckBackgColor("btn btn-default");
    // If getLatestLogdata property is set, then the endtimestamp will be set to "now"
    if (ko.unwrap(this.getLatestLogdata) === true) {
      this.startDate(
        moment()
          .subtract(this.startOffsetIntervall, this.startOffset)
          .toDate()
      );
      this.startDateInput(this.startDate());
      this.selectedRangeInput(CalendarTimeRanges.Custom);
      this.timeRangeDateInput(this.startDate());
      this.endDate(
        moment()
          .add(this.endOffsetIntervall, this.endOffset)
          .toDate()
      );
      this.endDateInput(this.endDate());
    }

    console.log("Trigger Refresh Data");

    await this.getSignalInformations();
    this.refreshChartData();
  }

  private async refreshChartData() {
    await this.getLogValues();
    this.handleAutoUpdate();
  }

  private handleAutoUpdate() {
    if (this.autoUpdate() && !this.isAutoUpdating()) {
      this.startDate(
        moment()
          .subtract(this.startOffsetIntervall, this.startOffset)
          .toDate()
      );
      this.endDate(
        moment()
          .add(this.endOffsetIntervall, this.endOffset)
          .toDate()
      );

      if (this.pollTimer) {
        clearTimeout(this.pollTimer);
      }

      this.pollTimer = setTimeout(() => {
        this.refreshChartData();
      }, this.updateRate);
    }
  }

  private async getSignalInformations(updateLegendText = undefined) {
    const aliases: string[] = [];
    const logTags: string[] = [];

    for (const line of this.lines()) {
      if (!line.logId || !line.unit() || updateLegendText) {
        aliases.push(line.signalName());
        logTags.push(line.logTagName());
      }
    }

    // if (!aliases.length) {
    //     this.isLoading(false);
    //     //return null;
    // }

    try {
      const definitions = await this.connector.getSignalDefinitions(aliases);
      for (const line of this.lines()) {
        const definition = _.find(definitions, (def: SignalDefinitionDTO) => {
          return line.signalName() === def.AliasName;
        }) as SignalDefinitionDTO;

        if (!definition) continue;

        line.signalId = definition.ID;

        if (line.staticLegendText() != null) {
          line.legendText(line.staticLegendText());
        } else {
          line.legendText(this.getLegendText(definition, line));
        }

        line.maxAxis(definition.Maximum);
        line.minAxis(definition.Minimum);

        if (line.staticUnitText() != null) {
          line.unit(line.staticUnitText());
        } else {
          line.unit(definition.Unit);
        }

        const definitionLog = _.find(definition.Logs, log => {
          return log.LogTag === line.logTagName();
        });

        line.logId = definitionLog ? definitionLog.ID : "";
        line.logTag = definitionLog ? definitionLog.LogTag : "";
      }

      //await this.getLogValues();
    } catch (error) {
      this.connector.handleError(WfChart1Component)(error);
    } finally {
      // this.isLoading(false);
      console.log("finally");
    }
  }

  private async getLogValues() {
    //return;
    const logIds: string[] = [];
    for (const line of this.lines()) {
      if (line && line.logId) {
        logIds.push(line.logId);
        // console.log(line.logId);
      }
    }
    // console.log("myLines");
    // console.log(this.lines());

    // console.log(logIds);
    if (logIds.length <= 0) {
      // alert("Das Chart hat keine gültigen Log-Signalnamen!");
      toastr.error("Das Chart hat keine gültigen Log-Signalnamen!");
    }

    const maxResults = Number(this.maxResults()) + 1;

    const filter = new ccwLogValuesFilter(
      logIds,
      moment(ko.unwrap(this.startDate)),
      moment(ko.unwrap(this.endDate)),
      maxResults,
      ko.unwrap(this.sortOrder),
      ko.unwrap(this.dbName),
      ko.unwrap(this.isI4Scada)
    );

    try {
      //-------- Anfage an SQL-Datenbank nach Min-Max-Average Werte ------------------------------------
      var urlMinMaxAvg = "/WsGetChart/WsLogValue.svc/js/ccwGetMinMaxAvg";
      const minMaxAvgObj: any = await HttpService.post(urlMinMaxAvg, filter);
      this.minMaxAvgValues = minMaxAvgObj.ccwGetMinMaxAvgResult.Values;
    } catch (error1) {
      this.connector.handleError(WfChart1Component)(error1);
    }

    try {
      // const logValues: any = logIds.length === 0 ? [] : await this.connector.getLogValues(filter);  //Variablen aus WF-DB lesen


      // console.log(filter);

      var url = "/WsGetChart/WsLogValue.svc/js/ccwGetLogValues";
      // var url = `/WsGetChart/WsRezept.svc/js/Eugen`;
      if (this.logsAlsDurchschnittswerte) {
        url = "/WsGetChart/WsLogValue.svc/js/ccwGetLogValuesAverage";  //Durchschnittswerte liefern
      }
      const logValuesObj: any = await HttpService.post(url, filter);
      const logValues = logValuesObj.ccwGetLogValuesResult.Values;
      // console.log(logValues);

      for (const line of this.lines()) {
        line.values = ko.observableArray([]);
      }
      //Werte hier schon vorhanden
      let tmpTimeStamps = [] as (string | Date)[];
      const values: CCWDatedLogValuesDTO[] = logValues; //deklariere die Variable values mit interface und kopiere die Ergebnisse in die Variable
      // this.hasMorePoints(logValues.length > this.maxResults());

      if (values.length <= 0) toastr.info("Keine Chart-Daten vorhanden!");

      for (const row of values) {

        tmpTimeStamps.push(new Date(row.EntriesDate));

        // die einzelnen Reihen abfragen
        for (let i = 0; i < row.Values.length; i++) {
          // wenn der Parameter "Signal-Faktor" angegeben wird, dann muss der Anzeigewert auf der Kurve neu berechnet werden
          if ((this.lines()[i].signalFactor() != null) && (row.Values[i] != null)) {
            row.Values[i] = row.Values[i] * ko.unwrap(this.lines()[i].signalFactor());
          }

          var logValueDto = row.Values[i] != null ? row.Values[i] : null;

          if (row.Values[i] != null) {
            // wenn in der Datenbank kein Wert gefunden wurde, wird die Zahl 1234567.89 übertragen. Dann den aktuellen Wert (Connector) anzeigen
            if (Number(logValueDto) == 1234567.89) {
              var signalNameFromLine = this.lines()[i].signalName();
              console.log("Wert von Index [" + i + "] ist 1234567.89 und der SignalName ist " + signalNameFromLine);
              // console.log(signalNameFromLine);
              // console.log(typeof signalNameFromLine);
              logValueDto = this.connector.getSignal(signalNameFromLine).value();
              var myv = logValueDto;
              // console.log(myv);
            }
          }

          this.lines()[i].values.push(logValueDto);
        }
      }

      if (this.showIsStaticColumn) {
        for (var i = 0; i < this.lines().length; i++) {
          if (ko.unwrap(!this.lines()[i].isStatic)) {
            this.lines()[i].values.unshift(null);
            this.lines()[i].values.push(null);
          }
        }
        try {
          await this.setStaticValues(this.lines(), ko.unwrap(this.startDate));
        } catch (error) {
          this.connector.handleError(WfChart1Component)(error);
        } finally {
          this.updateChartTimestamps(tmpTimeStamps);
        }
      } else {
        this.updateChartTimestamps(tmpTimeStamps);
      }
    } catch (error1) {
      this.connector.handleError(WfChart1Component)(error1);
    }
    // finally {
    //   console.log("isLoading=FALSE");
    // }


  }

  private updateChartTimestamps(tmpTimeStamps: (string | Date)[]) {
    if (this.showIsStaticColumn) {
      tmpTimeStamps.push(ko.unwrap(this.startDate));
      tmpTimeStamps.unshift(ko.unwrap(this.endDate));
    }

    this.timeStamps(tmpTimeStamps);
    this.timeAxisFormat(this.getTimeAxisFormat(this.timeStamps()));
    this.updateChartData();
  }

  private async setStaticValues(lines: IChartLine[], firstDate: Date) {
    const staticLines = lines.filter(line => {
      return line.isStatic();
    });

    if (!_.any(staticLines)) return;

    const filter = staticLines.map(line => {
      return {
        SignalID: line.signalId,
        LogTag: line.logTag
      };
    });

    const data = await this.connector.getLastValuesBeforeDate(filter, moment(firstDate));

    for (let i = 0; i < staticLines.length; i++) {
      let line = staticLines[i];
      let firstValue = data[i].Values[0].Value ? data[i].Values[0].Value : data[i].Values[0].Value2;
      line.values.push(firstValue);
      let lastValue = _.find(line.values(), num => {
        return num !== null;
      });
      line.values.unshift(lastValue);
    }
  }

  private updateChartData() {
    var self = this;
    // Add the X-Axis identifier as first item in timestamp array if it's hasn't been added already
    if (this.timeStamps()[0] !== "x") {
      this.timeStamps.unshift("x");
    }

    var newData = [];

    newData.push(this.timeStamps());

    var ccwMinMaxAvgValue = this.minMaxAvgValues;  //Variable zuweisen

    _.each(this.lines(), (line, index) => {
      var values = [self.getChartLineName(line, index)].concat(line.values());

      newData.push(values);
      var ccwMinMaxAvgIndexValues = ccwMinMaxAvgValue.length > 0 ? ccwMinMaxAvgValue[index] : null;

      this.updateLineValueDependencies(line, ccwMinMaxAvgIndexValues);  //Übergabe jetzt mit Array von den MIN-MAX-AVG-Werten
    });

    this.data(newData);
    this.refreshChartObject();
  }

  private generatedChartObject: any;

  private onSubchartZoomChanged = function (chart, domain) {
    this.generatedChartObject = chart;

    const zoomStart = moment(domain[0]);
    const zoomEnd = moment(domain[1]);

    const chartIntervalStart = moment(this.firstDisplayedDate()).add(this.updateRate, "milliseconds");
    const chartIntervalEnd = moment(this.lastDisplayedDate()).subtract(this.updateRate, "milliseconds");

    this.isChartZoomed(!zoomStart.isSameOrBefore(chartIntervalStart) || !zoomEnd.isSameOrAfter(chartIntervalEnd));

    if (this.isChartZoomed() && this.isRealTimeUpdating()) {
      this.isAutoUpdating(true);
    }

    if (!this.isChartZoomed() && this.autoUpdate()) {
      this.isAutoUpdating(false);
      this.handleAutoUpdate();
    }
  };

  public resetChartZoom = function () {
    if (this.generatedChartObject) {
      this.generatedChartObject.unzoom();
    }

    this.isChartZoomed(false);
  };

  private getTooltipContents = function (chartthis, d, defaultTitleFormat, defaultValueFormat, color) {
    var $$ = this;
    var config = $$.config ? $$.config : {};

    var titleFormat = config.tooltip_format_title || $$.timeAxisFormat() || defaultTitleFormat;
    var nameFormat =
      config.tooltip_format_name ||
      function (name) {
        return name;
      };
    var valueFormat = config.tooltip_format_value || defaultValueFormat;
    var text = "";
    var i;
    var title;
    var backgroundColor;
    var unit;
    var cssClass = $$.CLASS ? $$.CLASS : {};
    var tooltipHeader = cssClass.tooltip ? cssClass.tooltip : "c3-tooltip";
    var tooltipMainRow = cssClass.tooltipName ? cssClass.tooltipName : "";

    if (chartthis.length === 0) return "";

    for (i = 0; i < chartthis.length; i++) {
      var point = chartthis[i];
      var line = _.find($$.lines(), (line: IChartLine, index) => {
        return $$.getChartLineName(line, index) === point.id;
      });

      if (!line) continue;

      backgroundColor = ko.unwrap(line.color);

      if (line.staticUnitText() != null) {
        unit = line.staticUnitText();
      } else {
        unit = line.unit();
      }
      if (!text) {
        title = $$.getFormatedDateString(point.x, titleFormat);

        text =
          "<table class='" +
          tooltipHeader +
          "'>" +
          (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
      }

      text += $$.addTooltipRowInformation(
        point,
        tooltipMainRow,
        { name: point.name, value: $$.getFormatedValue(point.value, unit) },
        nameFormat,
        valueFormat,
        backgroundColor,
        5,
        true,
        true
      );
    }

    return text + "</table>";
  };

  private getFormatedDateString(date, timeFormat) {
    var formatedTimeFormat = d3.time.format(timeFormat);
    return formatedTimeFormat(moment(date).toDate());
  }

  private getFormatedValue(value, unit: string) {
    var displayValue = isNaN(value) || value === null ? "-" : parseFloat(value);
    return displayValue === "-" ? "-- " + unit : (window as any).numeral(displayValue).format(this.format) + " " + unit;
  }

  private addTooltipRowInformation(
    point,
    tooltipName,
    item,
    nameFormat,
    valueFormat,
    backgroundColor,
    leftPadding,
    showColorIndicator,
    showValue
  ) {
    var colorIndicator = "<span style='background-color:" + backgroundColor + "'> </span>";
    var rowText = "<tr class='" + tooltipName + "-" + point.id + "'>";
    rowText +=
      "<td class='name' style='padding-left:" +
      leftPadding +
      "px'>" +
      (showColorIndicator ? colorIndicator : "") +
      nameFormat(item.name) +
      "</td>";
    rowText += "<td class='value'>" + item.value + "</td>";
    rowText += "</tr>";

    return rowText;
  }

  private getTimeAxisFormat(timestamps) {
    // if Auto then adjust axis accordingly
    var value = "%H:%M:%S %d.%m.%Y";

    var minSeriesDate = _.first(timestamps);
    var startDate = moment(minSeriesDate || new Date());

    var maxSeriesDate = _.last(timestamps);
    var endDate = moment(maxSeriesDate || new Date());

    // HEY, HEY, HEY!!! Magic numbers ahead!! Do not change them,
    // unless your're realy sure of the consequences!!
    if (endDate.diff(startDate, "years", true) >= 4.85) {
      value = "%Y";
    } else if (endDate.diff(startDate, "months", true) >= 4.8) {
      value = "%m.%Y";
    } else if (endDate.diff(startDate, "days") >= 6) {
      value = "%d.%m.%Y";
    } else if (endDate.diff(startDate, "days") >= 2) {
      value = "%H:%M:%S %d.%m.%Y";
    }

    return value;
  }

  private updateLineValueDependencies(line, ccwMinMaxAvgValue: CCWGetMinMaxAvgValue) {
    let min;
    let max;
    let lastValue;
    let sum = 0;
    let minTimestamp;
    let maxTimestamp;
    let lastValueTimestamp;
    let avr;
    let avr2;

    var values = line.values() || [];
    var timestamps = this.timeStamps() || [];

    //therefore first value in values array sometimes is null
    var index = 0;
    for (var i = 0; i < values.length; i++)
      if (values[i] !== undefined && values[i] !== null) {
        index = i;
        break;
      }

    min = max = values[i];
    lastValue = values.length > 0 ? values[values.length - 1] : null;
    minTimestamp = maxTimestamp = timestamps[index + 1]; // therefore in timespan first value is 'x'. Look updateChartData
    lastValueTimestamp = timestamps.length > 0 ? timestamps[timestamps.length - 1] : null;

    // Falls ein ungültiges Ergebnis vorhanden/empfangen ist, dann die alte Auswertung nehmen
    if (ccwMinMaxAvgValue == null) {
      _.each(values, (value: number, index: number) => {
        if (value && value > max) {
          max = value;
          maxTimestamp = timestamps[index + 1]; // therefore in timespan first value is 'x'. Look updateChartData
        }

        if (value && value < min) {
          min = value;
          minTimestamp = timestamps[index + 1]; // therefore in timespan first value is 'x'. Look updateChartData
        }

        if (value) sum += value;

        avr = values.length > 0 ? sum / values.length : min;

      });
    } else {
      if ((ccwMinMaxAvgValue.Min != undefined) && (ccwMinMaxAvgValue.Min != null)) {
        min = ccwMinMaxAvgValue.Min.Value;
      }
      if ((ccwMinMaxAvgValue.Min != undefined) && (ccwMinMaxAvgValue.Min != null)) {
        minTimestamp = ccwMinMaxAvgValue.Min.Date;
      }
      if ((ccwMinMaxAvgValue.Max != undefined) && (ccwMinMaxAvgValue.Max != null)) {
        max = ccwMinMaxAvgValue.Max.Value;
      }
      if ((ccwMinMaxAvgValue.Max != undefined) && (ccwMinMaxAvgValue.Max.Date != null)) {
        maxTimestamp = ccwMinMaxAvgValue.Max.Date;
      }
      if ((ccwMinMaxAvgValue.Avg != undefined) && (ccwMinMaxAvgValue.Avg != null)) {
        avr2 = ccwMinMaxAvgValue.Avg;
      } else {
        avr2 = lastValue;
      }
      avr = values.length > 0 ? avr2 : min;

    }

    line.minimum(min);
    line.maximum(max);
    line.minimumTimestamp(minTimestamp);
    line.maximumTimestamp(maxTimestamp);
    line.average(avr);
    line.lastValue(lastValue);
    line.lastValueTimestamp(lastValueTimestamp);
  }

  private getLineWithPropertiesOrDefault(line: IChartLine, objectID) {
    var result = this.cloneChartLine(line);

    result.values = ko.observableArray(ko.unwrap(line.values) || []);
    result.unit = ko.observable(ko.unwrap(line.unit) || "-");

    result.signalName = ko.observable((ko.unwrap(line.signalName) || "").stringPlaceholderResolver(objectID));
    result.logTagName = ko.observable((ko.unwrap(line.logTagName) || "").stringPlaceholderResolver(objectID));
    result.axis = ko.observable(
      line.axis && ko.unwrap(line.axis) && ko.unwrap(line.axis).toLowerCase() === "y2" ? "y2" : "y1"
    );
    result.color = ko.observable(line.color ? ko.unwrap(line.color) : "#880000");
    result.type = ko.observable(ko.unwrap(line.type) || this.chartType()); //line, step, spline, bar, area, area-spline
    result.isStatic = ko.observable(ko.unwrap(line.isStatic) || false);

    result.logId = line.logId || "";
    result.legendText = ko.observable(ko.unwrap(line.legendText) || "");

    result.maxAxis = ko.observable(ko.unwrap(line.maxAxis) || null);
    result.minAxis = ko.observable(ko.unwrap(line.minAxis) || null);

    result.staticUnitText = ko.observable(ko.unwrap(line.staticUnitText) || null);
    result.staticLegendText = ko.observable(ko.unwrap(line.staticLegendText) || null);
    result.signalFactor = ko.observable(ko.unwrap(line.signalFactor) || null);
    result.hide = ko.observable(ko.unwrap(line.hide) || null);

    return result;
  }

  private getLegendText(definition, line) {
    const isStaticText =
      this.showIsStaticColumn && line.isStatic ? "(" + this.connector.translate("I4SCADA_is_Static")() + ")" : "";

    if (this.legendText === "DescriptionSymbolicText")
      return (this.connector.translate(definition[this.legendText])() || definition.AliasName) + " " + isStaticText;

    //Simple property of SignalDefinitionDTO
    if (this.legendText.indexOf(".") === -1)
      return (definition[this.legendText] || definition.AliasName) + " " + isStaticText;

    const options = this.legendText.split(".");
    let object = definition[options[0]];
    if (!object) return definition.AliasName + " " + isStaticText;

    if (_.isArray(object)) {
      //Logs, Array property of SignalDefinitionDTO
      if (options[0] !== "Logs") return "" + " " + isStaticText;

      const length = object.length;
      for (
        let j = 0;
        j < length;
        j++ //search by logtagname. For situation when signalnames are equal, but logtagnames are different
      )
        if (object[j]["LogTag"] === line.logTagName)
          return (object[j][options[1]] || definition.AliasName) + " " + isStaticText;
    }

    return (object = (object[options[1]] || definition.AliasName) + " " + isStaticText); //DTO property of SignalDefinitionDTO
  }

  //#region methods of dialogs
  private showSettings() {
    this.showDialog(true);

    this.timeRangeDateInput(this.startDate());
    this.selectedRangeInput(this.selectedRange());

    this.startDateInput(this.startDate());
    this.endDateInput(this.endDate());
    this.maxResultsInput(this.maxResults());

    this.x1AxisLabelInput(
      this.chartAxes()
        .x()
        .label()
    );

    this.y1AxisLabelInput(
      this.chartAxes()
        .y1()
        .label()
    );
    this.y1AxisMinValueInput(
      this.chartAxes()
        .y1()
        .minValue()
    );
    this.y1AxisMaxValueInput(
      this.chartAxes()
        .y1()
        .maxValue()
    );
    this.y1AxisMinIsSignalDependentInput(
      this.chartAxes()
        .y1()
        .isMinSignalDependent()
    );
    this.y1AxisMaxIsSignalDependentInput(
      this.chartAxes()
        .y1()
        .isMaxSignalDependent()
    );

    this.y2AxisLabelInput(
      this.chartAxes()
        .y2()
        .label()
    );
    this.y2AxisMinValueInput(
      this.chartAxes()
        .y2()
        .minValue()
    );
    this.y2AxisMaxValueInput(
      this.chartAxes()
        .y2()
        .maxValue()
    );
    this.y2AxisMinIsSignalDependentInput(
      this.chartAxes()
        .y2()
        .isMinSignalDependent()
    );
    this.y2AxisMaxIsSignalDependentInput(
      this.chartAxes()
        .y2()
        .isMaxSignalDependent()
    );
  }

  private async applyFilterSettings() {
    console.log("begining :" + new Date().getTime());
    this.isLoading(true);
    this.closeSettings();
    this.zoomZurueckArray = []; //lösche Array
    this.zoomZurueckArrayLen(this.zoomZurueckArray.length);
    this.btnZoomZurueckEnable(false);
    this.btnZoomZurueckBackgColor("btn btn-default");

    console.log("closeSettings :" + new Date().getTime());
    this.selectedRange(this.selectedRangeInput());
    this.applySettingsInner(this.startDateInput(), this.endDateInput(), this.maxResultsInput());
    console.log("applySettingsInner :" + new Date().getTime());
    this.chartAxes()
      .x()
      .label(this.x1AxisLabelInput());

    this.chartAxes()
      .y1()
      .label(this.y1AxisLabelInput());
    this.chartAxes()
      .y1()
      .minValue(this.y1AxisMinValueInput());
    this.chartAxes()
      .y1()
      .maxValue(this.y1AxisMaxValueInput());
    this.chartAxes()
      .y1()
      .isMinSignalDependent(this.y1AxisMinIsSignalDependentInput());
    this.chartAxes()
      .y1()
      .isMaxSignalDependent(this.y1AxisMaxIsSignalDependentInput());

    this.chartAxes()
      .y2()
      .label(this.y2AxisLabelInput());
    this.chartAxes()
      .y2()
      .minValue(this.y2AxisMinValueInput());
    this.chartAxes()
      .y2()
      .maxValue(this.y2AxisMaxValueInput());
    this.chartAxes()
      .y2()
      .isMinSignalDependent(this.y2AxisMinIsSignalDependentInput());
    this.chartAxes()
      .y2()
      .isMaxSignalDependent(this.y2AxisMaxIsSignalDependentInput());

    console.log("axes :" + new Date().getTime());
    await this.getSignalInformations();
    console.log("getSignalInformations :" + new Date().getTime());
    await this.getLogValues();
    console.log("getLogValues :" + new Date().getTime());
  }

  private applySettingsInner(startDate, endDate, maxResult) {
    this.startDate(startDate);
    this.endDate(endDate);
    this.maxResults(maxResult);

    let diff = moment(this.endDate()).diff(this.startDate()) / 1000; //Diiferenz in Sekunden
    // console.log("SettingsChart");
    // console.log(diff);

    // .subtract(this.startOffsetIntervall, this.startOffset).subtract(this.endOffsetIntervall, this.endOffset).toDate()
    let startOff = "minutes";
    // if (diff > 43200){ //Über 12 Stunden
    //     startOff = "days";
    // }
    let startOffInt = 1;
    if (diff > 60) {
      startOffInt = diff / 60 + 1;
    }

    this.startOffsetIntervall = startOffInt;
    this.startOffset = startOff;
  }

  private applyAxesSettingsFromConfiguration(content: any): void {
    this.applyAxeSettingsFromConfiguration(content.axes.x as IAxisConfigration, this.chartAxes().x());
    this.applyAxeSettingsFromConfiguration(content.axes.y1 as IAxisConfigration, this.chartAxes().y1());
    this.applyAxeSettingsFromConfiguration(content.axes.y2 as IAxisConfigration, this.chartAxes().y2());
  }

  private applyAxeSettingsFromConfiguration(content: IAxisConfigration, axe: ObservableAxisConfigration): void {
    if (!content || !axe) return;

    axe.maxValue(content.maxValue);
    axe.isMaxSignalDependent(content.isMaxSignalDependent);
    axe.minValue(content.minValue);
    axe.isMinSignalDependent(content.isMinSignalDependent);
    axe.label(content.label);
    axe.color(content.color);
    axe.visible(content.visible);
    axe.isDisplayedInner(content.isDisplayedInner);
    axe.tickCount(content.tickCount);
    axe.tickFormat(content.tickFormat);
    axe.isGridVisible(content.isGridVisible);
  }

  private closeSettings() {
    this.showDialog(false);
  }

  private showSignalsSettings() {
    this.showSignalsDialog(true);

    this.selectedLines(_.map(this.lines(), line => this.cloneChartLine(line)));
  }

  private applySignalsSettings() {
    this.closeSignalSettings();
    return this.applySignalsSettingsInner(this.selectedLines());
  }

  private async applySignalsSettingsInner(lines) {
    var tempLines = [];

    if (lines.length > 0) {
      for (var i = 0; i < lines.length; i++)
        if (ko.unwrap(lines[i].signalName) && ko.unwrap(lines[i].logTagName))
          tempLines.push(this.getLineWithPropertiesOrDefault(lines[i], this.objectID));
    }

    if (tempLines.length === 0) this.timeStamps([]); //have to nothing show

    if (this.autoUpdate()) {
      if (tempLines.length === 0) this.isAutoUpdating(true);
      else this.isAutoUpdating(false);
    }

    this.setLines(tempLines);

    await this.getSignalInformations();
    await this.refreshChartData();
  }

  private setLines(lines: IChartLine[]) {
    this.lines(lines);

    this.refreshChartObject();
  }

  private closeSignalSettings() {
    this.showSignalsDialog(false);
  }
  //#endregion

  private getConfig() {
    var content = {
      lines: _.map(this.lines(), line => this.createChartLineForConfiguration(line)),
      startDate: moment(this.startDate()).toMSDate(),
      endDate: moment(this.endDate()).toMSDate(),
      maxResults: this.maxResults(),
      autoUpdate: this.autoUpdate(),
      axes: {
        x: this.getAxisConfiguration(this.chartAxes().x()),
        y1: this.getAxisConfiguration(this.chartAxes().y1()),
        y2: this.getAxisConfiguration(this.chartAxes().y2())
      },
      title: this.title()
    };

    return content;
  }

  private getAxisConfiguration(axe: ObservableAxisConfigration): IAxisConfigration {
    if (!axe) return {} as IAxisConfigration;

    return {
      maxValue: axe.maxValue(),
      isMaxSignalDependent: axe.isMaxSignalDependent(),
      minValue: axe.minValue(),
      isMinSignalDependent: axe.isMinSignalDependent(),
      label: axe.label(),
      color: axe.color(),
      visible: axe.visible(),
      isDisplayedInner: axe.isDisplayedInner(),
      tickCount: axe.tickCount(),
      tickFormat: axe.tickFormat(),
      isGridVisible: axe.isGridVisible()
    } as IAxisConfigration;
  }

  private async loadConfig(content: any) {
    this.title(content.title);
    if (content.autoUpdate !== undefined) this.autoUpdate(content.autoUpdate);

    this.applySettingsInner(moment(content.startDate).toDate(), moment(content.endDate).toDate(), content.maxResults);
    this.applyAxesSettingsFromConfiguration(content);
    const availableLines = await this.checkAvailabillityOfLines(
      _.map(content.lines, line => this.createChartLineFromConfiguration(line))
    );
    this.applySignalsSettingsInner(availableLines);
  }

  private moveTimeRangeBack() {
    this.endDate(this.startDate());
    this.startDate(
      moment(this.startDate())
        .subtract(this.startOffsetIntervall, this.startOffset)
        .subtract(this.endOffsetIntervall, this.endOffset)
        .toDate()
    );

    this.refreshChartData();
  }

  private moveTimeRangeVorward() {
    this.startDate(this.endDate());
    this.endDate(
      moment(this.endDate())
        .add(this.startOffsetIntervall, this.startOffset)
        .add(this.endOffsetIntervall, this.endOffset)
        .toDate()
    );

    this.refreshChartData();
  }

  private async loadInitialConfiguration() {
    try {
      const config = await this.connector.getControlConfigurationsByName(
        this.initialConfiguration,
        this.configurationNamespace,
        this.controlType
      );
      if (config) {
        let configuration = this.standaloneParametersReplacementService.replaceConfigurationParameters(config.Content);
        this.loadConfig(JSON.parse(configuration));
      } else {
        const settingLines = _.map(this.settings.lines || [], line => this.createObservableChartLine(line));
        const availableLines = await this.checkAvailabillityOfLines(settingLines);

        const lines = _.map(availableLines, line => {
          return this.getLineWithPropertiesOrDefault(line, this.objectID);
        });
        this.setLines(lines);
        this.triggerRefreshChartData();
      }
    } catch (error) {
      this.connector.handleError(WfChart1Component)(error);
    }
  }

  private handleExport() {
    var csvFile = this.convertCsvService.convertChartData(this.data() as any);
    if (csvFile == null) return;

    this.convertCsvService.download();
  }

  private showSubChart() {
    // alert("Hallo");
    this.activeSubchart(true);
    this.subChartConfig({ show: this.activeSubchart(), size: { height: 80 } });
    console.log(this.subChartConfig().show);
    this.refreshChartObject();

    // show: ko.unwrap(this.settings.subChartVisible) !== undefined ? ko.unwrap(this.settings.subChartVisible) : true,
    // this.activeSubchart(
    //   ko.unwrap(this.settings.subChartVisible) !== undefined ? ko.unwrap(this.settings.subChartVisible) : false
    // );
    // this.subChartConfig = ko.observable({
    //   show: this.activeSubchart(),
    //   size: {
    //     height: ko.unwrap(this.settings.subChartHeight) || 50
    //   },
    //   onbrush: function(domain) {
    //     self.onSubchartZoomChanged(this, domain);
    //   }
    // });


  }

  protected async checkAvailabillityOfLines(lines: IChartLine[]) {
    const signalNames = _.map(lines, line => line.signalName());

    if (!lines.length) return [];

    const definitions = await this.connector.getSignalDefinitions(signalNames);

    const result: IChartLine[] = [];

    for (let line of lines) {
      const definition = _.findWhere(definitions, { AliasName: line.signalName() }) as SignalDefinitionDTO;

      if (!definition || !definition.Active) continue;

      var hasLogTag = _.any(definition.Logs, log => log && log.Active && log.LogTag === line.logTagName());

      if (hasLogTag) {
        result.push(line);
      }
    }

    return result;
  }

  protected async dispose() {
    await super.dispose();
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }

    //clear dialogs
    var signalSettingsDialog = $(document).find("#modal-signal-settings-" + ko.unwrap(this.id));
    var signalSettingsBackContainer = $(document).find("#modal-signal-settings-back-container-" + ko.unwrap(this.id));

    var settingsDialog = $(document).find("#modal-settings-" + ko.unwrap(this.id));
    var settingsBackContainer = $(document).find("#modal-settings-back-container-" + ko.unwrap(this.id));

    signalSettingsDialog.remove();
    signalSettingsBackContainer.remove();
    settingsDialog.remove();
    settingsBackContainer.remove();

    //clear colorpicker
    $(document)
      .find("body")
      .children(".colorpicker.dropdown-menu")
      .remove();
  }

  private initializeObservables(): void {
    this.chartAxes = ko.observable<ObservableChartAxesConfiguration>(new ObservableChartAxesConfiguration());
    this.chartAxes().x = ko.observable<ObservableAxisConfigration>(new ObservableAxisConfigration());
    this.chartAxes().y1 = ko.observable<ObservableAxisConfigration>(new ObservableAxisConfigration());
    this.chartAxes().y2 = ko.observable<ObservableAxisConfigration>(new ObservableAxisConfigration());
  }

  private initializeAxesConfigurationFromSettigs(settings: ICcwWfChart1Params): void {
    this.chartAxes()
      .x()
      .visible(this.settings.x1AxisVisible !== undefined ? ko.unwrap(this.settings.x1AxisVisible) : true);
    this.chartAxes()
      .x()
      .label(ko.unwrap(this.settings.x1AxisLabel) || "");
    this.chartAxes()
      .x()
      .tickFormat(ko.unwrap(this.settings.x1AxisTickFormat) || "%H:%M:%S %d.%m.%Y");
    this.chartAxes()
      .x()
      .tickCount(ko.unwrap(this.settings.x1TickCount) || 10);
    this.chartAxes()
      .x()
      .isGridVisible(this.settings.x1GridVisible !== undefined ? ko.unwrap(this.settings.x1GridVisible) : false);

    this.chartAxes()
      .y1()
      .visible(this.settings.y1AxisVisible !== undefined ? ko.unwrap(this.settings.y1AxisVisible) : true);
    this.chartAxes()
      .y1()
      .label(ko.unwrap(this.settings.y1AxisLabel) || "");
    this.chartAxes()
      .y1()
      .color(ko.unwrap(this.settings.y1AxisColor) || "#000000");
    this.chartAxes()
      .y1()
      .isDisplayedInner(this.settings.y1AxisInner !== undefined ? ko.unwrap(this.settings.y1AxisInner) : false);
    this.chartAxes()
      .y1()
      .tickFormat(this.settings.y1TickFormat);
    this.chartAxes()
      .y1()
      .tickCount(ko.unwrap(this.settings.y1TickCount) || null);
    this.chartAxes()
      .y1()
      .isGridVisible(this.settings.y1GridVisible !== undefined ? ko.unwrap(this.settings.y1GridVisible) : false);
    this.chartAxes()
      .y1()
      .maxValue(ko.unwrap(this.settings.y1AxisMax) || null);
    this.chartAxes()
      .y1()
      .isMaxSignalDependent(
        this.settings.y1AxisMaxSignal !== undefined ? ko.unwrap(this.settings.y1AxisMaxSignal) : false
      );
    this.chartAxes()
      .y1()
      .minValue(ko.unwrap(this.settings.y1AxisMin) || null);
    this.chartAxes()
      .y1()
      .isMinSignalDependent(
        this.settings.y1AxisMinSignal !== undefined ? ko.unwrap(this.settings.y1AxisMinSignal) : false
      );

    this.chartAxes()
      .y2()
      .visible(this.settings.y2AxisVisible !== undefined ? ko.unwrap(this.settings.y2AxisVisible) : true);
    this.chartAxes()
      .y2()
      .label(ko.unwrap(this.settings.y2AxisLabel) || "");
    this.chartAxes()
      .y2()
      .color(ko.unwrap(this.settings.y2AxisColor) || "#880000");
    this.chartAxes()
      .y2()
      .isDisplayedInner(this.settings.y2AxisInner !== undefined ? ko.unwrap(this.settings.y2AxisInner) : false);
    this.chartAxes()
      .y2()
      .tickFormat(this.settings.y2TickFormat);
    this.chartAxes()
      .y2()
      .tickCount(ko.unwrap(this.settings.y2TickCount) || null);
    //this.chartAxes().y2().isGridVisible(ko.unwrap(this.settings.y2GridVisible) || false);
    this.chartAxes()
      .y2()
      .maxValue(ko.unwrap(this.settings.y2AxisMax) || null);
    this.chartAxes()
      .y2()
      .isMaxSignalDependent(
        this.settings.y2AxisMaxSignal !== undefined ? ko.unwrap(this.settings.y2AxisMaxSignal) : false
      );
    this.chartAxes()
      .y2()
      .minValue(ko.unwrap(this.settings.y2AxisMin) || null);
    this.chartAxes()
      .y2()
      .isMinSignalDependent(
        this.settings.y2AxisMinSignal !== undefined ? ko.unwrap(this.settings.y2AxisMinSignal) : false
      );
  }

  private getChartLineName(line: IChartLine, index: number): string {
    if (!line) {
      return "";
    }

    return index + "_" + ko.unwrap(line.signalName);
  }

  private createObservableChartLine(line: IWfChart1Line): IChartLine {
    if (!line) return null;

    const result = {} as IChartLine;

    result.signalName = ko.observable(line.signalName);
    result.logTagName = ko.observable(line.logTagName);
    result.axis = ko.observable(line.axis);
    result.color = ko.observable(line.color);
    result.type = ko.observable(line.type);
    result.staticUnitText = ko.observable(line.staticUnitText);
    result.signalFactor = ko.observable(line.signalFactor);
    result.staticLegendText = ko.observable(line.staticLegendText);
    result.hide = ko.observable(line.hide);
    return result;
  }

  private cloneChartLine(line: IChartLine): IChartLine {
    if (!line) return null;

    var result = {} as IChartLine;

    result.signalName = ko.observable(ko.unwrap(line.signalName));
    result.logTagName = ko.observable(ko.unwrap(line.logTagName));
    result.axis = ko.observable(ko.unwrap(line.axis));
    result.color = ko.observable(ko.unwrap(line.color));
    result.unit = ko.observable(ko.unwrap(line.unit));
    result.maxAxis = ko.observable(ko.unwrap(line.maxAxis));
    result.minAxis = ko.observable(ko.unwrap(line.minAxis));
    result.legendText = ko.observable(ko.unwrap(line.legendText));
    result.values = ko.observableArray(ko.unwrap(line.values) || []);
    result.minimum = ko.observable(ko.unwrap(line.minimum));
    result.maximum = ko.observable(ko.unwrap(line.maximum));
    result.average = ko.observable(ko.unwrap(line.average));
    result.lastValue = ko.observable(ko.unwrap(line.lastValue));
    result.minimumTimestamp = ko.observable(ko.unwrap(line.minimumTimestamp));
    result.maximumTimestamp = ko.observable(ko.unwrap(line.maximumTimestamp));
    result.lastValueTimestamp = ko.observable(ko.unwrap(line.lastValueTimestamp));
    result.type = ko.observable(ko.unwrap(line.type));
    result.isStatic = ko.observable(ko.unwrap(line.isStatic));

    result.logId = line.logId;
    result.signalId = line.signalId;
    result.logTag = line.logTag;

    result.staticUnitText = ko.observable(ko.unwrap(line.staticUnitText));
    result.signalFactor = ko.observable(ko.unwrap(line.signalFactor));
    result.staticLegendText = ko.observable(ko.unwrap(line.staticLegendText));
    result.hide = ko.observable(ko.unwrap(line.hide));

    return result;
  }

  private createChartLineFromConfiguration(configLineModel: any): IChartLine {
    var result = {} as IChartLine;

    result.signalName = ko.observable(configLineModel.signalName);
    result.logTagName = ko.observable(configLineModel.logTagName);
    result.color = ko.observable(configLineModel.color);
    result.axis = ko.observable(configLineModel.axis);
    result.type = ko.observable(configLineModel.type);
    result.isStatic = ko.observable(configLineModel.isStatic);
    result.staticUnitText = ko.observable(configLineModel.staticUnitText);
    result.signalFactor = ko.observable(configLineModel.signalFactor);
    result.staticLegendText = ko.observable(configLineModel.staticLegendText);
    result.hide = ko.observable(configLineModel.hide);

    return result;
  }

  private createChartLineForConfiguration(line: IChartLine): any {

    return {
      signalName: ko.unwrap(line.signalName),
      logTagName: ko.unwrap(line.logTagName),
      color: ko.unwrap(line.color),
      axis: ko.unwrap(line.axis),
      type: ko.unwrap(line.type),
      isStatic: ko.unwrap(line.isStatic),
      staticUnitText: ko.unwrap(line.staticUnitText),
      signalFactor: ko.unwrap(line.signalFactor),
      staticLegendText: ko.unwrap(line.staticLegendText),
      hide: ko.unwrap(line.hide)
    };
  }

  private refreshChartObject = _.debounce(async () => {
    this.setChartObject();
  }, 200);

  private getHideConfig(): any {
    //diese Funktion wird im Takt aufgerufen, die Linien aber nur bei Initialisierung auf HIDE gestellt, damit später per Mausclick die Linie wieder sichtbar wird. 
    var self = this;
    var hideConfig = [];
    if (!this.getHideConfigInit) {
      _.each(self.lines(), (line, index) => {
        if ((line.hide() == true)) {
          hideConfig.push(self.getChartLineName(line, index));
        }
      });
      this.getHideConfigInit = true;
    }
    // console.log("GetHideConfig()");
    // console.log(hideConfig);
    // console.log(self.lines());
    return hideConfig;
  };

  private getC3ChartObject(): any {
    return {
      x: "x",
      columns: this.data(),
      type: this.chartType(),
      axes: this.axes(),
      colors: this.axisesColor(),
      range: { max: this.maxValueForAxises(), min: this.minValueForAxises() },
      showY: this.showFirstAxis(),
      showY2: this.showSecondAxis(),
      names: this.legendNames(),
      types: this.lineTypes(),
      axisLabels: this.axisLabels(),
      hide: this.getHideConfig()
    };
  }

  private setChartObject(): void {
    const value = this.getC3ChartObject();
    //gets trigger twice if a new signal is added (once when the configuration is applied and the second when we actually have values)
    //console.log("c3chart object set: " + new Date().getTime());
    this.c3Chart(value);
  }

  protected async triggerRefreshChartData2() {
    this.isLoading(true);
    // console.log("Trigger Refresh Data");
    // If getLatestLogdata property is set, then the endtimestamp will be set to "now"
    if (ko.unwrap(this.getLatestLogdata) === true) {
      // this.startDate(moment().subtract(this.startOffsetIntervall, this.startOffset).toDate());
      this.startDateInput(this.startDate());
      // this.selectedRangeInput(CalendarTimeRanges.Custom);
      // this.timeRangeDateInput(this.startDate());
      // this.endDate(moment().add(this.endOffsetIntervall, this.endOffset).toDate());
      this.endDateInput(this.endDate());
    }


    await this.getSignalInformations();
    this.refreshChartData();
  }

  private onMouseDownFunc(value, index): void {
    console.log("OnMouseDownFunc");
    // console.log(this);

    // var elem: IZoomDTO = {
    //   //Elem erzeugen
    //   startDate: this.startDate(),
    //   endDate: this.endDate()
    // };
    // this.zoomZurueckArray.push(elem);
    // console.log(this.zoomZurueckArray);

    this.startDateOld = this.startDate();
    this.endDateOld = this.endDate();


    // console.log(value);
    let startTime = value.x;
    // console.log(startTime);
    // console.log(typeof startTime);

    this.startDate(startTime);

    // console.log(index);
    this.overlayDivWidth('0px');
    this.overlayDivShow(true);

  }

  private onMouseUpFunc(value): void {
    console.log("OnMouseUpFunc");
    // console.log(this);

    // console.log(value);
    let endTime = value.x;
    // console.log(endTime);
    this.endDate(endTime);

    this.btnZoomZurueckEnable(true);
    this.btnZoomZurueckBackgColor("btn btn-primary");
    // this.overlayDivLeft(this.overlayDivClientX1() + 'px');
    // var diffWidth = this.overlayDivClientX2() - this.overlayDivClientX1();
    // console.log('%cDiv-Width(): ' + diffWidth, 'background-color:yellow');

    // this.overlayDivWidth(diffWidth + 'px');
    this.overlayDivTop('15px');
    var time1 = this.startDate();
    var time2 = this.endDate();

    var diffSek = (time2.getTime() - time1.getTime()) / 1000;
    console.log('%cDiff Time: ' + diffSek, 'background-color:yellow');
    if (diffSek >= 10) {

      var elem: IZoomDTO = {
        //Elem erzeugen
        startDate: this.startDateOld,
        endDate: this.endDateOld
      };
      this.zoomZurueckArray.push(elem);

      this.triggerRefreshChartData2();
    }
    this.zoomZurueckArrayLen(this.zoomZurueckArray.length);

    // wenn gezoomt wird, dann das automatische Aktualisieren ausschalten
    if (this.zoomZurueckArray.length > 0) {
      this.autoUpdate(false);
    }

    this.overlayDivShow(false);
  }

  private onMouseRightClick(e, data, event) {

  }
  private zoomZurueck() {
    // console.log("Zoom-Zurueck");

    var lastIndex = this.zoomZurueckArray.length - 1;
    // console.log(lastIndex);

    var startTime = this.zoomZurueckArray[lastIndex].startDate;
    var endTime = this.zoomZurueckArray[lastIndex].endDate;
    // console.log(startTime);
    // console.log(endTime);
    this.zoomZurueckArray.pop(); //lösche letztes Index

    // console.log(this.zoomZurueckArray.length);
    if (this.zoomZurueckArray.length <= 0) {
      this.btnZoomZurueckEnable(false);
      this.btnZoomZurueckBackgColor("btn btn-default");

    }
    this.startDate(startTime);
    this.endDate(endTime);
    this.zoomZurueckArrayLen(this.zoomZurueckArray.length);
    this.triggerRefreshChartData2();

    // wenn gezoomt wird, dann das automatische Aktualisieren ausschalten
    if (this.zoomZurueckArray.length == 0) {
      this.autoUpdate(ko.unwrap(this.settings.autoUpdate) ? ko.unwrap(this.settings.autoUpdate) : false);
    }
  }

  // wird von der internen HTML-Seite aufgerufen
  // Hier werden Ereignisse ermittelt und einer Funktion zugewiesen
  private onRendered() {
    var self = this;
    //console.log("onRendered");
    this.isLoading(false);
    // Das Chart muss eindeutig sein, deshalb ist hier eine Css-Klasse erfunden, welche eindeutig zum Chart parametriert ist.
    // Die KLasse .c3-event-rect gehört zum D3-Chart
    var myClassAndId = '.' + this.chartId + ' .c3-event-rect';

    d3.selectAll(myClassAndId)
      .on('mousedown', function (value, index) {
        self.onMouseDownFunc(value, index);
      })
      .on('mouseup', function (value, index) {
        self.onMouseUpFunc(value);
      });
  }

  private onClickEvent() {
    console.log("onClickEvent");

  }

  private onMouseOverEvent(e) {
  }

  private onMouseDownEventFromDiv(data, e) {
  }

  private onMouseUpEventFromDiv(data, e) {
    this.overlayDivShow(false);
    // console.log('%cMouseUp(): ', 'background-color:yellow');
  }



  private onMouseMoveEventFromDiv(data, e) {
    // Linke Maustaste gedrückt
    if (typeof e === 'object') {
      if (e.originalEvent.button === 0) {
        var left = this.onMouseOverLeft;//  e.offsetX + 15; // funktioniert im Firefox nicht

        if (!this.overlayDivShow()) {
          this.overlayDivClientX1(left);
          this.overlayDivClientX2(left);

          this.overlayDivLeft(this.overlayDivClientX1() + 'px');
          // this.overlayDivShow(true);
          // console.log('%cMouseMove() Start: ' + left, 'background-color:orange');
        }
        if (this.overlayDivShow()) {
          this.overlayDivClientX2(left);

          // console.log('%cMouseMove(): ' + left, 'background-color:yellow');
          var diffWidth = this.overlayDivClientX2() - this.overlayDivClientX1();
          // console.log('%cDiv-Width(): ' + diffWidth, 'background-color:yellow');
          this.overlayDivWidth(diffWidth + 'px');
        }
      }
    }
  }

  // Funktion zum registrieren der Kurven-Signale, damit mit dem Connector der aktuelle Wert ausgelesen werden kann
  private initSignalNamen(params) {
    var myL = params.lines;
    for (var index = 0; index < myL.length; index++) {
      var sigName = myL[index].signalName;
      var wert = this.connector.getSignal(sigName);
    }
  }

  private setStatisticsVisibility() {
    // negieren der Variablen
    this.statisticsVisibilityIntern(ko.unwrap(!this.statisticsVisibilityIntern()));
  }

  private getTooltipPosition(data, width, height, element) {
    var $$ = this;
    var erg = null;
    var chartIdHtml = "#wf-chart-" + ko.unwrap($$.id);

    $$.onMouseOverLeft = parseInt(element.getAttribute('x')) + parseInt(element.getAttribute('width')) + 70;

    // Das Tooltip - Fenster verschieben
    if ((ko.unwrap($$.tooltipPosition) == "top-left") || (ko.unwrap($$.tooltipPosition) == "top-middle") || (ko.unwrap($$.tooltipPosition) == "top-right") || (ko.unwrap($$.tooltipPosition) == "bottom-left") || (ko.unwrap($$.tooltipPosition) == "bottom-middle") || (ko.unwrap($$.tooltipPosition) == "bottom-right")) {
      var chartIdHtml = "#wf-chart-" + ko.unwrap($$.id);
      var left2 = $$.onMouseOverLeft;//e.offsetX + 15;
      var left3 = 80;
      var breiteTooltipContainer = parseInt($(chartIdHtml + " .c3-tooltip-container").css("width"));
      var breiteChart = $(chartIdHtml + " .wf-chart-wrapper").width();
      var top1 = 0;
      // Tooltip - Fenster verschieben nach rechten Rand, wenn Maus auf der linken Seite ist
      if ((ko.unwrap($$.tooltipPosition) == "top-left")) {
        if ((left2) < (70 + breiteTooltipContainer + 50)) {  //70 ist auf der Höhe von der Y1-Achse; 50 noch nach rechts
          var newLeft = this.showSecondAxis() ? (breiteChart - breiteTooltipContainer - 70) : (breiteChart - breiteTooltipContainer - 30);
          left3 = newLeft;
        }
      }
      // Tooltip - Fenster verschieben nach linken Rand, wenn Maus auf der rechten Seite ist
      if ((ko.unwrap($$.tooltipPosition) == "top-right")) {
        if ((left2) > (breiteChart - breiteTooltipContainer - 50)) {
          var newRight = 70;
          left3 = newRight;
        } else {
          left3 = ($(chartIdHtml + " .wf-chart-wrapper").width() - $(chartIdHtml + " .c3-tooltip-container").width() - 20);
        }
      }
      // Tooltip - Fenster verschieben nach linken Rand, wenn Maus in der Mitte ist
      if ((ko.unwrap($$.tooltipPosition) == "top-middle")) {
        if (((left2) > ((breiteChart / 2) - (breiteTooltipContainer / 2) - 10)) && ((left2) < ((breiteChart / 2) + (breiteTooltipContainer / 2) + 20))) {
          var newMiddle = 70;
          left3 = newMiddle;
        } else {
          left3 = ($(chartIdHtml + " .wf-chart-wrapper").width() / 2) - ($(chartIdHtml + " .c3-tooltip-container").width() / 2) - 10;
        }
      }
      // Tooltip - Fenster verschieben nach rechten Rand, wenn Maus auf der linken Seite ist
      if ((ko.unwrap($$.tooltipPosition) == "bottom-left")) {
        if ((left2) < (70 + breiteTooltipContainer + 50)) {  //70 ist auf der Höhe von der Y1-Achse; 50 noch nach rechts
          var newLeft = this.showSecondAxis() ? (breiteChart - breiteTooltipContainer - 70) : (breiteChart - breiteTooltipContainer - 30);
          left3 = newLeft;
          top1 = $$.chartHeight();
        } else {
          top1 = $$.chartHeight();
        }
      }
      // Tooltip - Fenster verschieben nach linken Rand, wenn Maus auf der rechten Seite ist
      if ((ko.unwrap($$.tooltipPosition) == "bottom-right")) {
        if ((left2) > (breiteChart - breiteTooltipContainer - 50)) {
          var newRight = 70;
          left3 = newRight;
          top1 = $$.chartHeight();
        } else {
          left3 = ($(chartIdHtml + " .wf-chart-wrapper").width() - $(chartIdHtml + " .c3-tooltip-container").width() - 30);
          top1 = $$.chartHeight();
        }
      }
      // Tooltip - Fenster verschieben nach linken Rand, wenn Maus in der Mitte ist
      if ((ko.unwrap($$.tooltipPosition) == "bottom-middle")) {
        if (((left2) > ((breiteChart / 2) - (breiteTooltipContainer / 2) - 10)) && ((left2) < ((breiteChart / 2) + (breiteTooltipContainer / 2) + 20))) {
          var newMiddle = 70;
          left3 = newMiddle;
          top1 = $$.chartHeight();
        } else {
          left3 = (($(chartIdHtml + " .wf-chart-wrapper").width() / 2) - ($(chartIdHtml + " .c3-tooltip-container").width() / 2) - 10);
          top1 = $$.chartHeight();
        }
      }

      return { top: top1, left: left3 };
    }
    return { top: 10, left: $$.onMouseOverLeft + 10 }; //sonst leeres Objekt zurückgeben
  };

  // wird von aussen aufgerufen
  private showVersionen() {
    var self = this;
    $('#' + self.versionenChartId()).mouseleave(function () {
      $('#' + self.versionenChartId()).popover('hide');
    });
    $('#' + self.versionenChartId()).popover('show');
  }

  //Click auf Legende, muss noch per Item freigegeben werden, jetzt gesperrt
  private onclickLegend(id) {
    var $$ = this;
    var erg = null;
    var indexArr = id.split("_");
    var index = parseInt(indexArr[0]);
    return null; 
  };

}
export = WfChart1Component;
