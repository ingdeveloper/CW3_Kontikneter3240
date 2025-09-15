import { rezService } from './rezService';

class RezDlgKonfig {
    private cachedKonfig: string | null = null;
    private messages: string[] = [];

    constructor(private anlagenNr: number) { }

    public async init(): Promise<void> {
        this.messages = [];
        try {
            console.log(`Lade Rez.Dlg.-Konfiguration für anlagenNr = ${this.anlagenNr}`);
            const result: IWcfResult = (await rezService.GetRezDlgConfig(this.anlagenNr)).GetRezDlgConfigResult;

            if (!result.Succeed) {
                throw new Error(result.ErrorMsg);
            }

            const dataArray = JSON.parse(result.Data);
            if (Array.isArray(dataArray) && dataArray.length > 0) {
                this.cachedKonfig = result.Data;
            } else {
                throw new Error("Die Rez.Dlg.-Konfig ist leer oder ungültig.");
            }
        } catch (error) {
            this.messages.push(`Fehler beim Laden der Rez.Dlg.-Konfiguration für anlagenNr = ${this.anlagenNr}: ${error.message}. Es wird die Default-Konfiguration verwendet.`);
        }
    }

    public getKonfig(): IRezDlgKonfig {
        const data = this.cachedKonfig
            ? JSON.parse(this.cachedKonfig)
            : JSON.parse(`[{"LbstSvc_Enabl":false,"LbstRngMld_Enabl":true,"Auftr_33333_Enabl":true,"Auftr_77777_Enabl":false,"Auftr_88888_Enabl":false,"Auftr_99999_Enabl":true,"TestEnv_Enabl":false,"ServicePfad":"https://app-visu-01-p","ExEnCr":"1970-01-01T00:00:00"}]`);

        return data.map((row: any) => {
            const bitFields = Object.keys(row)
                .filter((key) => key.endsWith("Enabl"))
                .reduce((acc: any, key) => {
                    acc[key] = row[key];
                    return acc;
                }, {});
            return {
                ...bitFields,
                ServicePfad: row.ServicePfad,
                ExEnCr: moment(row.ExEnCr).format('DD.MM.YYYY HH:mm:ss')
            };
        });
    }

    public getMessages(): string[] {
        return this.messages;
    }
}

// Export Factory-Funktion
export async function rezDlgKonfig(anlagenNr: number): Promise<{ konfig: IRezDlgKonfig, messages: string[] }> {
    const instance = new RezDlgKonfig(anlagenNr);
    await instance.init();
    return {
        konfig: instance.getKonfig()[0],
        messages: instance.getMessages()
    };
}
