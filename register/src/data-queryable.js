import { DataAttributeResolver, instanceOf } from '@themost/data';
import { QueryField } from '@themost/query';
import { DataQueryable, DataExpandResolver } from '@themost/data';
import { SyncSeriesEventEmitter } from '@themost/events';

function resolveJoinMember(target) {
    return function onResolvingJoinMember(event) {
        /**
         * @type {Array}
         */
        let fullyQualifiedMember = event.fullyQualifiedMember.split('.');
        if (fullyQualifiedMember.length > 2) {
            // remove last element
            const last = fullyQualifiedMember.pop();
            fullyQualifiedMember = fullyQualifiedMember.reverse().concat(last);
        }
        const expr = DataAttributeResolver.prototype.resolveNestedAttribute.call(target, fullyQualifiedMember.join('/'));
        if (instanceOf(expr, QueryField)) {
            const member = expr.$name.split('.');
            Object.assign(event, {
                object: member[0],
                member: member[1]
            })
        }
    }
}

/**
 * @param {DataQueryable} target 
 */
function resolveMember(target) {
    /**
     * @param {member:string} event
     */
    return function onResolvingMember(event) {
        const collection = target.model.viewAdapter;
        const member = event.member.replace(new RegExp('^' + collection + '.'), '');
        /**
         * @type {import('@themost/data').DataAssociationMapping}
         */
        const mapping = target.model.inferMapping(member);
        if (mapping == null) {
            return;
        }
        /**
         * @type {import('@themost/data').DataField}
         */
        const attribute = target.model.getAttribute(member);
        if (attribute.multiplicity === 'ZeroOrOne') {
            let resolveMember = null;
            if (mapping.associationType === 'junction' && mapping.parentModel === self.name) {
                // expand child field
                resolveMember = attribute.name.concat('/', mapping.childField);
            } else if (mapping.associationType === 'junction' && mapping.childModel === self.name) {
                // expand parent field
                resolveMember = attribute.name.concat('/', mapping.parentField);
            } else if (mapping.associationType === 'association' && mapping.parentModel === target.model.name) {
                const associatedModel = target.model.context.model(mapping.childModel);
                resolveMember = attribute.name.concat('/', associatedModel.primaryKey);
            }
            if (resolveMember) {
                // resolve attribute
                const expr = DataAttributeResolver.prototype.resolveNestedAttribute.call(target, resolveMember);
                if (instanceOf(expr, QueryField)) {
                    event.member = expr.$name;
                }
            }
        }
        
    }
}
/**
 * @param {DataQueryable} query 
 */
function upgradeQuery(query) {
    if (query.resolvingMember == null) {
        query.resolvingJoinMember = new SyncSeriesEventEmitter();
        query.resolvingMember = new SyncSeriesEventEmitter();
        query.resolvingMethod = new SyncSeriesEventEmitter();
    }
    return query;
}

const superWhere = DataQueryable.prototype.where

/**
 * @this DataQueryable
 * @param {...*}
 * @returns 
 */
function where() {
    const args = Array.from(arguments);
    if (args.length && typeof args[0] === 'function') {
        const query = upgradeQuery(this.query);
        const onResolvingJoinMember = resolveJoinMember(this);
        query.resolvingJoinMember.subscribe(onResolvingJoinMember);
        const onResolvingMember = resolveMember(this);
        query.resolvingMember.subscribe(onResolvingMember);
        try {
            query.where.apply(query, args);
        } finally {
            query.resolvingJoinMember.unsubscribe(onResolvingJoinMember);
            query.resolvingMember.unsubscribe(onResolvingMember);
        }
        return this;
    }
    return superWhere.apply(this, args)
}

const superSelect = DataQueryable.prototype.select;

/**
 * @this DataQueryable
 * @param {...*}
 * @returns 
 */
function select() {
    const args = Array.from(arguments);
    if (typeof args[0] === 'function') {
        /**
         * @type {import("@themost/query").QueryExpression}
         */
        const query = upgradeQuery(this.query);
        const onResolvingJoinMember = resolveJoinMember(this);
        query.resolvingJoinMember.subscribe(onResolvingJoinMember);
        const onResolvingMember = resolveMember(this);
        query.resolvingMember.subscribe(onResolvingMember);
        try {
            query.select.apply(query, args);
        } finally {
            query.resolvingJoinMember.unsubscribe(onResolvingJoinMember);
            query.resolvingMember.unsubscribe(onResolvingMember);
        }
        return this;
    }
    return superSelect.apply(this, args)
}

const superOrderBy = DataQueryable.prototype.orderBy;

/**
 * @this DataQueryable
 * @param {...*}
 * @returns 
 */
function orderBy() {
    const args = Array.from(arguments);
    if (typeof args[0] === 'function') {
        /**
         * @type {import("@themost/query").QueryExpression}
         */
        const query = upgradeQuery(this.query);
        const onResolvingJoinMember = resolveJoinMember(this);
        query.resolvingJoinMember.subscribe(onResolvingJoinMember);
        const onResolvingMember = resolveMember(this);
        query.resolvingMember.subscribe(onResolvingMember);
        try {
            query.orderBy.apply(query, args);
        } finally {
            query.resolvingJoinMember.unsubscribe(onResolvingJoinMember);
            query.resolvingMember.unsubscribe(resolveMember);
        }
        return this;
    }
    return superOrderBy.apply(this, args)
}

const superThenBy = DataQueryable.prototype.thenBy;

/**
 * @this DataQueryable
 * @param {...*}
 * @returns 
 */
function thenBy() {
    const args = Array.from(arguments);
    if (typeof args[0] === 'function') {
        /**
         * @type {import("@themost/query").QueryExpression}
         */
        const query = upgradeQuery(this.query);
        const onResolvingJoinMember = resolveJoinMember(this);
        query.resolvingJoinMember.subscribe(onResolvingJoinMember);
        const onResolvingMember = resolveMember(this);
        query.resolvingMember.subscribe(onResolvingMember);
        try {
            query.thenBy.apply(query, args);
        } finally {
            query.resolvingJoinMember.unsubscribe(onResolvingJoinMember);
            query.resolvingMember.unsubscribe(resolveMember);
        }
        return this;
    }
    return superThenBy.apply(this, args)
}

const superOrderByDescending = DataQueryable.prototype.orderByDescending;

/**
 * @this DataQueryable
 * @param {...*}
 * @returns 
 */
function orderByDescending() {
    const args = Array.from(arguments);
    if (typeof args[0] === 'function') {
        /**
         * @type {import("@themost/query").QueryExpression}
         */
        const query = upgradeQuery(this.query);
        const onResolvingJoinMember = resolveJoinMember(this);
        query.resolvingJoinMember.subscribe(onResolvingJoinMember);
        const onResolvingMember = resolveMember(this);
        query.resolvingMember.subscribe(onResolvingMember);
        try {
            query.orderByDescending.apply(query, args);
        } finally {
            query.resolvingJoinMember.unsubscribe(onResolvingJoinMember);
            query.resolvingMember.unsubscribe(resolveMember);
        }
        return this;
    }
    return superOrderByDescending.apply(this, args)
}

const superThenByDescending = DataQueryable.prototype.thenByDescending;

/**
 * @this DataQueryable
 * @param {...*}
 * @returns 
 */
function thenByDescending() {
    const args = Array.from(arguments);
    if (typeof args[0] === 'function') {
        /**
         * @type {import("@themost/query").QueryExpression}
         */
        const query = upgradeQuery(this.query);
        const onResolvingJoinMember = resolveJoinMember(this);
        query.resolvingJoinMember.subscribe(onResolvingJoinMember);
        const onResolvingMember = resolveMember(this);
        query.resolvingMember.subscribe(onResolvingMember);
        try {
            query.thenByDescending.apply(query, args);
        } finally {
            query.resolvingJoinMember.unsubscribe(onResolvingJoinMember);
            query.resolvingMember.unsubscribe(resolveMember);
        }
        return this;
    }
    return superThenByDescending.apply(this, args)
}

const superGroupBy = DataQueryable.prototype.thenByDescending;

/**
 * @this DataQueryable
 * @param {...*}
 * @returns 
 */
function groupBy() {
    const args = Array.from(arguments);
    if (typeof args[0] === 'function') {
        /**
         * @type {import("@themost/query").QueryExpression}
         */
        const query = upgradeQuery(this.query);
        const onResolvingJoinMember = resolveJoinMember(this);
        query.resolvingJoinMember.subscribe(onResolvingJoinMember);
        const onResolvingMember = resolveMember(this);
        query.resolvingMember.subscribe(onResolvingMember);
        try {
            query.groupBy.apply(query, args);
        } finally {
            query.resolvingJoinMember.unsubscribe(onResolvingJoinMember);
            query.resolvingMember.unsubscribe(resolveMember);
        }
        return this;
    }
    return superGroupBy.apply(this, args)
}

const superExpand = DataQueryable.prototype.expand;

/**
 * @this DataQueryable
 * @param {...*}
 * @returns 
 */
function expand() {
    const args = Array.from(arguments);
    const self = this;
    if (typeof args[0] === 'function') {

        // clear select
        const onResolvingMember = function(event) {
            const member = event.member.split('.');
            self.expand(member[1]);
        };
        const onResolvingJoinMember = function(event) {
            /**
             * @type {string}
             */
            let member = event.fullyQualifiedMember;
            let index = member.lastIndexOf('.');
            while(index >= 0) {
                member = member.substring(0, index) + '($expand=' +  member.substring(index + 1, member.length) + ')'
                index = member.lastIndexOf('.');
            }
            const result = new DataExpandResolver().test(member);
            if (result && result.length) {
                self.expand(result[0]);
            }
        };
        /**
         * @type {import("@themost/query").QueryExpression}
         */
        const query = upgradeQuery(this.clone().query);
        try { 
            query.resolvingMember.subscribe(onResolvingMember);
            query.resolvingJoinMember.subscribe(onResolvingJoinMember);
            // check if last argument is closure parameters
            let params = null;
            if (typeof args[args.length - 1] !== 'function') {
                params = args.pop();
            }
            args.forEach(function(argument) {
                query.select.call(query, argument, params);
            });
        } finally {
            query.resolvingMember.unsubscribe(onResolvingMember);
            query.resolvingJoinMember.unsubscribe(onResolvingJoinMember);
        }
        return this;
    }
    return superExpand.apply(this, args)
}


if (superWhere != where) {
    Object.assign(DataQueryable.prototype, {
        where,
        select,
        orderBy,
        orderByDescending,
        thenBy,
        thenByDescending,
        groupBy,
        expand
    });
}