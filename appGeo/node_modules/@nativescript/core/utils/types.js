export function isString(value) {
    return typeof value === 'string' || value instanceof String;
}
export function isNumber(value) {
    return typeof value === 'number' || value instanceof Number;
}
export function isBoolean(value) {
    return typeof value === 'boolean' || value instanceof Boolean;
}
export function isFunction(value) {
    if (!value) {
        return false;
    }
    return typeof value === 'function';
}
export function isObject(value) {
    if (!value) {
        return false;
    }
    return typeof value === 'object';
}
export function isUndefined(value) {
    return typeof value === 'undefined';
}
export function isDefined(value) {
    return typeof value !== 'undefined';
}
export function isNullOrUndefined(value) {
    return typeof value === 'undefined' || value === null;
}
export function verifyCallback(value) {
    if (value && !isFunction(value)) {
        throw new TypeError('Callback must be a valid function.');
    }
}
export function numberHasDecimals(value) {
    return !(value % 1 === 0);
}
export function numberIs64Bit(value) {
    return value < -Math.pow(2, 31) + 1 || value > Math.pow(2, 31) - 1;
}
const classInfosMap = new Map();
// ES3-5 type classes are "function blah()", new ES6+ classes can be "class blah"
const funcNameRegex = /(?:function|class)\s+(\w+).*/;
export function getClass(object) {
    return getClassInfo(object).name;
}
export function getClassInfo(object) {
    const constructor = object.constructor;
    let result = classInfosMap.get(constructor);
    if (!result) {
        result = new ClassInfo(constructor);
        classInfosMap.set(constructor, result);
    }
    return result;
}
export function getBaseClasses(object) {
    const result = [];
    let info = getClassInfo(object);
    while (info) {
        result.push(info.name);
        info = info.baseClassInfo;
    }
    return result;
}
export class ClassInfo {
    constructor(typeConstructor) {
        this._typeConstructor = typeConstructor;
    }
    get name() {
        if (!this._name) {
            if (this._typeConstructor.name) {
                this._name = this._typeConstructor.name;
            }
            else {
                const results = funcNameRegex.exec(this._typeConstructor.toString());
                this._name = results && results.length > 1 ? results[1] : '';
            }
        }
        return this._name;
    }
    get baseClassInfo() {
        if (isUndefined(this._baseClassInfo)) {
            this._baseClassInfo = ClassInfo._getBase(this);
            // While extending some classes for platform specific versions results in duplicate class types in hierarchy.
            if (this._baseClassInfo && this._baseClassInfo.name === this.name) {
                this._baseClassInfo = ClassInfo._getBase(this._baseClassInfo);
            }
        }
        return this._baseClassInfo;
    }
    static _getBase(info) {
        let result = null;
        const constructorProto = info._typeConstructor.prototype;
        if (constructorProto.__proto__) {
            result = getClassInfo(constructorProto.__proto__);
        }
        return result;
    }
}
export function toUIString(obj) {
    return isNullOrUndefined(obj) ? '' : obj + '';
}
//# sourceMappingURL=types.js.map