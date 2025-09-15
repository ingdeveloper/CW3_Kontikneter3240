import { rezDlgKonfig } from './rezDlgKonfig';

// Cache als Map
const konfigCache = new Map<number, { konfig: IRezDlgKonfig }>();

export async function getCachedDlgKonfig(anlagenNr: number = 0): Promise<{ konfig: IRezDlgKonfig, messages: string[] }> {
    if (konfigCache.has(anlagenNr)) {
        console.log(`Cache-Hit DlgKonfig für anlagenNr = ${anlagenNr}`);
        return { konfig: konfigCache.get(anlagenNr)!.konfig, messages: [] };
    }

    console.log(`Cache-Miss DlgKonfig für anlagenNr = ${anlagenNr} – lade neu`);
    const result = await rezDlgKonfig(anlagenNr);
    konfigCache.set(anlagenNr, { konfig: result.konfig });
    return { konfig: result.konfig, messages: result.messages };
}
