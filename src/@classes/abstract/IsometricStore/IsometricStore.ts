import { Store } from '../../../@store/index.ts';

export abstract class IsometricStore {

    protected dataStore: Store = null!;

    public get data(): Store {
        return this.dataStore;
    }

    public set data(store: Store) {
        this.dataStore = store;
    }
}