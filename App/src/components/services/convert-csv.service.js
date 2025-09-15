var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define(["require", "exports", "../control/wf-signal-alarm-list/models/signal-alarm-list-fields.model"], function (require, exports, signal_alarm_list_fields_model_1) {
    "use strict";
    var ConvertCsvService = /** @class */ (function () {
        function ConvertCsvService(settings) {
            this.settings = settings;
            var objectId = ko.unwrap(this.settings.objectID);
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
        ConvertCsvService.prototype.createAlarmEntity = function (alarm, name) {
            var csv = "";
            if (alarm.hasOwnProperty(name)) {
                if (alarm[name] != null && (name === "DateOn" || name === "DateOff" || name === "DateAck")) {
                    csv += moment(alarm[name]).format(this.dateTimeFormat);
                }
                else {
                    csv += alarm[name];
                }
            }
            csv += this.columnDelimiter;
            return csv;
        };
        ConvertCsvService.prototype.convertAlarmViewertData = function (data, fieldNames, fields) {
            var _this = this;
            if (fieldNames === void 0) { fieldNames = ["Priority", "Status", "Group", "Type", "Text", "DateOn", "DateOff", "DateAck"]; }
            if (fields === void 0) { fields = ["Priority", "Status", "AlarmGroupSymbolicTextTranslation", "AlarmTypeSymbolicTextTranslation", "AlarmSymbolicTextTranslation", "DateOn", "DateOff", "DateAck"]; }
            if (!_.any(data)) {
                return null;
            }
            //build header
            var headerCallback = function () {
                var e_1, _a;
                var columns = [];
                try {
                    for (var fieldNames_1 = __values(fieldNames), fieldNames_1_1 = fieldNames_1.next(); !fieldNames_1_1.done; fieldNames_1_1 = fieldNames_1.next()) {
                        var field = fieldNames_1_1.value;
                        if (field === "DateOn" || field === "DateOff" || field === "DateAck") {
                            columns.push(field + " (" + moment().format('Z') + ")");
                        }
                        else {
                            columns.push(field);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (fieldNames_1_1 && !fieldNames_1_1.done && (_a = fieldNames_1.return)) _a.call(fieldNames_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return columns;
            };
            var contentCallback = function () {
                var e_2, _a, e_3, _b;
                var csv = "";
                try {
                    for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                        var alarm = data_1_1.value;
                        try {
                            for (var fields_1 = (e_3 = void 0, __values(fields)), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                                var field = fields_1_1.value;
                                csv += _this.createAlarmEntity(alarm, field);
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (fields_1_1 && !fields_1_1.done && (_b = fields_1.return)) _b.call(fields_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        csv += _this.lineDelimiter;
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return csv;
            };
            return this.convert(headerCallback, contentCallback);
        };
        ConvertCsvService.prototype.convertChartData = function (data) {
            var _this = this;
            if (data == null || !data.length) {
                return null;
            }
            //build header
            var headerCallback = function () {
                var columns = ["Timestamp (" + moment().format('Z') + ")"];
                for (var i = 1; i < data.length; i++) { //0 is x axis
                    columns.push(data[i][0]);
                }
                return columns;
            };
            var contentCallback = function () {
                var csv = "";
                for (var l = 0; l < data.length; l++) {
                    data[l] = data[l].reverse();
                }
                if (data && data[0]) {
                    if (data[0][1])
                        _this.minDateTime = moment(data[0][1]).format(_this.dateTimeFileNameFormat);
                    if (data[data.length - 1][data[0].length - 2])
                        _this.maxDateTime = moment(data[0][data[0].length - 2]).format(_this.dateTimeFileNameFormat);
                }
                for (var j = 0; j < data[0].length - 1; j++) {
                    for (var k = 0; k < data.length; k++) {
                        var item = k === 0
                            ? moment(data[k][j]).format(_this.dateTimeFormat)
                            : data[k][j] != null ? numeral(data[k][j]).format(_this.numeralFormat) : "";
                        csv += item;
                        if (k !== data.length - 1)
                            csv += _this.columnDelimiter;
                    }
                    csv += _this.lineDelimiter;
                }
                return csv;
            };
            return this.convert(headerCallback, contentCallback);
        };
        ConvertCsvService.prototype.convertLogTableData = function (values, logTags) {
            var _this = this;
            if (values == null || !values.length || logTags == null || !logTags.length) {
                return null;
            }
            //build header
            var headerCallback = function () {
                var headers = ["Timestamp (" + moment().format('Z') + ")"];
                for (var i = 0; i < logTags.length; i++) {
                    headers.push(ko.unwrap(logTags[i].columnTitle));
                }
                return headers;
            };
            var contentCallback = function () {
                var csv = "";
                if (values && values[0]) {
                    if (values[0][0])
                        _this.minDateTime = moment(values[0][0]).format(_this.dateTimeFileNameFormat);
                    if (values[values.length - 1] && values[values.length - 1][0])
                        _this.maxDateTime = moment(values[values.length - 1][0]).format(_this.dateTimeFileNameFormat);
                }
                for (var j = 0; j < values.length; j++) {
                    for (var k = 0; k < values[j].length; k++) {
                        var item = "";
                        if (values[j][k]) {
                            var value = values[j][k].value;
                            item = k === 0 ? moment(values[j][k]).format(_this.dateTimeFormat) : value;
                        }
                        csv += item;
                        if (k !== values.length - 1)
                            csv += _this.columnDelimiter;
                    }
                    csv += _this.lineDelimiter;
                }
                return csv;
            };
            return this.convert(headerCallback, contentCallback);
        };
        ConvertCsvService.prototype.convertSignalAlarmListData = function (data, fieldNames, fields) {
            var _this = this;
            if (fieldNames === void 0) { fieldNames = []; }
            if (fields === void 0) { fields = []; }
            if (!_.any(data)) {
                return null;
            }
            //build header
            var headerCallback = function () {
                var e_4, _a;
                var columns = [];
                try {
                    for (var fieldNames_2 = __values(fieldNames), fieldNames_2_1 = fieldNames_2.next(); !fieldNames_2_1.done; fieldNames_2_1 = fieldNames_2.next()) {
                        var field = fieldNames_2_1.value;
                        columns.push(field);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (fieldNames_2_1 && !fieldNames_2_1.done && (_a = fieldNames_2.return)) _a.call(fieldNames_2);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                return columns;
            };
            var contentCallback = function () {
                var e_5, _a, e_6, _b;
                var csv = "";
                try {
                    for (var data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                        var alarm = data_2_1.value;
                        try {
                            for (var fields_2 = (e_6 = void 0, __values(fields)), fields_2_1 = fields_2.next(); !fields_2_1.done; fields_2_1 = fields_2.next()) {
                                var field = fields_2_1.value;
                                csv += _this.createSignalWithAlarmInfoEntity(alarm, field);
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (fields_2_1 && !fields_2_1.done && (_b = fields_2.return)) _b.call(fields_2);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        csv += _this.lineDelimiter;
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (data_2_1 && !data_2_1.done && (_a = data_2.return)) _a.call(data_2);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                return csv;
            };
            return this.convert(headerCallback, contentCallback);
        };
        ConvertCsvService.prototype.createSignalWithAlarmInfoEntity = function (item, name) {
            var csv = "";
            if (item.hasOwnProperty(name)) {
                var value = ko.unwrap(item[name]);
                if (name === signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.Value) {
                    if (item.isDateTime()) {
                        csv += moment(value).format(this.dateTimeFormat);
                    }
                    else {
                        if ($.isNumeric(value)) {
                            csv += value != null ? numeral(value).format(this.numeralFormat) : "";
                        }
                        else {
                            if (value === null || value === undefined)
                                csv += value || "";
                            else
                                csv += value;
                        }
                    }
                }
                else if (name === signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.DiscreteValues) {
                    if (value) {
                        var discreteValue = value.find(function (x) { return x.Value === item.value(); });
                        csv += discreteValue ? discreteValue.Description : "";
                    }
                    else {
                        csv += "";
                    }
                }
                else {
                    if (value === null || value === undefined) {
                        csv += "";
                    }
                    else {
                        csv += value;
                    }
                }
            }
            csv += this.columnDelimiter;
            return csv;
        };
        ConvertCsvService.prototype.getFileName = function () {
            var fileName = this.fileName.replace(".csv", "");
            return this.dateTimeFileName === true ?
                "" + fileName + (this.minDateTime != null ? "-" : "") + (this.minDateTime || "") + (this.maxDateTime != null ? "-" : "") + (this.maxDateTime || "") + ".csv" :
                fileName + ".csv";
        };
        ConvertCsvService.prototype.convert = function (getHeaderCallback, getContentCallback) {
            var csv = "sep=" + this.columnDelimiter + this.lineDelimiter;
            var headers = getHeaderCallback ? getHeaderCallback() : null;
            if (headers !== null && headers !== undefined) {
                csv += headers.join(this.columnDelimiter);
                csv += this.lineDelimiter;
            }
            if (getContentCallback)
                csv += getContentCallback();
            this.csv = { fileName: this.getFileName(), fileContent: csv };
            return this.csv;
        };
        ConvertCsvService.prototype.download = function () {
            var binaryData = new Blob(["\ufeff", this.csv.fileContent], { type: "text/csv" });
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(binaryData, this.csv.fileName);
            }
            else {
                var link = window.document.createElement('a');
                var objectURL = window.URL.createObjectURL(binaryData);
                link.setAttribute('href', objectURL);
                link.setAttribute('download', this.csv.fileName);
                // Append anchor to body.
                document.body.appendChild(link);
                link.click();
                // Remove anchor from body
                document.body.removeChild(link);
                window.URL.revokeObjectURL(objectURL);
            }
        };
        return ConvertCsvService;
    }());
    return ConvertCsvService;
});
//# sourceMappingURL=convert-csv.service.js.map