import { SignalAlarmListPropertyNames } from "../control/wf-signal-alarm-list/models/signal-alarm-list-fields.model";
import { SignalWithAlarmInfo } from "../control/wf-signal-alarm-list/models/signal-with-alarm-info.model";

declare var numeral;

class ConvertCsvService {
    private fileName: string;
    private columnDelimiter: string;
    private lineDelimiter: string;
    private dateTimeFormat: string;
    private numeralFormat: string;
    private isAlphanumeric: boolean;
    private columnTitleTemplate: string;
    private dateTimeFileName: boolean;
    private dateTimeFileNameFormat: string;

    private minDateTime: string;
    private maxDateTime: string;

    private csv: { fileName: string, fileContent: string };
    constructor(private settings: IConvertCsvParams) {

        const objectId = ko.unwrap(this.settings.objectID);

        this.fileName = (ko.unwrap(this.settings.exportFileName) || "export").stringPlaceholderResolver(objectId);
        this.columnDelimiter = (ko.unwrap(this.settings.exportColumnDelimiter) || ";");

        this.lineDelimiter = ko.unwrap(this.settings.exportLineDelimiter) || "\r\n";
        this.dateTimeFormat = ko.unwrap(this.settings.exportDateTimeFormat) || "DD.MM.YYYY HH:mm:ss";
        this.numeralFormat = ko.unwrap(this.settings.format) || "0,0.[00]";

        this.isAlphanumeric = ko.unwrap(this.settings.isAlphanumeric) !== undefined ? ko.unwrap(this.settings.isAlphanumeric) : false;
        this.columnTitleTemplate = ko.unwrap(this.settings.columnTitleTemplate) || "";

        this.dateTimeFileName = ko.unwrap(this.settings.dateTimeFileName) !== undefined ? ko.unwrap(this.settings.dateTimeFileName) : false;
        this.dateTimeFileNameFormat = ko.unwrap(this.settings.dateTimeFileNameFormat) || "DD.MM.YYYY-HH:mm:ss";
    }

    private createAlarmEntity(alarm: AlarmDTO, name: string) {
        let csv = "";
        if (alarm.hasOwnProperty(name)) {

            if (alarm[name] != null && (name === "DateOn" || name === "DateOff" || name === "DateAck")) {
                csv += moment(alarm[name]).format(this.dateTimeFormat);
            } else {
                csv += alarm[name];
            }
        }
        csv += this.columnDelimiter;
        return csv;
    }

    public convertAlarmViewertData(
        data: AlarmDTO[],
        fieldNames: string[] = ["Priority", "Status", "Group", "Type", "Text", "DateOn", "DateOff", "DateAck"],
        fields: string[] = ["Priority", "Status", "AlarmGroupSymbolicTextTranslation", "AlarmTypeSymbolicTextTranslation", "AlarmSymbolicTextTranslation", "DateOn", "DateOff", "DateAck"]

    ): any {
        if (!_.any(data)) {
            return null;
        }

        //build header
        const headerCallback = () => {
            const columns: string[] = [];
            for (const field of fieldNames) {
                if (field === "DateOn" || field === "DateOff" || field === "DateAck") {
                    columns.push(`${field} (${moment().format('Z')})`);
                } else {
                    columns.push(field);
                }
            }
            return columns;
        };

        const contentCallback = () => {
            var csv = "";

            for (const alarm of data) {
                for (const field of fields) {
                    csv += this.createAlarmEntity(alarm, field);
                }
                csv += this.lineDelimiter;
            }

            return csv;
        };

        return this.convert(headerCallback, contentCallback);
    }

    public convertChartData(data: [any]): any {
        if (data == null || !data.length) {
            return null;
        }

        //build header
        var headerCallback = () => {
            var columns = ["Timestamp (" + moment().format('Z') + ")"];
            for (var i = 1; i < data.length; i++) { //0 is x axis
                columns.push(data[i][0]);
            }

            return columns;
        };

        var contentCallback = () => {
            var csv = "";

            for (var l = 0; l < data.length; l++) {
                data[l] = data[l].reverse();
            }

            if (data && data[0]) {
                if (data[0][1])
                    this.minDateTime = moment(data[0][1]).format(this.dateTimeFileNameFormat);
                if (data[data.length - 1][data[0].length - 2])
                    this.maxDateTime = moment(data[0][data[0].length - 2]).format(this.dateTimeFileNameFormat);
            }

            for (var j = 0; j < data[0].length - 1; j++) {
                for (var k = 0; k < data.length; k++) {
                    var item = k === 0
                        ? moment(data[k][j]).format(this.dateTimeFormat)
                        : data[k][j] != null ? numeral(data[k][j]).format(this.numeralFormat) : "";
                    csv += item;
                    if (k !== data.length - 1)
                        csv += this.columnDelimiter;
                }
                csv += this.lineDelimiter;
            }

            return csv;
        };

        return this.convert(headerCallback, contentCallback);
    }

    public convertLogTableData(values: [any], logTags: [any]): any {
        if (values == null || !values.length || logTags == null || !logTags.length) {
            return null;
        }

        //build header
        var headerCallback = () => {
            var headers = ["Timestamp (" + moment().format('Z') + ")"];
            for (var i = 0; i < logTags.length; i++) {
                headers.push(ko.unwrap(logTags[i].columnTitle));
            }

            return headers;
        };

        var contentCallback = () => {
            var csv = "";

            if (values && values[0]) {
                if (values[0][0])
                    this.minDateTime = moment(values[0][0]).format(this.dateTimeFileNameFormat);
                if (values[values.length - 1] && values[values.length - 1][0])
                    this.maxDateTime = moment(values[values.length - 1][0]).format(this.dateTimeFileNameFormat);
            }

            for (var j = 0; j < values.length; j++) {
                for (var k = 0; k < values[j].length; k++) {
                    var item = "";
                    if (values[j][k]) {
                        const value = values[j][k].value;
                        item = k === 0 ? moment(values[j][k]).format(this.dateTimeFormat) : value;
                    }
                    csv += item;
                    if (k !== values.length - 1)
                        csv += this.columnDelimiter;
                }
                csv += this.lineDelimiter;
            }

            return csv;
        };
        return this.convert(headerCallback, contentCallback);

    }

    public convertSignalAlarmListData(data: SignalWithAlarmInfo[],
        fieldNames: string[] = [],
        fields: string[] = []): any {
        if (!_.any(data)) {
            return null;
        }

        //build header
        const headerCallback = () => {
            const columns: string[] = [];
            for (const field of fieldNames) {
                columns.push(field);
            }
            return columns;
        };

        const contentCallback = () => {
            var csv = "";
            for (const alarm of data) {
                for (const field of fields) {
                    csv += this.createSignalWithAlarmInfoEntity(alarm, field);
                }
                csv += this.lineDelimiter;
            }
            return csv;
        };

        return this.convert(headerCallback, contentCallback);
    }

    private createSignalWithAlarmInfoEntity(item: SignalWithAlarmInfo, name: string) {
        let csv = "";
        if (item.hasOwnProperty(name)) {
            const value = ko.unwrap(item[name]);
            if (name === SignalAlarmListPropertyNames.Value) {
                if(item.isDateTime()){
                    csv += moment(value).format(this.dateTimeFormat);
                }else{
                    if ($.isNumeric(value)) {
                        csv += value != null ? numeral(value).format(this.numeralFormat) : "";
                    } else {
                        if (value === null || value === undefined)
                            csv += value || "";
                        else
                            csv += value;
                    }
                }
            } else if (name === SignalAlarmListPropertyNames.DiscreteValues) {
                if (value) {
                    const discreteValue = value.find(x => x.Value === item.value());
                    csv += discreteValue ? discreteValue.Description : "";
                } else {
                    csv += "";
                }
            } else {
                if (value === null || value === undefined) {
                    csv += "";
                } else {
                    csv += value;
                }
            }
        }
        csv += this.columnDelimiter;
        return csv;
    }

    private getFileName() {
        const fileName = this.fileName.replace(".csv", "");
        return this.dateTimeFileName === true ?
            `${fileName}${this.minDateTime != null ? "-" : ""}${this.minDateTime || ""}${this.maxDateTime != null ? "-" : ""}${this.maxDateTime || ""}.csv` :
            `${fileName}.csv`
    }

    private convert(getHeaderCallback: Function, getContentCallback: Function): any {
        var csv = `sep=${this.columnDelimiter}${this.lineDelimiter}`;

        var headers = getHeaderCallback ? getHeaderCallback() : null;
        if (headers !== null && headers !== undefined) {
            csv += headers.join(this.columnDelimiter);
            csv += this.lineDelimiter;
        }

        if (getContentCallback)
            csv += getContentCallback();

        this.csv = { fileName: this.getFileName(), fileContent: csv }
        return this.csv;
    }

    public download() {
        const binaryData = new Blob(["\ufeff", this.csv.fileContent], { type: "text/csv" });

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(binaryData, this.csv.fileName);
        } else {
            const link = window.document.createElement('a');
            const objectURL = window.URL.createObjectURL(binaryData)
            link.setAttribute('href', objectURL);
            link.setAttribute('download', this.csv.fileName);

            // Append anchor to body.
            document.body.appendChild(link)
            link.click();

            // Remove anchor from body
            document.body.removeChild(link);
            window.URL.revokeObjectURL(objectURL);
        }
    }
}

export = ConvertCsvService;