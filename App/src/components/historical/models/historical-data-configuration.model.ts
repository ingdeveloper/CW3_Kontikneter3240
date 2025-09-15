export interface IHistoricalDataConfiguration<T> {
    id?: string;
    userId: string;
    name: string;
    namespace: string;
    owner: string;
    createdOn: Date;
    configuration: T;
    controlType: number;
    version: number;
}

export interface IHistoricalDataConfigurationService {
    listAsync<T>(namespace: string): Promise<IHistoricalDataConfiguration<T>[]>;
    getAsync<T>(name: string, namespace?: string): Promise<IHistoricalDataConfiguration<T>>;
    createAsync<T>(name: string, configuration: T, namespace?: string): Promise<void>;
    updateAsync<T>(name: string, configuration: T, namespace?: string): Promise<void>;
    deleteAsync(name: string, namespace?: string): Promise<void>;
    deleteAsync(id: string): Promise<void>;
}