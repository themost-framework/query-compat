import { QueryExpression } from '@themost/query';
import { ClosureParser } from '@themost/query-compat/closures';
import { SyncSeriesEventEmitter } from '@themost/events';

/**
 * @this QueryExpression
 * @returns {ClosureParser}
 */
function getClosureParser() {

    if (this.resolvingMember == null) {
        this.resolvingMember = new SyncSeriesEventEmitter();
        this.resolvingJoinMember = new SyncSeriesEventEmitter();
        this.resolvingMethod = new SyncSeriesEventEmitter();
        this.resolvingMember.subscribe((event) => {
            if (this.$collection) {
                event.member = this.$collection.concat('.', event.member);
            }
        });
        this.resolvingJoinMember.subscribe((event) => {
            if (this.$joinCollection != null && event.object == null) {
                event.object = this.$joinCollection;
            }
        });
    }

    const closureParser = new ClosureParser();
    // register sync hooks
    closureParser.resolvingMember.subscribe((event) => {
        const newEvent = {
            target: this,
            member: event.member
        };
        this.resolvingMember.emit(newEvent);
        event.member = newEvent.member
    });
    closureParser.resolvingJoinMember.subscribe((event) => {
        const newEvent = {
            target: this,
            object: event.object || this.$joinCollection,
            member: event.member,
            fullyQualifiedMember: event.fullyQualifiedMember
        };
        this.resolvingJoinMember.emit(newEvent);
        event.member = newEvent.member;
        if (event.object !== newEvent.object) {
            event.object = newEvent.object;
        }
    });
    closureParser.resolvingMethod.subscribe((event) => {
        const newEvent = {
            target: this,
            method: event.method
        };
        this.resolvingMethod.emit(newEvent);
        event.method = newEvent.method
    });
    return closureParser;
}

const superFrom = QueryExpression.prototype.from;

/**
 * @this QueryExpression
 * @param {*} entity 
 */
function from(entity) {
    superFrom.call(this, entity);
    let collectionName;
    if (this.$ref) {
        collectionName = Object.key(this.$ref);
    } else if (typeof entity === 'string') {
        collectionName = entity
    }
    if (collectionName == null) {
        throw new Error('Query collection name cannot be determined');
    }
    Object.defineProperty(this, '$collection', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: collectionName
    });
    if (this._selectClosure != null) {
        // parse select closure
        this.select.apply(this, this._selectClosure);
        // remove it and continue
        delete this._selectClosure;
    }
    return this;
}

const superWhere = QueryExpression.prototype.where;

/**
 * @this QueryExpression
 * @returns {QueryExpression}
 */
function where(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = this.getClosureParser();
        this.$where = closureParser.parseFilter.apply(closureParser, args);
        return this;
    }
    return superWhere.apply(this, args);
}

const superSelect = QueryExpression.prototype.select;

/**
 * @param {...*} args
 * @this QueryExpression
 * @returns {QueryExpression}
 */
function select(...args) {
    if (typeof args[0] === 'function') {
        if (this.$collection == null) {
            // hold select closure to process them after from() clause
            Object.defineProperty(this, '_selectClosure', {
                configurable: true,
                enumerable: false,
                value: args,
                writable: true
            });
            return this;
        }
        const closureParser = this.getClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superSelect.apply(this, fields);
    }
    return superSelect.apply(this, args);
}

const superOrderBy = QueryExpression.prototype.orderBy;

/**
 * @param {...*} args
 * @this QueryExpression
 * @returns {QueryExpression}
 */
function orderBy(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = this.getClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superOrderBy.apply(this, fields);
    }
    return superOrderBy.apply(this, args);
}

const superOrderByDescending = QueryExpression.prototype.orderByDescending;

/**
 * @param {...*} args
 * @this QueryExpression
 * @returns {QueryExpression}
 */
function orderByDescending(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = this.getClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superOrderByDescending.apply(this, fields);
    }
    return superOrderByDescending.apply(this, args);
}

const superThenBy = QueryExpression.prototype.thenBy;

/**
 * @param {...*} args
 * @this QueryExpression
 * @returns {QueryExpression}
 */
function thenBy(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = this.getClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superThenBy.apply(this, fields);
    }
    return superThenBy.apply(this, args);
}

const superThenByDescending = QueryExpression.prototype.thenByDescending;

/**
 * @param {...*} args
 * @this QueryExpression
 * @returns {QueryExpression}
 */
function thenByDescending(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = this.getClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superThenByDescending.apply(this, fields);
    }
    return superThenByDescending.apply(this, args);
}

const superGroupBy = QueryExpression.prototype.groupBy;

/**
 * @param {...*} args
 * @this QueryExpression
 * @returns {QueryExpression}
 */
function groupBy(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = this.getClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superGroupBy.apply(this, fields);
    }
    return superGroupBy.apply(this, args);
}

/**
 * @this QueryExpression
 * @returns QueryExpression
 */
function leftJoin() {
    let args = Array.from(arguments);
    this.join.apply(this, args);
    if (this.privates.expand && this.privates.expand.$entity) {
        this.privates.expand.$entity.$join = 'left';
    }
    return this;
}

/**
 * @this QueryExpression
 * @returns QueryExpression
 */
function rightJoin() {
    let args = Array.from(arguments);
    this.join.apply(this, args);
    if (this.privates.expand && this.privates.expand.$entity) {
        this.privates.expand.$entity.$join = 'right';
    }
    return this;
}

const superJoin = QueryExpression.prototype.join;

/**
 * @this QueryExpression
 */
function join() {
    superJoin.apply(this, Array.from(arguments));
    let collectionName;
    if (this.privates.expand.$entity.$as != null) {
        collectionName = this.privates.expand.$entity.$as;
    } else if (typeof this.privates.expand.$entity.name === 'function') {
        collectionName = this.privates.expand.$entity.name();
    }
    Object.defineProperty(this, '$joinCollection', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: collectionName
    });
    return this;
}

const superWith = QueryExpression.prototype.with;

/**
 * @this QueryExpression
 * @returns {QueryExpression}
 */
function _with(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = this.getClosureParser();
        superWith.call(this, closureParser.parseFilter.apply(closureParser, args));
    } else {
        superWith.apply(this, args);
    }
    delete this.$joinCollection;
    return this;
}


if (superWhere != where) {
    Object.assign(QueryExpression.prototype, {
        from,
        getClosureParser,
        where,
        join,
        leftJoin,
        rightJoin,
        select,
        orderBy,
        orderByDescending,
        thenBy,
        thenByDescending,
        groupBy
    });
    // an exception because "with" is a reserved word
    QueryExpression.prototype.with = _with;
}
