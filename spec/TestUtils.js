/**
 * @description An error for cancelling transaction in testing environments
 */
// eslint-disable-next-line no-unused-vars
import {DataApplication} from '@themost/data';
// eslint-disable-next-line no-unused-vars
import {DataCacheFinalize, DataCacheStrategy} from '@themost/data';

class CancelTransactionError extends Error {
    constructor() {
        super();
    }
}

class TestUtils {
    /**
     * Wraps DataAdapter.executeInTransaction() for using in testing environments
     * @param {DataApplication} context
     * @param {Function} func
     * @returns {Promise<any>}
     */
    static executeInTransaction(context, func) {
        return new Promise((resolve, reject) => {
            // clear cache
            const configuration = context.getConfiguration();
            Object.defineProperty(configuration, 'cache', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: { }
            });
            // start transaction
            context.db.executeInTransaction((cb) => {
                try {
                    func().then(() => {
                        return cb(new CancelTransactionError());
                    }).catch((err) => {
                        return cb(err);
                    });
                }
                catch (err) {
                    return cb(err);
                }

            }, (err) => {
                // if error is an instance of CancelTransactionError
                if (err && err instanceof CancelTransactionError) {
                    return resolve();
                }
                if (err) {
                    return reject(err);
                }
                // exit
                return resolve();
            });
        });
    }

    static async finalize(app) {
        if (app == null) {
            return;
        }
        const service = app.getConfiguration().getStrategy(DataCacheStrategy);
        if (typeof service.finalize === 'function') {
            await service.finalize();
        }
    }

    static cancelTransaction() {
        throw new CancelTransactionError();
    }
}

export {
    CancelTransactionError,
    TestUtils
}