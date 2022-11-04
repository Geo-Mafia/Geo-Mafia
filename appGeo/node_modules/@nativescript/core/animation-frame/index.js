import { queueMacrotask } from '../utils/macrotask-scheduler';
import { FPSCallback } from '../fps-meter/fps-native';
import { getTimeInFrameBase } from './animation-native';
import { Trace } from '../trace';
let animationId = 0;
let currentFrameAnimationCallbacks = {}; // requests that were scheduled in this frame and must be called ASAP
let currentFrameScheduled = false;
let nextFrameAnimationCallbacks = {}; // requests there were scheduled in another request and must be called in the next frame
let shouldStop = true;
let inAnimationFrame = false;
let fpsCallback;
let lastFrameTime = 0;
function getNewId() {
    return animationId++;
}
function ensureNative() {
    if (fpsCallback) {
        return;
    }
    fpsCallback = new FPSCallback(doFrame);
}
function callAnimationCallbacks(thisFrameCbs, frameTime) {
    inAnimationFrame = true;
    for (const animationId in thisFrameCbs) {
        if (thisFrameCbs[animationId]) {
            try {
                thisFrameCbs[animationId](frameTime);
            }
            catch (err) {
                const msg = err ? err.stack || err : err;
                Trace.write(`Error in requestAnimationFrame: ${msg}`, Trace.categories.Error, Trace.messageType.error);
            }
        }
    }
    inAnimationFrame = false;
}
function doCurrentFrame() {
    // if we're not getting accurate frame times
    // set last frame time as the current time
    if (!fpsCallback || !fpsCallback.running) {
        lastFrameTime = getTimeInFrameBase();
    }
    currentFrameScheduled = false;
    const thisFrameCbs = currentFrameAnimationCallbacks;
    currentFrameAnimationCallbacks = {};
    callAnimationCallbacks(thisFrameCbs, lastFrameTime);
}
function doFrame(currentTimeMillis) {
    lastFrameTime = currentTimeMillis;
    shouldStop = true;
    const thisFrameCbs = nextFrameAnimationCallbacks;
    nextFrameAnimationCallbacks = {};
    callAnimationCallbacks(thisFrameCbs, lastFrameTime);
    if (shouldStop) {
        fpsCallback.stop(); // TODO: check performance without stopping to allow consistent frame times
    }
}
function ensureCurrentFrameScheduled() {
    if (!currentFrameScheduled) {
        currentFrameScheduled = true;
        queueMacrotask(doCurrentFrame);
    }
}
export function requestAnimationFrame(cb) {
    const animId = getNewId();
    if (!inAnimationFrame) {
        ensureCurrentFrameScheduled();
        currentFrameAnimationCallbacks[animId] = zonedCallback(cb);
        return animId;
    }
    ensureNative();
    nextFrameAnimationCallbacks[animId] = zonedCallback(cb);
    shouldStop = false;
    fpsCallback.start();
    return animId;
}
export function cancelAnimationFrame(id) {
    delete currentFrameAnimationCallbacks[id];
    delete nextFrameAnimationCallbacks[id];
}
//# sourceMappingURL=index.js.map