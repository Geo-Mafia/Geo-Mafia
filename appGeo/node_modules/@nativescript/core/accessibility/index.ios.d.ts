import type { View } from '../ui/core/view';
export * from './accessibility-common';
export * from './accessibility-types';
export * from './font-scale';
export declare function setupAccessibleView(view: View): void;
export declare function updateAccessibilityProperties(view: View): void;
export declare const sendAccessibilityEvent: () => void;
export declare const updateContentDescription: () => string | null;
export declare function isAccessibilityServiceEnabled(): boolean;
