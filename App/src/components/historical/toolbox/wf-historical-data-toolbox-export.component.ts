import ComponentBaseModel = require("../../component-base.model");
import Logger = require("../../../services/logger");
import { HistoricalData } from "../historical-data";
import { IToolboxParams } from "../models/toolbox-params.model";
import { AjaxDownloadService } from "../../../services/ajaxDownloadService";
import { SeriesChartDataProviderFacade, ISeriesChartDataProviderFacade } from "../providers/series-chart-data-provider.facade";

class WfHistoricalDataToolboxExportComponent extends ComponentBaseModel<IToolboxParams> {

    public provider: ISeriesChartDataProviderFacade;
    private loadingSubscription: KnockoutSubscription;

    public readonly isLoading = ko.observable(false);
    public readonly isDownloading = ko.observable(false);
    public readonly ajaxDownloadService = new AjaxDownloadService();

    public css: string;
    public showLabel: boolean;

    constructor(params: IToolboxParams) {
        super(params);
        this.getProvidersAsync();
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.css = this.settings.css || "btn btn-default";
        this.showLabel = this.settings.showLabel || false;
    }

    private async getProvidersAsync() {
        this.provider = await HistoricalData.seriesConnector.subscribeAsync(this.settings.groupName, this.settings.controlName);
        this.loadingSubscription = this.provider.isLoading.subscribe((value) => {
            this.isLoading(value);
        });
        this.isLoading(this.provider.isLoading());
    }

    public async onClicked() {
        try {
            this.isDownloading(true);
            let filter = HistoricalData.seriesConnector.getHistoricalDataFilter(this.provider.provider, true).toDto() as ExportLogValuesDTO;
            filter.FileName = null;
            filter.DateTimeFormat = this.provider.export().dateTimeFormat || null;
            filter.LanguageId = this.connector.currentLanguageId();
            filter.Colors = this.provider.series().map(x => { return x.strokeColor || x.fillColor });
            filter.CsvDelimiter = this.provider.export().csvDelimiter || ";";
            filter.ExportType = this.provider.export().exportType || ExportType.Csv;

            const file = await this.connector.exportLogsValues(filter);
            this.ajaxDownloadService.clientDownload(file);
        } catch (error) {
            Logger.error(this, error);
        }
        finally {
            this.isDownloading(false);
        }
    }

    protected async dispose() {
        HistoricalData.seriesConnector.unSubscribe(this.settings.groupName, this.settings.controlName);
        this.loadingSubscription.dispose();
    }
}

export = WfHistoricalDataToolboxExportComponent;