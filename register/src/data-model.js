// eslint-disable-next-line no-unused-vars
import { DataModel, DataQueryable, DataFilterResolver } from '@themost/data';
import { OpenDataParser } from '@themost/query-compat';
import { DataExpandResolver } from './data-expand-resolver';
import { DataAttributeResolver } from './data-attribute-resolver';
/**
 * @this DataQueryable
 */
function filter(params, callback) {
    const self = this;
    const parser = new OpenDataParser();
    let $joinExpressions = [];
    let view;
    let selectAs = [];
    // eslint-disable-next-line no-unused-vars
    parser.resolveMember = function(member, cb) {
        // resolve view
        let attr = self.field(member);
        if (attr) {
            member = attr.name;
            if (attr.multiplicity === 'ZeroOrOne') {
                let mapping1 = self.inferMapping(member);
                if (mapping1 && mapping1.associationType === 'junction' && mapping1.parentModel === self.name) {
                    member = attr.name.concat('/', mapping1.childField);
                    selectAs.push({
                        member: attr.name.concat('.', mapping1.childField),
                        alias: attr.name
                    });
                } else if (mapping1 && mapping1.associationType === 'junction' && mapping1.childModel === self.name) {
                    member = attr.name.concat('/', mapping1.parentField);
                    selectAs.push({
                        member: attr.name.concat('.', mapping1.parentField),
                        alias: attr.name
                    });
                } else if (mapping1 && mapping1.associationType === 'association' && mapping1.parentModel === self.name) {
                    let associatedModel = self.context.model(mapping1.childModel);
                    const primaryKey = associatedModel.attributes.find((x) => x.primary === true);
                    member = attr.name.concat('/', primaryKey.name);
                    selectAs.push({
                        member: attr.name.concat('.', primaryKey.name),
                        alias: attr.name
                    });
                }
            }
        }
        if (DataAttributeResolver.prototype.testNestedAttribute.call(self,member)) {
            try {
                let member1 = member.split('/'),
                    mapping = self.inferMapping(member1[0]),
                    expr;
                if (mapping && mapping.associationType === 'junction') {
                    let expr1 = DataAttributeResolver.prototype.resolveJunctionAttributeJoin.call(self, member);
                    expr = {
                        $expand: expr1.$expand
                    };
                    //replace member expression
                    member = expr1.$select.$name.replace(/\./g,'/');
                }
                else {
                    expr = DataAttributeResolver.prototype.resolveNestedAttributeJoin.call(self, member);
                    if (expr.$select) {
                        member = expr.$select.$name.replace(/\./g,'/');
                    }
                }
                if (expr && expr.$expand) {
                    let arrExpr = [];
                    if (Array.isArray(expr.$expand)) {
                        arrExpr.push.apply(arrExpr, expr.$expand);
                    } else {
                        arrExpr.push(expr.$expand);
                    }
                    arrExpr.forEach(function(y) {
                        let joinExpr = $joinExpressions.find(function(x) {
                            if (x.$entity && x.$entity.$as) {
                                return (x.$entity.$as === y.$entity.$as);
                            }
                            return false;
                        });
                        if (joinExpr == null)
                            $joinExpressions.push(y);
                    });
                }
            }
            catch (err) {
                cb(err);
                return;
            }
        }
        if (typeof self.resolveMember === 'function')
            self.resolveMember.call(self, member, cb);
        else
            DataFilterResolver.prototype.resolveMember.call(self, member, cb);
    };
    parser.resolveMethod = function(name, args, cb) {
        if (typeof self.resolveMethod === 'function')
            self.resolveMethod.call(self, name, args, cb);
        else
            DataFilterResolver.prototype.resolveMethod.call(self, name, args, cb);
    };
    let filter;

    if ((params instanceof DataQueryable) && (self.name === params.model.name)) {
        let q = new DataQueryable(self);
        Object.assign(q, params);
        Object.assign(q.query, params.query);
        return callback(null, q);
    }

    if (typeof params === 'string') {
        filter = params;
    }
    else if (typeof params === 'object') {
        filter = params.$filter;
    }

    try {

        let top = parseInt(params.$top || params.$take, 10);
        let skip = parseInt(params.$skip, 10);
        let levels = parseInt(params.$levels, 10)
        let queryOptions = {
            $filter: filter,
            $select:  params.$select,
            $orderBy: params.$orderby || params.$orderBy || params.$order,
            $groupBy: params.$groupby || params.$groupBy || params.$group,
            $top: isNaN(top) ? 0 : top,
            $skip: isNaN(skip) ? 0 : skip,
            $levels: isNaN(levels) ? -1 : levels
        };

        void parser.parseQueryOptions(queryOptions,
        /**
         * @param {Error=} err 
         * @param {{$where?:*,$order?:*,$select?:*,$group?:*}} query 
         * @returns {void}
         */ 
        function(err, query) {
            try {
                if (err) {
                    callback(err);
                } else {
                    // create an instance of data queryable
                    let q = new DataQueryable(self);
                    if (query.$select) {
                        if (q.query.$select == null) {
                            q.query.$select = {};
                        }
                        let collection = q.query.$collection;
                        // validate the usage of a data view
                        if (Array.isArray(query.$select) && query.$select.length === 1) {
                            let reTrimCollection = new RegExp('^' + collection + '.', 'ig');
                            for (let index = 0; index < query.$select.length; index++) {
                                let element = query.$select[index];
                                if (Object.prototype.hasOwnProperty.call(element, '$name')) {
                                    // get attribute name
                                    if (typeof element.$name === 'string') {
                                        view = self.dataviews(element.$name.replace(reTrimCollection, ''));
                                        if (view != null) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        // resolve a backward compatibility issue
                        // convert select attributes which define an association to expandable attributes
                        if (Array.isArray(query.$select)) {
                            let removeCollectionRegex = new RegExp('^' + collection + '.', 'ig');
                            for (let index = 0; index < query.$select.length; index++) {
                                let selectElement = query.$select[index];
                                if (Object.prototype.hasOwnProperty.call(selectElement, '$name')) {
                                    // get attribute name
                                    if (typeof selectElement.$name === 'string') {
                                        let selectAttributeName= selectElement.$name.replace(removeCollectionRegex, '');
                                        let selectAttribute = self.getAttribute(selectAttributeName);
                                        if (selectAttribute && selectAttribute.many) {
                                            // expand attribute
                                            q.expand(selectAttributeName);
                                            // and 
                                            query.$select.splice(index, 1);
                                            index -= 1;
                                        }
                                    }
                                }
                            }
                        }
                        if (view != null) {
                            // select view
                            q.select(view.name)
                        } else {
                            if (Array.isArray(query.$select)) {
                                // validate aliases found by resolveMember
                                if (selectAs.length > 0) {
                                    for (let index = 0; index < query.$select.length; index++) {
                                        let element1 = query.$select[index];
                                        if (Object.prototype.hasOwnProperty.call(element1, '$name')) {
                                            if (typeof element1.$name === 'string') {
                                                let item = selectAs.find(function(x) {
                                                    return x.member === element1.$name;
                                                });
                                                if (item != null) {
                                                    // add original name as alias
                                                    Object.defineProperty(element1, item.alias, {
                                                        configurable: true,
                                                        enumerable: true,
                                                        value: {
                                                            $name: element1.$name
                                                        }
                                                    });
                                                    // and delete $name property
                                                    delete element1.$name;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            // otherwise, format $select attribute
                            Object.defineProperty(q.query.$select, collection, {
                                configurable: true,
                                enumerable: true,
                                writable: true,
                                value: query.$select
                            });
                        }
                       
                    }
                    if (query.$where) {
                        q.query.$where = query.$where;
                    }
                    if (query.$order) {
                        q.query.$order = query.$order;
                    }
                    if (query.$group) {
                        q.query.$group = query.$group;
                    }
                    // assign join expressions
                    if ($joinExpressions.length>0) {
                        q.query.$expand = $joinExpressions;
                    }
                    // prepare query
                    q.query.prepare();
                    // set levels
                    if (queryOptions.$levels >= 0) {
                        q.levels(queryOptions.$levels);
                    }
                    if (queryOptions.$top > 0) {
                        q.take(queryOptions.$top);
                    }
                    if (queryOptions.$skip > 0) {
                        q.skip(queryOptions.$skip);
                    }
                    // set caching
                    if (typeof params === 'object' && params.$cache === true && self.caching === 'conditional') {
                        q.cache(true);
                    }
                    // set expand
                    if (typeof params === 'object' && params.$expand != null) {
                        let matches = new DataExpandResolver().testExpandExpression(params.$expand);
                        if (matches && matches.length>0) {
                            q.expand.apply(q, matches);
                        }
                    }
                    return callback(null, q);
                }
            } catch (error) {
                return callback(error);
            }
        });
    }
    catch(e) {
        return callback(e);
    }
}

/**
 * @this DataModel
 * @param {*} params 
 * @returns {Promise<DataQueryable>}
 */
function filterAsync(params) {
    return new Promise((resolve, reject) => {
        filter.call(this, params, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        })
    });
}

Object.assign(DataModel.prototype, {
    filter,
    filterAsync
});