export function dispatchToMainThread(func) {
    NSOperationQueue.mainQueue.addOperationWithBlock(func);
}
export function isMainThread() {
    return NSThread.isMainThread;
}
export function dispatchToUIThread(func) {
    const runloop = CFRunLoopGetMain();
    if (runloop && func) {
        CFRunLoopPerformBlock(runloop, kCFRunLoopDefaultMode, func);
        CFRunLoopWakeUp(runloop);
    }
    else if (func) {
        func();
    }
}
//# sourceMappingURL=mainthread-helper.ios.js.map