import {resolve} from 'path';
import {
    DataConfigurationStrategy,
    NamedDataContext,
    DataApplication,
    DataCacheStrategy
} from '@themost/data';

class TestApplication extends DataApplication {

    constructor() {
        super(__dirname);
       
        this.configuration.setSourceAt('adapterTypes', [
            {
                'name':'Sqlite Data Adapter', 
                'invariantName': 'sqlite',
                'type': '@themost/sqlite'
            }
        ]);
        this.configuration.setSourceAt('adapters', [
            { 
                'name': 'test',
                'invariantName': 'sqlite',
                'default':true,
                'options': {
                    database: resolve(__dirname, 'db/local.db')
                }
            }
        ]);
        // use data configuration strategy
        this.configuration.useStrategy(DataConfigurationStrategy, DataConfigurationStrategy);
    }

    createContext() {
        const adapters = this.configuration.getSourceAt('adapters');
        const adapter = adapters.find((item)=> {
            return item.default;
        });
        const context = new NamedDataContext(adapter.name);
        context.getConfiguration = () => {
            return this.configuration;
        };
        return context;
    }

    async finalize() {
        const service = this.getConfiguration().getStrategy(DataCacheStrategy);
        if (typeof service.finalize === 'function') {
            await service.finalize();
        }
    }

}

export {
    TestApplication
}
