import { Observable } from '../data/observable';
/**
 * The signal class.
 * @see https://dom.spec.whatwg.org/#abortsignal
 */
export default class AbortSignal extends Observable {
    /**
     * AbortSignal cannot be constructed directly.
     */
    constructor() {
        super();
    }
    /**
     * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
     */
    get aborted() {
        const aborted = abortedFlags.get(this);
        if (typeof aborted !== "boolean") {
            throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
        }
        return aborted;
    }
}
/**
 * Create an AbortSignal object.
 */
export function createAbortSignal() {
    const signal = new AbortSignal();
    abortedFlags.set(signal, false);
    return signal;
}
/**
 * Abort a given signal.
 */
export function abortSignal(signal) {
    if (abortedFlags.get(signal) !== false) {
        return;
    }
    abortedFlags.set(signal, true);
    signal.notify({ eventName: "abort", type: "abort" });
}
/**
 * Aborted flag for each instances.
 */
const abortedFlags = new WeakMap();
// Properties should be enumerable.
Object.defineProperties(AbortSignal.prototype, {
    aborted: { enumerable: true },
});
// `toString()` should return `"[object AbortSignal]"`
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortSignal",
    });
}
//# sourceMappingURL=abortsignal.js.map