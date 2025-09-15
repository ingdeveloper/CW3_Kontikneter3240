import { rezSpsKonfig } from './rezSpsKonfig';

// Cache als Map
const konfigCache = new Map<number, { konfig: any, messages: string[] }>();

export async function getCachedSpsKonfig(anlagenNr: number = 0): Promise<{ konfig: any, messages: string[] }> {
    if (konfigCache.has(anlagenNr)) {
        console.log(`Cache-Hit SpsKonfig für anlagenNr = ${anlagenNr}`);
        return konfigCache.get(anlagenNr)!;
    }

    console.log(`Cache-Miss SpsKonfig für anlagenNr = ${anlagenNr} – lade neu`);
    const result = await rezSpsKonfig(anlagenNr);
    konfigCache.set(anlagenNr, result);
    return result;
}
