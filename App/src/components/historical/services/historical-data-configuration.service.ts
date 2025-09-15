
import Connector = require("../../../services/connector");
import { ConfigControlType } from "../../../services/connectorEnums";
import { IHistoricalDataConfiguration, IHistoricalDataConfigurationService } from "../models/historical-data-configuration.model";
declare var uuid;

export class HistoricalDataConfigurationService implements IHistoricalDataConfigurationService {

  private readonly connector = new Connector();
  private static readonly ControlType = ConfigControlType.HistoricalDataChart;

  public async listAsync<T>(namespace: string) {
    const configurations = await this.connector.getControlConfigurationsByNamespace(namespace, HistoricalDataConfigurationService.ControlType);
    return configurations.map(item => {
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
    });
  }

  public async getAsync<T>(name: string, namespace: string = "") {
    const item = await this.connector.getControlConfigurationByName(name, namespace, HistoricalDataConfigurationService.ControlType);

    if (!item)
      return null;

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
      ControlType: HistoricalDataConfigurationService.ControlType,
      Owner: this.connector.currentLoggedInUser(),
      Content: JSON.stringify(configuration),
    } as ControlConfigurationDTO;

    await this.connector.insertControlConfiguration(config);
  }

  public async updateAsync<T>(name: string, configuration: T, namespace: string = "") {

    const configUpdate = await this.connector.getControlConfigurationByName(name, namespace, HistoricalDataConfigurationService.ControlType);

    const config = {
      ID: configUpdate.ID,
      Name: configUpdate.Name,
      Namespace: configUpdate.Namespace,
      CreatedOn: configUpdate.CreatedOn,
      Version: configUpdate.Version + 1,
      ControlType: HistoricalDataConfigurationService.ControlType,
      Owner: configUpdate.Owner,
      Content: JSON.stringify(configuration),
    } as ControlConfigurationDTO;

    await this.connector.updateControlConfiguration(config);
  }

  public async deleteAsync(id: string) {
    await this.connector.deleteControlConfiguration(id);
  }

}
