import * as Application from '../application';
import { FontScaleCategory, getClosestValidFontScale } from './font-scale-common';
export * from './font-scale-common';
let currentFontScale = null;
function fontScaleChanged(origFontScale) {
    const oldValue = currentFontScale;
    currentFontScale = getClosestValidFontScale(origFontScale);
    if (oldValue !== currentFontScale) {
        Application.notify({
            eventName: Application.fontScaleChangedEvent,
            object: Application,
            newValue: currentFontScale,
        });
    }
}
export function getCurrentFontScale() {
    setupConfigListener();
    return currentFontScale;
}
export function getFontScaleCategory() {
    return FontScaleCategory.Medium;
}
function useAndroidFontScale() {
    fontScaleChanged(Number(Application.android.context.getResources().getConfiguration().fontScale));
}
let configChangedCallback;
function setupConfigListener() {
    var _a;
    if (configChangedCallback) {
        return;
    }
    Application.off(Application.launchEvent, setupConfigListener);
    const context = (_a = Application.android) === null || _a === void 0 ? void 0 : _a.context;
    if (!context) {
        Application.on(Application.launchEvent, setupConfigListener);
        return;
    }
    useAndroidFontScale();
    configChangedCallback = new android.content.ComponentCallbacks2({
        onLowMemory() {
            // Dummy
        },
        onTrimMemory() {
            // Dummy
        },
        onConfigurationChanged(newConfig) {
            fontScaleChanged(Number(newConfig.fontScale));
        },
    });
    context.registerComponentCallbacks(configChangedCallback);
    Application.on(Application.resumeEvent, useAndroidFontScale);
}
export function initAccessibilityFontScale() {
    setupConfigListener();
}
//# sourceMappingURL=font-scale.android.js.map