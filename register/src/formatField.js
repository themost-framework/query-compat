import { SqlFormatter } from '@themost/query';

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
    }
    return superFormatFieldEx.call(this, obj, format);
}

if (superFormatFieldEx != formatFieldEx) {
    SqlFormatter.prototype.formatFieldEx = formatFieldEx;
}