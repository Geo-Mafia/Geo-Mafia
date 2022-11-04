//iOS specific timer functions implementation.
const timeoutCallbacks = new Map();
let timerId = 0;
var TimerTargetImpl = /** @class */ (function (_super) {
    __extends(TimerTargetImpl, _super);
    function TimerTargetImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimerTargetImpl.initWithCallback = function (callback, id, shouldRepeat) {
        var handler = TimerTargetImpl.new();
        handler.callback = callback;
        handler.id = id;
        handler.shouldRepeat = shouldRepeat;
        return handler;
    };
    TimerTargetImpl.prototype.tick = function (timer) {
        if (!this.disposed) {
            this.callback();
        }
        if (!this.shouldRepeat) {
            this.unregister();
        }
    };
    TimerTargetImpl.prototype.unregister = function () {
        if (!this.disposed) {
            this.disposed = true;
            var timer = timeoutCallbacks.get(this.id).k;
            timer.invalidate();
            timeoutCallbacks.delete(this.id);
        }
    };
    TimerTargetImpl.ObjCExposedMethods = {
        tick: { returns: interop.types.void, params: [NSTimer] },
    };
    return TimerTargetImpl;
}(NSObject));
function createTimerAndGetId(callback, milliseconds, shouldRepeat) {
    // Cast to Number
    milliseconds += 0;
    timerId++;
    const id = timerId;
    const timerTarget = TimerTargetImpl.initWithCallback(callback, id, shouldRepeat);
    const timer = NSTimer.scheduledTimerWithTimeIntervalTargetSelectorUserInfoRepeats(milliseconds / 1000, timerTarget, 'tick', null, shouldRepeat);
    // https://github.com/NativeScript/NativeScript/issues/2116
    NSRunLoop.currentRunLoop.addTimerForMode(timer, NSRunLoopCommonModes);
    const pair = {
        k: timer,
        v: timerTarget,
    };
    timeoutCallbacks.set(id, pair);
    return id;
}
export function setTimeout(callback, milliseconds = 0, ...args) {
    const invoke = () => callback(...args);
    return createTimerAndGetId(zonedCallback(invoke), milliseconds, false);
}
export function clearTimeout(id) {
    const pair = timeoutCallbacks.get(id);
    if (pair && pair.v) {
        pair.v.unregister();
    }
}
export function setInterval(callback, milliseconds = 0, ...args) {
    const invoke = () => callback(...args);
    return createTimerAndGetId(zonedCallback(invoke), milliseconds, true);
}
export const clearInterval = clearTimeout;
//# sourceMappingURL=index.ios.js.map