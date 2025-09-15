import { rezService } from './rezService';

class RezLog {
  private static logDataQueue: Array<IWriteActivityParams2> = [];
  private static processingInterval: any;
  private static startFlag: boolean = false;
  private static previousTimestamp: number = 0;


  private static async processLogQueue() {
    while (this.logDataQueue.length > 0) {
      const logDataBatch = this.logDataQueue.splice(0, this.logDataQueue.length);
      if (logDataBatch.length > 0) {
        try {
          await rezService.WriteActivity2({ meldungenList: logDataBatch });
        } catch (ex) {
          console.error(
            "RezLog",
            "Fehler beim Verarbeiten des Log-Eintrags",
            ex.message
          );
          throw ex;
        }
      }
    }
  }

  public static startProcessing(interval: number = 5000) {
    // Startet einen Timer, der processLogQueue in regelmäßigen Abständen aufruft
    this.processingInterval = setInterval(() => {
      this.processLogQueue();
    }, interval);
  }

  public static stopProcessing() {
    // Stoppt den Timer
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
  }

  /**
   * Liest die Log-Einträge.
   * @param anlagenNr - Anlagennummer.
   * @param startDate - Startdatum zur Filterung der Log-Einträge (optional).
   * @param stopDate - Enddatum zur Filterung der Log-Einträge (optional).
   * @returns Die abgerufenen Log-Daten.
   */
  public static async Get(
    anlagenNr: number,
    startDate?: string,
    stopDate?: string
  ): Promise<IRezLogsResult> {
    try {
      const response = await rezService.ReadActivity({
        AnlagenNr: anlagenNr,
        startDt: startDate || "",
        stopDt: stopDate || "",
      });

      if (!response.ReadRezActivity2Result.Succeed) {
        throw new Error(response.ReadRezActivity2Result.ErrorMsg);
      }

      return response.ReadRezActivity2Result.Data;
    } catch (ex) {
      throw new Error("Rezept-Log konnte nicht gelesen werden");
    }
  }

  /**
   * Schreibt einen Log-Eintrag.
   * @param logData - Array mit den Log-Daten.
   * @returns Die Antwort des Schreibvorgangs.
   */
  public static Add(logData: IWriteActivityParams2): any {
    // Aktuellen Zeitstempel berechnen
    let currentTimestamp = new Date().getTime();

    // Wenn der aktuelle Zeitstempel gleich oder kleiner als der vorherige ist, erhöhen wir ihn um 1 Millisekunde
    if (currentTimestamp <= this.previousTimestamp) {
      currentTimestamp = this.previousTimestamp + 1;
    }

    logData.Zeitstempel = new Date(currentTimestamp).toLocaleString() + '.' + (currentTimestamp % 1000).toString().padStart(3, "0");
    this.logDataQueue.push(logData);

    // Den vorherigen Zeitstempel aktualisieren
    this.previousTimestamp = currentTimestamp;

    if (!this.startFlag) {
      this.startFlag = true;
      RezLog.startProcessing();
    }
  }
}

export = RezLog;
