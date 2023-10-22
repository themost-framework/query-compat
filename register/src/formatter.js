import { SqlFormatter } from '@themost/query';
import { sprintf } from 'sprintf-js';

const superFormatFieldEx = SqlFormatter.prototype.formatFieldEx;

/**
 * @param {*} obj
 * @param {string} format
 * @this QueryExpression
 */
function formatFieldEx(obj, format) {
    if (obj == null) {
        return null;
    }
    const prop = Object.key(obj);
    if (/^\$/.test(prop)) {
        if (typeof this[prop] === 'function') {
            const formatFunc = this[prop];
            const args = obj[prop];
            if (Array.isArray(args)) {
                return formatFunc.apply(this, args);
            } else {
                return formatFunc.call(this, args);
            }
        }
    } else {
        const innerObj = obj[prop];
        const key = Object.key(innerObj);
        const useAlias = (format === '%f');
        if (key === '$name') {
            if (/\.\*$/.test(innerObj.$name)) {
                return this.escapeName(innerObj.$name);
            }
            const sql = (this.settings.forceAlias && useAlias) ? this.escapeName(innerObj.$name).concat(' AS ', this.escapeName(prop)) : this.escapeName(innerObj.$name);
            return sql;
        } else if (key === '$literal') {
            return (this.settings.forceAlias && useAlias) ? this.escape(innerObj.$literal).concat(' AS ', this.escapeName(prop)) : this.escapeName(innerObj.$literal);   
        } else if (key === '$getField') {
            return (this.settings.forceAlias && useAlias) ? this.escape(innerObj.$getField).concat(' AS ', this.escapeName(prop)) : this.escapeName(innerObj.$getField);
        } else {
            const formatFunc = this[key];
            if (typeof formatFunc === 'function') {
                const args = innerObj[key];
                /**
                 * @type {string}
                 */
                const expr = Array.isArray(args) ? formatFunc.apply(this, args): formatFunc.call(this, args);
                return (this.settings.forceAlias && useAlias) ? expr.concat(' AS ', this.escapeName(prop)) : expr;
            }
        }
    }
    return superFormatFieldEx.call(this, obj, format);
}

function $eq(left, right) {
    if (right == null) {
        return sprintf('%s IS NULL', this.escape(left));
    }
    if (Object.prototype.hasOwnProperty.call(right, '$value') && right.$value == null) {
        return sprintf('%s IS NULL', this.escape(left));
    }
    if (Array.isArray(right)) {
        return this.$in(left, right);
    }
    return sprintf('%s = %s', this.escape(left), this.escape(right));
}

function $ne(left, right) {
    if (right == null) {
        return sprintf('(NOT %s IS NULL)', this.escape(left));
    }
    if (Object.prototype.hasOwnProperty.call(right, '$value') && right.$value == null) {
        return sprintf('(NOT %s IS NULL)', this.escape(left));
    }
    if (Array.isArray(right)) {
        return this.$nin(left, right);
    }
    return sprintf('(NOT %s = %s)', this.escape(left), this.escape(right));
}

function $gt(left, right) {
    return sprintf('%s > %s', this.escape(left), this.escape(right));
}

function $gte(left, right) {
    return sprintf('%s >= %s', this.escape(left), this.escape(right));
}
function $lt(left, right) {
    return sprintf('%s < %s', this.escape(left), this.escape(right));
}

function  $lte(left, right) {
    return sprintf('%s <= %s', this.escape(left), this.escape(right));
}
function $in(left, right) {
    let leftOperand = this.escape(left);
    if (right == null) {
        return sprintf('%s IS NULL', leftOperand);
    }
    if (Array.isArray(right)) {
        if (right.length === 0) {
            return sprintf('%s IS NULL', leftOperand);
        }
        let self = this;
        let values = right.map(function (x) {
            return self.escape(x);
        });
        let rightOperand = values.join(', ');
        return sprintf('%s IN (%s)', leftOperand, rightOperand);
    }
    throw new Error('Invalid in expression. Right operand must be an array');
}
function  $nin(left, right) {
    let leftOperand = this.escape(left);
    if (right == null) {
        return sprintf('NOT %s IS NULL', leftOperand);
    }
    if (Array.isArray(right)) {
        if (right.length === 0) {
            return sprintf('NOT %s IS NULL', leftOperand);
        }
        let self = this;
        let values = right.map(function (x) {
            return self.escape(x);
        });
        let rightOperand = values.join(', ');
        return sprintf('NOT %s IN (%s)', leftOperand, rightOperand);
    }
    throw new Error('Invalid in expression. Right operand must be an array');
}

/**
 * @param {...*} args
 * @returns {string}
 */
function $or() {
    const args = Array.from(arguments);
    if (args.length < 2) {
        throw new Error('A logical expression must have at least two operands.')
    }
    let sql = '(';
    sql += args.map((value) => {
        return this.formatWhere(value);
    }).join(' OR ');
    sql += ')';
    return sql;
}

/**
 * @param {...*} args
 * @returns {string}
 */
// eslint-disable-next-line no-unused-vars
function $and() {
    const args = Array.from(arguments);
    if (args.length < 2) {
        throw new Error('A logical expression must have at least two operands.')
    }
    let sql = '(';
    sql += args.map((value) => {
        return this.formatWhere(value);
    }).join(' AND ');
    sql += ')';
    return sql;
}

/**
 * @param {...*} args
 * @returns {string}
 */
function $not(arg) {
    let sql = '(NOT ';
    sql += this.formatWhere(arg);
    sql += ')';
    return sql;
}

const superFormatWhere = SqlFormatter.prototype.formatWhere;

/**
 * @this QueryExpression
 * @param {*} where 
 * @returns 
 */
function formatWhere(where) {
    const op = Object.key(where);
    if (/^\$(eq|ne|lte|lt|gte|gt|in|nin|and|or|not)$/g.test(op)) {
        const formatFunc = this[op];
        return formatFunc.apply(this, where[op])
    }
    return superFormatWhere.call(this, where);
}

const superEscape = SqlFormatter.prototype.escape;

/**
 * @this QueryExpression
 * @param {*} value 
 * @param {*} unquoted 
 */
function escape(value,unquoted) {
    if (value != null && Object.prototype.hasOwnProperty.call(value, '$literal')) {
        return this.escape(value.$literal);   
    }
    if (value != null && typeof value === 'object') {
        const keys = Object.keys(value);
        const key0 = keys[0];
        if (keys.length === 1 && /^\$/.test(key0)) {
            const escapeFunc = this[key0];
            if (typeof escapeFunc === 'function') {
                const args = value[key0];
                if (Array.isArray(args)) {
                    return escapeFunc.apply(this, args);
                }
            }
        }
    }
    return superEscape.call(this, value, unquoted);
}

function $avg(arg) {
    return sprintf('AVG(%s)', typeof arg === 'string' ? this.escapeName(arg) : this.escape(arg));
}
function $min(arg) {
    return sprintf('MIN(%s)', typeof arg === 'string' ? this.escapeName(arg) : this.escape(arg));
}
function $max(arg) {
    return sprintf('MAX(%s)', typeof arg === 'string' ? this.escapeName(arg) : this.escape(arg));
}
function $sum(arg) {
    return sprintf('SUM(%s)', typeof arg === 'string' ? this.escapeName(arg) : this.escape(arg));
}
function $count(arg) {
    return sprintf('COUNT(%s)', typeof arg === 'string' ? this.escapeName(arg) : this.escape(arg));
}

if (superFormatFieldEx != formatFieldEx) {
    Object.assign(SqlFormatter.prototype, {
        formatFieldEx,
        formatWhere,
        escape,
        $or,
        $and,
        $not,
        $eq,
        $ne,
        $gt,
        $gte,
        $lt,
        $lte,
        $in,
        $nin,
        $avg,
        $min,
        $max,
        $count,
        $sum
    });
}

