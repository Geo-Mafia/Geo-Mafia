import * as Application from '../application';
import { Observable } from '../data/observable';
import { Trace } from '../trace';
import * as Utils from '../utils';
import { CommonA11YServiceEnabledObservable, SharedA11YObservable } from './accessibility-service-common';
export function getAndroidAccessibilityManager() {
    const context = Utils.ad.getApplicationContext();
    if (!context) {
        return null;
    }
    return context.getSystemService(android.content.Context.ACCESSIBILITY_SERVICE);
}
const accessibilityStateEnabledPropName = 'accessibilityStateEnabled';
const touchExplorationStateEnabledPropName = 'touchExplorationStateEnabled';
class AndroidSharedA11YObservable extends SharedA11YObservable {
    // @ts-ignore todo: fix
    get accessibilityServiceEnabled() {
        return !!this[accessibilityStateEnabledPropName] && !!this[touchExplorationStateEnabledPropName];
    }
    set accessibilityServiceEnabled(v) {
        return;
    }
}
let accessibilityStateChangeListener;
let touchExplorationStateChangeListener;
let sharedA11YObservable;
function updateAccessibilityState() {
    const accessibilityManager = getAndroidAccessibilityManager();
    if (!accessibilityManager) {
        sharedA11YObservable.set(accessibilityStateEnabledPropName, false);
        sharedA11YObservable.set(touchExplorationStateEnabledPropName, false);
        return;
    }
    sharedA11YObservable.set(accessibilityStateEnabledPropName, !!accessibilityManager.isEnabled());
    sharedA11YObservable.set(touchExplorationStateEnabledPropName, !!accessibilityManager.isTouchExplorationEnabled());
}
function ensureStateListener() {
    if (sharedA11YObservable) {
        return sharedA11YObservable;
    }
    const accessibilityManager = getAndroidAccessibilityManager();
    sharedA11YObservable = new AndroidSharedA11YObservable();
    if (!accessibilityManager) {
        sharedA11YObservable.set(accessibilityStateEnabledPropName, false);
        sharedA11YObservable.set(touchExplorationStateEnabledPropName, false);
        return sharedA11YObservable;
    }
    accessibilityStateChangeListener = new android.view.accessibility.AccessibilityManager.AccessibilityStateChangeListener({
        onAccessibilityStateChanged(enabled) {
            updateAccessibilityState();
            if (Trace.isEnabled()) {
                Trace.write(`AccessibilityStateChangeListener state changed to: ${!!enabled}`, Trace.categories.Accessibility);
            }
        },
    });
    accessibilityManager.addAccessibilityStateChangeListener(accessibilityStateChangeListener);
    if (android.os.Build.VERSION.SDK_INT >= 19) {
        touchExplorationStateChangeListener = new android.view.accessibility.AccessibilityManager.TouchExplorationStateChangeListener({
            onTouchExplorationStateChanged(enabled) {
                updateAccessibilityState();
                if (Trace.isEnabled()) {
                    Trace.write(`TouchExplorationStateChangeListener state changed to: ${!!enabled}`, Trace.categories.Accessibility);
                }
            },
        });
        accessibilityManager.addTouchExplorationStateChangeListener(touchExplorationStateChangeListener);
    }
    updateAccessibilityState();
    Application.on(Application.resumeEvent, updateAccessibilityState);
    return sharedA11YObservable;
}
export function isAccessibilityServiceEnabled() {
    return ensureStateListener().accessibilityServiceEnabled;
}
Application.on(Application.exitEvent, (args) => {
    const activity = args.android;
    if (activity && !activity.isFinishing()) {
        return;
    }
    const accessibilityManager = getAndroidAccessibilityManager();
    if (accessibilityManager) {
        if (accessibilityStateChangeListener) {
            accessibilityManager.removeAccessibilityStateChangeListener(accessibilityStateChangeListener);
        }
        if (touchExplorationStateChangeListener) {
            accessibilityManager.removeTouchExplorationStateChangeListener(touchExplorationStateChangeListener);
        }
    }
    accessibilityStateChangeListener = null;
    touchExplorationStateChangeListener = null;
    if (sharedA11YObservable) {
        sharedA11YObservable.removeEventListener(Observable.propertyChangeEvent);
        sharedA11YObservable = null;
    }
    Application.off(Application.resumeEvent, updateAccessibilityState);
});
export class AccessibilityServiceEnabledObservable extends CommonA11YServiceEnabledObservable {
    constructor() {
        super(ensureStateListener());
    }
}
//# sourceMappingURL=accessibility-service.android.js.map