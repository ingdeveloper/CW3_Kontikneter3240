// Quelle - https://stackoverflow.com/questions/18395976/how-to-display-a-json-array-in-table-format
import { rezService } from "../../../viewModels/cowi/services/rezService";

class GetClientInfo {
  // private webUrl: string = `${window.rootUrlPrefix}/wcfSiem/WcfPlcRezept.svc/js/`;

  public async Ip() {
    try {
      const resp = await rezService.GetClentIp();
      if (!resp.GetClientIPResult.Succeed)
        throw new Error(resp.GetClientIPResult.ErrorMsg);
      return resp.GetClientIPResult.Data;
    } catch (ex) {
      throw new Error("Clien-IP konnte nicht ermittelt werden. " + ex);
    }
  }

  public async Name() {
    try {
      const resp = await rezService.GetClientName();
      if (!resp.GetClientNameResult.Succeed)
        throw new Error(resp.GetClientNameResult.ErrorMsg);
      return resp.GetClientNameResult.Data;
    } catch (ex) {
      throw new Error("Client-Name konnte nicht ermittelt werden");
    }
  }
}
export let ClientInfo = new GetClientInfo();
