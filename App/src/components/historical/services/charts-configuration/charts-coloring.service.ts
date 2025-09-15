declare var uuid;

export class ChartsColoringService {

    private static readonly DefaultSheme: ReadonlyArray<string> = ["#fdb36b", "#f4744c", "#d9342b", "#a00025", "#780000", "#c6e9f2", "#7ec5e0", "#5298c6", "#3d689f", "#2c3188", "#daef8d", "#a5d967", "#61ba5e", "#188848", "#006436"];

    public static GetColor(name: string = uuid.v4(), secondary: string = "") {
        const hash = ChartsColoringService.hashEntry(name, secondary);
        const index = hash % ChartsColoringService.DefaultSheme.length;
        return ChartsColoringService.DefaultSheme[index];
    }

    private static hashEntry(name: string = uuid.v4(), secondary: string = "") {
        const entryString = `${name.toString()}|${secondary.toString()}`
        let hash = 0;
        for (let i = 0; i < entryString.length; i++) {
            const charCode = entryString.charCodeAt(i);
            hash += charCode;
        }
        return hash;
    }

}