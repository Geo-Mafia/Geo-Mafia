import { CommonA11YServiceEnabledObservable } from './accessibility-service-common';
export declare function getAndroidAccessibilityManager(): android.view.accessibility.AccessibilityManager | null;
export declare function isAccessibilityServiceEnabled(): boolean;
export declare class AccessibilityServiceEnabledObservable extends CommonA11YServiceEnabledObservable {
    constructor();
}
