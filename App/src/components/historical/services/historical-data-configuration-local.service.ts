
import Connector = require("../../../services/connector");
import { ConfigControlType } from "../../../services/connectorEnums";
import { IHistoricalDataConfiguration, IHistoricalDataConfigurationService } from "../models/historical-data-configuration.model";
declare var uuid;

export class HistoricalDataConfigurationLocalService implements IHistoricalDataConfigurationService {

  private readonly connector = new Connector();
  private static readonly ControlType = ConfigControlType.HistoricalDataChart;

  public async listAsync<T>(namespace: string = "") {
    const list = [] as IHistoricalDataConfiguration<T>[];
    for (var key in localStorage) {
      if (!key.startsWith(`wf-historical-data-chart#${namespace}#`))
        continue;
      const configResult = localStorage.getItem(key);

      if (!configResult)
        continue;

      const item = JSON.parse(configResult);
      list.push({
        configuration: JSON.parse(item.Content),
        controlType: item.ControlType,
        createdOn: moment(item.CreatedOn).toDate(),
        name: item.Name,
        namespace: item.Namespace,
        owner: item.Owner,
        userId: item.UserId,
        version: item.Version,
        id: item.ID
      });
    }
    return list;
  }


  public async getAsync<T>(name: string, namespace: string = "") {
    const configResult = localStorage.getItem(`wf-historical-data-chart#${namespace}#${name}`);

    if (!configResult)
      return;

    const item = JSON.parse(configResult);

    return {
      configuration: JSON.parse(item.Content),
      controlType: item.ControlType,
      createdOn: moment(item.CreatedOn).toDate(),
      name: item.Name,
      namespace: item.Namespace,
      owner: item.Owner,
      userId: item.UserId,
      version: item.Version,
      id: item.ID
    } as IHistoricalDataConfiguration<T>;
  }

  public async createAsync<T>(name: string, configuration: T, namespace: string = "") {
    const config = {
      ID: uuid.v4(),
      Name: name,
      Namespace: namespace,
      CreatedOn: moment.utc().toMSDate(),
      Version: 0,
      ControlType: HistoricalDataConfigurationLocalService.ControlType,
      Owner: this.connector.currentLoggedInUser(),
      Content: JSON.stringify(configuration),
    } as ControlConfigurationDTO;
    localStorage.setItem(`wf-historical-data-chart#${namespace}#${name}`, JSON.stringify(config));
  }

  public async updateAsync<T>(name: string, configuration: T, namespace: string = "") {

    const configResult = localStorage.getItem(`wf-historical-data-chart#${namespace}#${name}`);

    if (!configResult)
      return;

    const configUpdate = JSON.parse(configResult);

    const config = {
      ID: configUpdate.ID,
      Name: configUpdate.Name,
      Namespace: configUpdate.Namespace,
      CreatedOn: configUpdate.CreatedOn,
      Version: configUpdate.Version + 1,
      ControlType: HistoricalDataConfigurationLocalService.ControlType,
      Owner: configUpdate.Owner,
      Content: JSON.stringify(configuration),
    } as ControlConfigurationDTO;

    localStorage.setItem(`wf-historical-data-chart#${namespace}#${name}`, JSON.stringify(config));
  }

  public async deleteAsync(name: string, namespace: string = "") {
    localStorage.removeItem(`wf-historical-data-chart#${namespace}#${name}`);
  }

}
