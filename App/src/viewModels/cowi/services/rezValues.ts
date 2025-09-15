import Connector = require("../../../services/connector");
import { rezService } from './rezService';

interface VarName {
  Name: string;
  Aliasname: string;
  Description: string;
  Value: null;
  Factor: string;
  AliasGlobal: string;
}
class RezValues {
  // private varListe: any[];
  private connector: Connector;
  private start: number;
  public cmd: {
    asWfDb: string;
    asWfFilter: string | string[];
    asWfServer: string;
  } = { asWfDb: "", asWfFilter: "", asWfServer: "" };

  /**
   * liefert Rezeptvariablen und Aktualwerte
   * @param {string} _remoteIISServer Pfad zum WF-Server
   * @param {string} _databaseName Name der WF-Datenbank
   * @param {string} _filter Filtername (Markierung der Rezeptrelevanten-Variablen)
   * @param {Connector} _connector aktueller WF-Connector
   */
  constructor(
    _remoteIISServer: string,
    _databaseName: string,
    _filter: string | string[],
    _connector: Connector
  ) {
    this.cmd.asWfDb = _databaseName;
    this.cmd.asWfFilter = _filter;
    this.cmd.asWfServer = _remoteIISServer;

    this.connector = _connector;
  }

  /** liefert die Variablenliste Alphabetisch sortiert */
  public getVarListe = async (): Promise<any[]> => {
    if (Array.isArray(this.cmd.asWfFilter)) {
      let NameList = [];

      await Promise.all(
        this.cmd.asWfFilter.map(async (filter) => {
          try {
            NameList = NameList.concat(await this.getSortedRezVarnames(filter));
          } catch (error) {
            console.error(error);
            throw error;
          }
        })
      );
      return this.getRezValues(NameList);
    } else {
      // falls kein Array, dann einmalig aufrufen
      return this.getRezValues(
        await this.getSortedRezVarnames(this.cmd.asWfFilter)
      );
    }
  };

  /** Values einlesen */
  public async getRezValues(VarListe: any[]): Promise<any[]> {
    this.start = performance.now();
    let aliases = [];

    for (const iVar of VarListe) {
      aliases.push(iVar.Aliasname);
    }

    try {
      const data = await this.connector.readSignals(aliases);
      if (data.length !== VarListe.length) {
        throw new Error(
          `Fehler beim Var.Initialisieren, this.data.length = ${data.length}; varListe.length = ${VarListe.length}`
        );
      }
      for (let i = 0; i < VarListe.length; i++) {
        VarListe[i].Value = data[i].Value;
      }
      // Dauer des Datenabrufs ausgeben
      // console.log(
      //   "%cgetRezValues() - " +
      //   (performance.now() - this.start).toFixed(2) +
      //   " ms.",
      //   "color:red"
      // );
      return VarListe;
    } catch (error) {
      throw error;
    }
  }

  private async getSortedRezVarnames(filter: string): Promise<VarName[]> {
    try {
      const [resp, respV] = await Promise.all([
        rezService.GetRezVarnames({
          WfServer: this.cmd.asWfServer,
          WfDb: this.cmd.asWfDb,
          WfFilter: filter,
        }),
        new Promise((resolve, reject) => {
          const q: IGetVirtualRezVarnames = {
            GetVirtualRezVarnamesResult: {
              Data: null,
              ErrorMsg: "",
              ErrorNr: 0,
              Msg: "",
              Succeed: true,
            },
          };
          resolve(q);
        }) as Promise<IGetVirtualRezVarnames>,

        // rezService.GetVirtRezVarnames({
        //   WfServer: this.cmd.asWfServer,
        //   WfDb: this.cmd.asWfDb,
        //   WfFilter: filter,
        // }),
      ]);

      if (
        !resp.GetSortedRezVarnamesResult.Succeed ||
        !respV.GetVirtualRezVarnamesResult.Succeed
      ) {
        console.error(
          "Fehler beim Abrufen der RezVarnames/VirtRezVarnames:",
          resp.GetSortedRezVarnamesResult.ErrorMsg,
          respV.GetVirtualRezVarnamesResult.ErrorMsg
        );
        throw new Error(
          resp.GetSortedRezVarnamesResult.ErrorMsg +
          "/" +
          respV.GetVirtualRezVarnamesResult.ErrorMsg
        );
      }

      const combinedData = [
        ...resp.GetSortedRezVarnamesResult.Data,
        // ...respV.GetVirtualRezVarnamesResult.Data,
      ];

      const VarNameLst: VarName[] = combinedData.map((row: string) => {
        const rowArr = row.split("|");
        if (rowArr.length !== 5) {
          throw new Error(
            `'GetSortedRezVarnames' - Anzahl Elemente entspricht nicht.. erwartet 5, bekommen: ${rowArr.length}`
          );
        }
        return {
          Name: rowArr[0],
          Aliasname: rowArr[1],
          Description: rowArr[2],
          Value: null,
          Factor: rowArr[4],
          AliasGlobal: rowArr[3],
        };
      });
      return VarNameLst;
    } catch (error) {
      console.error("Fehler in getSortedRezVarnames:", error);
      throw error;
    }
  }
}
export = RezValues;
