import type { View } from '../ui/core/view';
import type { Page } from '../ui/page';
export declare const accessibilityBlurEvent = "accessibilityBlur";
export declare const accessibilityFocusEvent = "accessibilityFocus";
export declare const accessibilityFocusChangedEvent = "accessibilityFocusChanged";
export declare const accessibilityPerformEscapeEvent = "accessibilityPerformEscape";
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
export declare function notifyAccessibilityFocusState(view: Partial<View>, receivedFocus: boolean, lostFocus: boolean): void;
export declare function getLastFocusedViewOnPage(page: Page): View | null;
