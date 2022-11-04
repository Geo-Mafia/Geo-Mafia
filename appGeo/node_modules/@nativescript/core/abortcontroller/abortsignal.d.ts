import { Observable } from '../data/observable';
/**
 * The signal class.
 * @see https://dom.spec.whatwg.org/#abortsignal
 */
export default class AbortSignal extends Observable {
    /**
     * AbortSignal cannot be constructed directly.
     */
    constructor();
    /**
     * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
     */
    get aborted(): boolean;
}
/**
 * Create an AbortSignal object.
 */
export declare function createAbortSignal(): AbortSignal;
/**
 * Abort a given signal.
 */
export declare function abortSignal(signal: AbortSignal): void;
