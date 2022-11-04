const lastFocusedViewOnPageKeyName = '__lastFocusedViewOnPage';
export const accessibilityBlurEvent = 'accessibilityBlur';
export const accessibilityFocusEvent = 'accessibilityFocus';
export const accessibilityFocusChangedEvent = 'accessibilityFocusChanged';
export const accessibilityPerformEscapeEvent = 'accessibilityPerformEscape';
/**
 * Send notification when accessibility focus state changes.
 * If either receivedFocus or lostFocus is true, 'accessibilityFocusChanged' is send with value true if element received focus
 * If receivedFocus, 'accessibilityFocus' is send
 * if lostFocus, 'accessibilityBlur' is send
 *
 * @param {View} view
 * @param {boolean} receivedFocus
 * @param {boolean} lostFocus
 */
export function notifyAccessibilityFocusState(view, receivedFocus, lostFocus) {
    if (!receivedFocus && !lostFocus) {
        return;
    }
    view.notify({
        eventName: accessibilityFocusChangedEvent,
        object: view,
        value: !!receivedFocus,
    });
    if (receivedFocus) {
        if (view.page) {
            view.page[lastFocusedViewOnPageKeyName] = new WeakRef(view);
        }
        view.notify({
            eventName: accessibilityFocusEvent,
            object: view,
        });
    }
    else if (lostFocus) {
        view.notify({
            eventName: accessibilityBlurEvent,
            object: view,
        });
    }
}
export function getLastFocusedViewOnPage(page) {
    try {
        const lastFocusedViewRef = page[lastFocusedViewOnPageKeyName];
        if (!lastFocusedViewRef) {
            return null;
        }
        const lastFocusedView = lastFocusedViewRef.get();
        if (!lastFocusedView) {
            return null;
        }
        if (!lastFocusedView.parent || lastFocusedView.page !== page) {
            return null;
        }
        return lastFocusedView;
    }
    catch (_a) {
        // ignore
    }
    finally {
        delete page[lastFocusedViewOnPageKeyName];
    }
    return null;
}
//# sourceMappingURL=accessibility-common.js.map