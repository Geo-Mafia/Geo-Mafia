import AbortSignal from "./abortsignal";
/**
 * The AbortController.
 * @see https://dom.spec.whatwg.org/#abortcontroller
 */
export default class AbortController {
    /**
     * Initialize this controller.
     */
    constructor();
    /**
     * Returns the `AbortSignal` object associated with this object.
     */
    get signal(): AbortSignal;
    /**
     * Abort and signal to any observers that the associated activity is to be aborted.
     */
    abort(): void;
}
export { AbortController, AbortSignal };
