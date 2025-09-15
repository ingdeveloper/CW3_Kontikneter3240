import Connector = require("../../../../services/connector");
import ConvertCsvService = require("../../../services/convert-csv.service");
import { SignalAlarmListFiledNames, SignalAlarmListPropertyNames } from "../models/signal-alarm-list-fields.model";
import { SignalAlarmListService } from "./signal-alarm-list.service";

export class SignalAlarmExportService {
    private connector: Connector = new Connector();
    private convertCsvService: ConvertCsvService;
    private signalAlarmListService: SignalAlarmListService;

    constructor(signalAlarmListService: SignalAlarmListService, settings: IConvertCsvParams) {
        this.signalAlarmListService = signalAlarmListService;
        this.convertCsvService = new ConvertCsvService(settings);
    }

    public async handleExport(signalInformationColumns: string[]) {
        const csvFile = this.convertCsvService.convertSignalAlarmListData(this.signalAlarmListService.items(), this.getFieldNamesForExport(signalInformationColumns).map(x => this.connector.translate(`I4SCADA_signal_alarm_list_column_${x}`)()), this.getFieldsForExport(signalInformationColumns));
        if (csvFile == null) return;

        this.convertCsvService.download();
    }

    private getFieldNamesForExport(signalInformationColumns: string[]) {
        const fields: string[] = [];
        for (const iterator of signalInformationColumns) {
            switch (iterator) {
                case SignalAlarmListFiledNames.AlarmStatus:
                    fields.push(SignalAlarmListFiledNames.InactiveCount);
                    fields.push(SignalAlarmListFiledNames.OffCount);
                    fields.push(SignalAlarmListFiledNames.AcknowledgedCount);
                    fields.push(SignalAlarmListFiledNames.OnCount);
                    break;
                case SignalAlarmListFiledNames.AlarmProcessingAndDisplayStatus:
                    fields.push(SignalAlarmListFiledNames.NotProcessedButVisibleCount);
                    fields.push(SignalAlarmListFiledNames.ProcessedAndVisibleCount);
                    fields.push(SignalAlarmListFiledNames.NotProcessedAndNotVisibleCount);
                    fields.push(SignalAlarmListFiledNames.ProcessedButNotVisibleCount);
                    break;
                    case SignalAlarmListFiledNames.Value:
                        fields.push(SignalAlarmListFiledNames.Value);
                        fields.push(SignalAlarmListFiledNames.DiscreteValue);
                        break;
                default:
                    fields.push(iterator);
                    break;
            }
        }
        return fields;
    }

    private getFieldsForExport(signalInformationColumns: string[]) {
        const fields: string[] = [];
        for (const iterator of signalInformationColumns) {
            switch (iterator) {
                case SignalAlarmListFiledNames.AlarmStatus:
                    fields.push(SignalAlarmListPropertyNames.InactiveCount);
                    fields.push(SignalAlarmListPropertyNames.OffCount);
                    fields.push(SignalAlarmListPropertyNames.AcknowledgedCount);
                    fields.push(SignalAlarmListPropertyNames.OnCount);
                    break;
                case SignalAlarmListFiledNames.AlarmProcessingAndDisplayStatus:
                    fields.push(SignalAlarmListPropertyNames.NotProcessedButVisibleCount);
                    fields.push(SignalAlarmListPropertyNames.ProcessedAndVisibleCount);
                    fields.push(SignalAlarmListPropertyNames.NotProcessedAndNotVisibleCount);
                    fields.push(SignalAlarmListPropertyNames.ProcessedButNotVisibleCount);
                    break;
                case SignalAlarmListFiledNames.AliasName:
                    fields.push(SignalAlarmListPropertyNames.AliasName);
                    break;
                case SignalAlarmListFiledNames.Description:
                    fields.push(SignalAlarmListPropertyNames.Description);
                    break;
                case SignalAlarmListFiledNames.Name:
                    fields.push(SignalAlarmListPropertyNames.Name);
                    break;
                case SignalAlarmListFiledNames.Unit:
                    fields.push(SignalAlarmListPropertyNames.Unit);
                    break;
                case SignalAlarmListFiledNames.Value:
                    fields.push(SignalAlarmListPropertyNames.Value);
                    fields.push(SignalAlarmListPropertyNames.DiscreteValues);
                    break;
                default:
                    fields.push(iterator);
                    break;
            }

        }
        return fields;
    }

}