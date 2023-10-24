// eslint-disable-next-line no-unused-vars
import { DataModel, DataQueryable } from '@themost/data';

/**
 * @this DataModel
 * @param {*} params 
 * @returns {Promise<DataQueryable>}
 */
function filterAsync(params) {
    return this.filter(params);
}

Object.assign(DataModel.prototype, {
    filterAsync
});