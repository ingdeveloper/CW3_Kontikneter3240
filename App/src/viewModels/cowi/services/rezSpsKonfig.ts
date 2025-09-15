import { rezService } from './rezService';
import rezUtils from "./rezUtils";

class RezSpsKonfig {
    private cachedKonfig: string | null = null;
    private messages: string[] = [];

    constructor(private anlagenNr: number) { }

    async init(): Promise<void> {
        this.messages = [];
        try {
            console.log(`Lade SPS-Konfiguration für anlagenNr = ${this.anlagenNr}`);
            const result: IWcfResult = (await rezService.GetRezSpsConfig(this.anlagenNr)).GetRezSpsConfigResult;

            if (!result.Succeed) {
                throw new Error(result.ErrorMsg);
            }

            const dataArray = JSON.parse(result.Data);
            if (Array.isArray(dataArray) && dataArray.length > 0) {
                this.cachedKonfig = result.Data;
            } else {
                throw new Error("Die SPS-Konfig ist leer oder ungültig.");
            }
        } catch (error) {
            this.messages.push(`Fehler beim Laden der SPS-Konfiguration für anlagenNr = ${this.anlagenNr}: ${error.message}. Es wird die Default-Konfiguration verwendet.`);
        }
    }

    private calculateSpsCfg(row: any): number {
        let value = 0;
        for (let i = 0; i <= 15; i++) {
            const bitKey = `Bit${i.toString().padStart(2, "0")}`;
            if (row[bitKey]) {
                value |= 1 << i;
            }
        }
        return value;
    }

    getKonfig(): any[] {
        const data = this.cachedKonfig
            ? JSON.parse(this.cachedKonfig)
            : JSON.parse(`[{"ProdTyp":0,"Bit15":false,"Bit14":false,"Bit13":false,"Bit12":false,"Bit11":false,"Bit10":false,"Bit09":false,"Bit08":false,"Bit07":false,"Bit06":false,"Bit05":false,"Bit04":false,"Bit03":false,"Bit02":false,"Bit01":false,"Bit00":false,"ExEnCr":"1970-01-01T00:00:00"},{"ProdTyp":1,"Bit15":false,"Bit14":false,"Bit13":false,"Bit12":false,"Bit11":false,"Bit10":false,"Bit09":false,"Bit08":false,"Bit07":false,"Bit06":false,"Bit05":true,"Bit04":true,"Bit03":true,"Bit02":true,"Bit01":true,"Bit00":true,"ExEnCr":"1970-01-01T00:00:00"},{"ProdTyp":3,"Bit15":false,"Bit14":false,"Bit13":false,"Bit12":false,"Bit11":false,"Bit10":false,"Bit09":false,"Bit08":false,"Bit07":false,"Bit06":false,"Bit05":false,"Bit04":false,"Bit03":false,"Bit02":true,"Bit01":true,"Bit00":true,"ExEnCr":"1970-01-01T00:00:00"},{"ProdTyp":9,"Bit15":false,"Bit14":false,"Bit13":false,"Bit12":false,"Bit11":false,"Bit10":false,"Bit09":false,"Bit08":false,"Bit07":false,"Bit06":false,"Bit05":true,"Bit04":false,"Bit03":false,"Bit02":false,"Bit01":true,"Bit00":true,"ExEnCr":"1970-01-01T00:00:00"},{"ProdTyp":125,"Bit15":false,"Bit14":false,"Bit13":false,"Bit12":false,"Bit11":false,"Bit10":false,"Bit09":false,"Bit08":false,"Bit07":false,"Bit06":false,"Bit05":false,"Bit04":false,"Bit03":false,"Bit02":false,"Bit01":false,"Bit00":true,"ExEnCr":"1970-01-01T00:00:00"},{"ProdTyp":253,"Bit15":false,"Bit14":false,"Bit13":false,"Bit12":false,"Bit11":false,"Bit10":false,"Bit09":false,"Bit08":false,"Bit07":false,"Bit06":false,"Bit05":false,"Bit04":false,"Bit03":false,"Bit02":false,"Bit01":true,"Bit00":false,"ExEnCr":"1970-01-01T00:00:00"},{"ProdTyp":255,"Bit15":false,"Bit14":false,"Bit13":false,"Bit12":false,"Bit11":false,"Bit10":false,"Bit09":false,"Bit08":false,"Bit07":false,"Bit06":false,"Bit05":true,"Bit04":false,"Bit03":true,"Bit02":true,"Bit01":true,"Bit00":true,"ExEnCr":"1970-01-01T00:00:00"}]`);

        return data.map((row: any) => {
            const bitFields = Object.keys(row)
                .filter((key) => key.startsWith("Bit"))
                .reduce((acc: any, key) => {
                    acc[key] = row[key];
                    return acc;
                }, {});
            const SpsCfg = this.calculateSpsCfg(row);
            return {
                ProdTyp: row.ProdTyp,
                ...bitFields,
                SpsCfg,
                SpsCfgLiEnd: rezUtils.swapBytes(SpsCfg),
                ExEnCr: moment(row.ExEnCr).format('DD.MM.YYYY HH:mm:ss')
            };
        });
    }

    getMessages(): string[] {
        return this.messages;
    }
}

// Factory-Funktion
export async function rezSpsKonfig(anlagenNr: number): Promise<{ konfig: any[], messages: string[] }> {
    const instance = new RezSpsKonfig(anlagenNr);
    await instance.init();
    return {
        konfig: instance.getKonfig(),
        messages: instance.getMessages()
    };
}
