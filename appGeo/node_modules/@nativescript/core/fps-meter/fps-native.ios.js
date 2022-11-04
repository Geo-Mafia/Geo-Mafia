var FrameHandlerImpl = /** @class */ (function (_super) {
    __extends(FrameHandlerImpl, _super);
    function FrameHandlerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FrameHandlerImpl.initWithOwner = function (owner) {
        var handler = FrameHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    FrameHandlerImpl.prototype.handleFrame = function (sender) {
        var owner = this._owner.get();
        if (owner) {
            owner._handleFrame(sender);
        }
    };
    FrameHandlerImpl.ObjCExposedMethods = {
        handleFrame: { returns: interop.types.void, params: [CADisplayLink] },
    };
    return FrameHandlerImpl;
}(NSObject));
export class FPSCallback {
    constructor(onFrame) {
        this.onFrame = onFrame;
        this.impl = FrameHandlerImpl.initWithOwner(new WeakRef(this));
        this.displayLink = CADisplayLink.displayLinkWithTargetSelector(this.impl, 'handleFrame');
        this.displayLink.paused = true;
        this.displayLink.addToRunLoopForMode(NSRunLoop.currentRunLoop, NSDefaultRunLoopMode);
        // UIScrollView (including in UIITableView) will run a loop in UITrackingRunLoopMode during scrolling.
        // If we do not add the CADisplayLink in this mode, it would appear paused during scrolling.
        this.displayLink.addToRunLoopForMode(NSRunLoop.currentRunLoop, UITrackingRunLoopMode);
    }
    start() {
        if (this.running) {
            return;
        }
        this.running = true;
        this.displayLink.paused = false;
    }
    stop() {
        if (!this.running) {
            return;
        }
        this.displayLink.paused = true;
        this.running = false;
    }
    _handleFrame(sender) {
        if (!this.running) {
            return;
        }
        // timestamp is CFTimeInterval, which is in seconds, the onFrame callback expects millis, so multiply by 1000
        this.onFrame(sender.timestamp * 1000);
    }
}
//# sourceMappingURL=fps-native.ios.js.map