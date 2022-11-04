export * from './touch-manager';
export var GestureEvents;
(function (GestureEvents) {
    GestureEvents["gestureAttached"] = "gestureAttached";
    GestureEvents["touchDown"] = "touchDown";
    GestureEvents["touchUp"] = "touchUp";
})(GestureEvents || (GestureEvents = {}));
export var GestureTypes;
(function (GestureTypes) {
    GestureTypes[GestureTypes["tap"] = 1] = "tap";
    GestureTypes[GestureTypes["doubleTap"] = 2] = "doubleTap";
    GestureTypes[GestureTypes["pinch"] = 4] = "pinch";
    GestureTypes[GestureTypes["pan"] = 8] = "pan";
    GestureTypes[GestureTypes["swipe"] = 16] = "swipe";
    GestureTypes[GestureTypes["rotation"] = 32] = "rotation";
    GestureTypes[GestureTypes["longPress"] = 64] = "longPress";
    GestureTypes[GestureTypes["touch"] = 128] = "touch";
})(GestureTypes || (GestureTypes = {}));
export var GestureStateTypes;
(function (GestureStateTypes) {
    GestureStateTypes[GestureStateTypes["cancelled"] = 0] = "cancelled";
    GestureStateTypes[GestureStateTypes["began"] = 1] = "began";
    GestureStateTypes[GestureStateTypes["changed"] = 2] = "changed";
    GestureStateTypes[GestureStateTypes["ended"] = 3] = "ended";
})(GestureStateTypes || (GestureStateTypes = {}));
export var SwipeDirection;
(function (SwipeDirection) {
    SwipeDirection[SwipeDirection["right"] = 1] = "right";
    SwipeDirection[SwipeDirection["left"] = 2] = "left";
    SwipeDirection[SwipeDirection["up"] = 4] = "up";
    SwipeDirection[SwipeDirection["down"] = 8] = "down";
})(SwipeDirection || (SwipeDirection = {}));
export var TouchAction;
(function (TouchAction) {
    TouchAction.down = 'down';
    TouchAction.up = 'up';
    TouchAction.move = 'move';
    TouchAction.cancel = 'cancel';
})(TouchAction || (TouchAction = {}));
export function toString(type, separator) {
    const types = new Array();
    if (type & GestureTypes.tap) {
        types.push('tap');
    }
    if (type & GestureTypes.doubleTap) {
        types.push('doubleTap');
    }
    if (type & GestureTypes.pinch) {
        types.push('pinch');
    }
    if (type & GestureTypes.pan) {
        types.push('pan');
    }
    if (type & GestureTypes.swipe) {
        types.push('swipe');
    }
    if (type & GestureTypes.rotation) {
        types.push('rotation');
    }
    if (type & GestureTypes.longPress) {
        types.push('longPress');
    }
    if (type & GestureTypes.touch) {
        types.push('touch');
    }
    return types.join(separator);
}
// NOTE: toString could return the text of multiple GestureTypes.
// Souldn't fromString do split on separator and return multiple GestureTypes?
export function fromString(type) {
    const t = type.trim().toLowerCase();
    if (t === 'tap') {
        return GestureTypes.tap;
    }
    else if (t === 'doubletap') {
        return GestureTypes.doubleTap;
    }
    else if (t === 'pinch') {
        return GestureTypes.pinch;
    }
    else if (t === 'pan') {
        return GestureTypes.pan;
    }
    else if (t === 'swipe') {
        return GestureTypes.swipe;
    }
    else if (t === 'rotation') {
        return GestureTypes.rotation;
    }
    else if (t === 'longpress') {
        return GestureTypes.longPress;
    }
    else if (t === 'touch') {
        return GestureTypes.touch;
    }
    return undefined;
}
export class GesturesObserverBase {
    constructor(target, callback, context) {
        this._target = target;
        this._callback = callback;
        this._context = context;
    }
    get callback() {
        return this._callback;
    }
    get target() {
        return this._target;
    }
    get context() {
        return this._context;
    }
    disconnect() {
        // remove gesture observer from map
        if (this.target) {
            const list = this.target.getGestureObservers(this.type);
            if (list && list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].callback === this.callback) {
                        break;
                    }
                }
                list.length = 0;
                this.target._gestureObservers[this.type] = undefined;
                delete this.target._gestureObservers[this.type];
            }
        }
        this._target = null;
        this._callback = null;
        this._context = null;
    }
}
//# sourceMappingURL=gestures-common.js.map