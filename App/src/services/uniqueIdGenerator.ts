class UniqueIdGenerator {
    private static ids: number[] = [];

    static generateId = (namespace: string) => {
        UniqueIdGenerator.ids[namespace] = (UniqueIdGenerator.ids[namespace] || 0) + 1;
        return namespace + UniqueIdGenerator.ids[namespace];
    }
}

export = UniqueIdGenerator;