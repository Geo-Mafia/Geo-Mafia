let _wrappedIndex = 0;
export class WrappedValue {
    constructor(wrapped) {
        this.wrapped = wrapped;
    }
    static unwrap(value) {
        return value instanceof WrappedValue ? value.wrapped : value;
    }
    static wrap(value) {
        const w = _wrappedValues[_wrappedIndex++ % 5];
        w.wrapped = value;
        return w;
    }
}
const _wrappedValues = [new WrappedValue(null), new WrappedValue(null), new WrappedValue(null), new WrappedValue(null), new WrappedValue(null)];
const _globalEventHandlers = {};
export class Observable {
    constructor() {
        this._observers = {};
    }
    get(name) {
        return this[name];
    }
    set(name, value) {
        // TODO: Parameter validation
        const oldValue = this[name];
        if (this[name] === value) {
            return;
        }
        const newValue = WrappedValue.unwrap(value);
        this[name] = newValue;
        this.notifyPropertyChange(name, newValue, oldValue);
    }
    setProperty(name, value) {
        const oldValue = this[name];
        if (this[name] === value) {
            return;
        }
        this[name] = value;
        this.notifyPropertyChange(name, value, oldValue);
        const specificPropertyChangeEventName = name + 'Change';
        if (this.hasListeners(specificPropertyChangeEventName)) {
            const eventData = this._createPropertyChangeData(name, value, oldValue);
            eventData.eventName = specificPropertyChangeEventName;
            this.notify(eventData);
        }
    }
    on(eventNames, callback, thisArg) {
        this.addEventListener(eventNames, callback, thisArg);
    }
    once(event, callback, thisArg) {
        if (typeof event !== 'string') {
            throw new TypeError('Event must be string.');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be function.');
        }
        const list = this._getEventList(event, true);
        list.push({ callback, thisArg, once: true });
    }
    off(eventNames, callback, thisArg) {
        this.removeEventListener(eventNames, callback, thisArg);
    }
    addEventListener(eventNames, callback, thisArg) {
        if (typeof eventNames !== 'string') {
            throw new TypeError('Events name(s) must be string.');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be function.');
        }
        const events = eventNames.split(',');
        for (let i = 0, l = events.length; i < l; i++) {
            const event = events[i].trim();
            const list = this._getEventList(event, true);
            // TODO: Performance optimization - if we do not have the thisArg specified, do not wrap the callback in additional object (ObserveEntry)
            list.push({
                callback: callback,
                thisArg: thisArg,
            });
        }
    }
    removeEventListener(eventNames, callback, thisArg) {
        if (typeof eventNames !== 'string') {
            throw new TypeError('Events name(s) must be string.');
        }
        if (callback && typeof callback !== 'function') {
            throw new TypeError('callback must be function.');
        }
        const events = eventNames.split(',');
        for (let i = 0, l = events.length; i < l; i++) {
            const event = events[i].trim();
            if (callback) {
                const list = this._getEventList(event, false);
                if (list) {
                    const index = Observable._indexOfListener(list, callback, thisArg);
                    if (index >= 0) {
                        list.splice(index, 1);
                    }
                    if (list.length === 0) {
                        delete this._observers[event];
                    }
                }
            }
            else {
                this._observers[event] = undefined;
                delete this._observers[event];
            }
        }
    }
    static on(eventName, callback, thisArg) {
        this.addEventListener(eventName, callback, thisArg);
    }
    static once(eventName, callback, thisArg) {
        if (typeof eventName !== 'string') {
            throw new TypeError('Event must be string.');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be function.');
        }
        const eventClass = this.name === 'Observable' ? '*' : this.name;
        if (!_globalEventHandlers[eventClass]) {
            _globalEventHandlers[eventClass] = {};
        }
        if (!Array.isArray(_globalEventHandlers[eventClass][eventName])) {
            _globalEventHandlers[eventClass][eventName] = [];
        }
        _globalEventHandlers[eventClass][eventName].push({ callback, thisArg, once: true });
    }
    static off(eventName, callback, thisArg) {
        this.removeEventListener(eventName, callback, thisArg);
    }
    static removeEventListener(eventName, callback, thisArg) {
        if (typeof eventName !== 'string') {
            throw new TypeError('Event must be string.');
        }
        if (callback && typeof callback !== 'function') {
            throw new TypeError('callback must be function.');
        }
        const eventClass = this.name === 'Observable' ? '*' : this.name;
        // Short Circuit if no handlers exist..
        if (!_globalEventHandlers[eventClass] || !Array.isArray(_globalEventHandlers[eventClass][eventName])) {
            return;
        }
        const events = _globalEventHandlers[eventClass][eventName];
        if (thisArg) {
            for (let i = 0; i < events.length; i++) {
                if (events[i].callback === callback && events[i].thisArg === thisArg) {
                    events.splice(i, 1);
                    i--;
                }
            }
        }
        else if (callback) {
            for (let i = 0; i < events.length; i++) {
                if (events[i].callback === callback) {
                    events.splice(i, 1);
                    i--;
                }
            }
        }
        else {
            // Clear all events of this type
            delete _globalEventHandlers[eventClass][eventName];
        }
        if (events.length === 0) {
            // Clear all events of this type
            delete _globalEventHandlers[eventClass][eventName];
        }
        // Clear the primary class grouping if no events are left
        const keys = Object.keys(_globalEventHandlers[eventClass]);
        if (keys.length === 0) {
            delete _globalEventHandlers[eventClass];
        }
    }
    static addEventListener(eventName, callback, thisArg) {
        if (typeof eventName !== 'string') {
            throw new TypeError('Event must be string.');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be function.');
        }
        const eventClass = this.name === 'Observable' ? '*' : this.name;
        if (!_globalEventHandlers[eventClass]) {
            _globalEventHandlers[eventClass] = {};
        }
        if (!Array.isArray(_globalEventHandlers[eventClass][eventName])) {
            _globalEventHandlers[eventClass][eventName] = [];
        }
        _globalEventHandlers[eventClass][eventName].push({ callback, thisArg });
    }
    _globalNotify(eventClass, eventType, data) {
        // Check for the Global handlers for JUST this class
        if (_globalEventHandlers[eventClass]) {
            const event = data.eventName + eventType;
            const events = _globalEventHandlers[eventClass][event];
            if (events) {
                Observable._handleEvent(events, data);
            }
        }
        // Check for he Global handlers for ALL classes
        if (_globalEventHandlers['*']) {
            const event = data.eventName + eventType;
            const events = _globalEventHandlers['*'][event];
            if (events) {
                Observable._handleEvent(events, data);
            }
        }
    }
    notify(data) {
        const eventData = data;
        eventData.object = eventData.object || this;
        const eventClass = this.constructor.name;
        this._globalNotify(eventClass, 'First', eventData);
        const observers = this._observers[data.eventName];
        if (observers) {
            Observable._handleEvent(observers, eventData);
        }
        this._globalNotify(eventClass, '', eventData);
    }
    static _handleEvent(observers, data) {
        if (!observers) {
            return;
        }
        for (let i = observers.length - 1; i >= 0; i--) {
            const entry = observers[i];
            if (entry.once) {
                observers.splice(i, 1);
            }
            if (entry.thisArg) {
                entry.callback.apply(entry.thisArg, [data]);
            }
            else {
                entry.callback(data);
            }
        }
    }
    notifyPropertyChange(name, value, oldValue) {
        this.notify(this._createPropertyChangeData(name, value, oldValue));
    }
    hasListeners(eventName) {
        return eventName in this._observers;
    }
    _createPropertyChangeData(propertyName, value, oldValue) {
        return {
            eventName: Observable.propertyChangeEvent,
            object: this,
            propertyName,
            value,
            oldValue,
        };
    }
    _emit(eventNames) {
        const events = eventNames.split(',');
        for (let i = 0, l = events.length; i < l; i++) {
            const event = events[i].trim();
            this.notify({ eventName: event, object: this });
        }
    }
    _getEventList(eventName, createIfNeeded) {
        if (!eventName) {
            throw new TypeError('EventName must be valid string.');
        }
        let list = this._observers[eventName];
        if (!list && createIfNeeded) {
            list = [];
            this._observers[eventName] = list;
        }
        return list;
    }
    static _indexOfListener(list, callback, thisArg) {
        for (let i = 0; i < list.length; i++) {
            const entry = list[i];
            if (thisArg) {
                if (entry.callback === callback && entry.thisArg === thisArg) {
                    return i;
                }
            }
            else {
                if (entry.callback === callback) {
                    return i;
                }
            }
        }
        return -1;
    }
}
Observable.propertyChangeEvent = 'propertyChange';
class ObservableFromObject extends Observable {
    constructor() {
        super(...arguments);
        this._map = {};
    }
    get(name) {
        return this._map[name];
    }
    set(name, value) {
        const currentValue = this._map[name];
        if (currentValue === value) {
            return;
        }
        const newValue = WrappedValue.unwrap(value);
        this._map[name] = newValue;
        this.notifyPropertyChange(name, newValue, currentValue);
    }
}
function defineNewProperty(target, propertyName) {
    Object.defineProperty(target, propertyName, {
        get: function () {
            return target._map[propertyName];
        },
        set: function (value) {
            target.set(propertyName, value);
        },
        enumerable: true,
        configurable: true,
    });
}
function addPropertiesFromObject(observable, source, recursive = false) {
    Object.keys(source).forEach((prop) => {
        let value = source[prop];
        if (recursive && !Array.isArray(value) && value && typeof value === 'object' && !(value instanceof Observable)) {
            value = fromObjectRecursive(value);
        }
        defineNewProperty(observable, prop);
        observable.set(prop, value);
    });
}
export function fromObject(source) {
    const observable = new ObservableFromObject();
    addPropertiesFromObject(observable, source, false);
    return observable;
}
export function fromObjectRecursive(source) {
    const observable = new ObservableFromObject();
    addPropertiesFromObject(observable, source, true);
    return observable;
}
//# sourceMappingURL=index.js.map