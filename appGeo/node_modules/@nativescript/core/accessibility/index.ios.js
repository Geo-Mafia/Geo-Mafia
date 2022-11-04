import * as Application from '../application';
import { notifyAccessibilityFocusState } from './accessibility-common';
import { AccessibilityLiveRegion, AccessibilityRole, AccessibilityState, AccessibilityTrait } from './accessibility-types';
export * from './accessibility-common';
export * from './accessibility-types';
export * from './font-scale';
function enforceArray(val) {
    if (Array.isArray(val)) {
        return val;
    }
    if (typeof val === 'string') {
        return val.split(/[, ]/g).filter((v) => !!v);
    }
    return [];
}
/**
 * Convert array of values into a bitmask.
 *
 * @param values string values
 * @param map    map lower-case name to integer value.
 */
function inputArrayToBitMask(values, map) {
    return (enforceArray(values)
        .filter((value) => !!value)
        .map((value) => `${value}`.toLocaleLowerCase())
        .filter((value) => map.has(value))
        .reduce((res, value) => res | map.get(value), 0) || 0);
}
let AccessibilityTraitsMap;
let RoleTypeMap;
let nativeFocusedNotificationObserver;
let lastFocusedView;
function ensureNativeClasses() {
    if (AccessibilityTraitsMap && nativeFocusedNotificationObserver) {
        return;
    }
    AccessibilityTraitsMap = new Map([
        [AccessibilityTrait.AllowsDirectInteraction, UIAccessibilityTraitAllowsDirectInteraction],
        [AccessibilityTrait.CausesPageTurn, UIAccessibilityTraitCausesPageTurn],
        [AccessibilityTrait.NotEnabled, UIAccessibilityTraitNotEnabled],
        [AccessibilityTrait.Selected, UIAccessibilityTraitSelected],
        [AccessibilityTrait.UpdatesFrequently, UIAccessibilityTraitUpdatesFrequently],
    ]);
    RoleTypeMap = new Map([
        [AccessibilityRole.Adjustable, UIAccessibilityTraitAdjustable],
        [AccessibilityRole.Button, UIAccessibilityTraitButton],
        [AccessibilityRole.Checkbox, UIAccessibilityTraitButton],
        [AccessibilityRole.Header, UIAccessibilityTraitHeader],
        [AccessibilityRole.KeyboardKey, UIAccessibilityTraitKeyboardKey],
        [AccessibilityRole.Image, UIAccessibilityTraitImage],
        [AccessibilityRole.ImageButton, UIAccessibilityTraitImage | UIAccessibilityTraitButton],
        [AccessibilityRole.Link, UIAccessibilityTraitLink],
        [AccessibilityRole.None, UIAccessibilityTraitNone],
        [AccessibilityRole.PlaysSound, UIAccessibilityTraitPlaysSound],
        [AccessibilityRole.RadioButton, UIAccessibilityTraitButton],
        [AccessibilityRole.Search, UIAccessibilityTraitSearchField],
        [AccessibilityRole.StaticText, UIAccessibilityTraitStaticText],
        [AccessibilityRole.StartsMediaSession, UIAccessibilityTraitStartsMediaSession],
        [AccessibilityRole.Summary, UIAccessibilityTraitSummaryElement],
        [AccessibilityRole.Switch, UIAccessibilityTraitButton],
    ]);
    nativeFocusedNotificationObserver = Application.ios.addNotificationObserver(UIAccessibilityElementFocusedNotification, (args) => {
        var _a;
        const uiView = (_a = args.userInfo) === null || _a === void 0 ? void 0 : _a.objectForKey(UIAccessibilityFocusedElementKey);
        if (!(uiView === null || uiView === void 0 ? void 0 : uiView.tag)) {
            return;
        }
        const rootView = Application.getRootView();
        // We use the UIView's tag to find the NativeScript View by its domId.
        let view = rootView.getViewByDomId(uiView === null || uiView === void 0 ? void 0 : uiView.tag);
        if (!view) {
            for (const modalView of rootView._getRootModalViews()) {
                view = modalView.getViewByDomId(uiView === null || uiView === void 0 ? void 0 : uiView.tag);
                if (view) {
                    break;
                }
            }
        }
        if (!view) {
            return;
        }
        const lastView = lastFocusedView === null || lastFocusedView === void 0 ? void 0 : lastFocusedView.get();
        if (lastView && view !== lastView) {
            const lastFocusedUIView = lastView.nativeViewProtected;
            if (lastFocusedUIView) {
                lastFocusedView = null;
                notifyAccessibilityFocusState(lastView, false, true);
            }
        }
        lastFocusedView = new WeakRef(view);
        notifyAccessibilityFocusState(view, true, false);
    });
    Application.on(Application.exitEvent, () => {
        if (nativeFocusedNotificationObserver) {
            Application.ios.removeNotificationObserver(nativeFocusedNotificationObserver, UIAccessibilityElementFocusedNotification);
        }
        nativeFocusedNotificationObserver = null;
        lastFocusedView = null;
    });
}
export function setupAccessibleView(view) {
    const uiView = view.nativeViewProtected;
    if (!uiView) {
        return;
    }
    /**
     * We need to map back from the UIView to the NativeScript View.
     *
     * We do that by setting the uiView's tag to the View's domId.
     * This way we can do reverse lookup.
     */
    uiView.tag = view._domId;
}
export function updateAccessibilityProperties(view) {
    const uiView = view.nativeViewProtected;
    if (!uiView) {
        return;
    }
    ensureNativeClasses();
    const accessibilityRole = view.accessibilityRole;
    const accessibilityState = view.accessibilityState;
    if (!view.accessible || view.accessibilityHidden) {
        uiView.accessibilityTraits = UIAccessibilityTraitNone;
        return;
    }
    // NOTE: left here for various core inspection passes while running the toolbox app
    // console.log('--- Accessible element: ', view.constructor.name);
    // console.log('accessibilityLabel: ', view.accessibilityLabel);
    // console.log('accessibilityRole: ', accessibilityRole);
    // console.log('accessibilityState: ', accessibilityState);
    // console.log('accessibilityValue: ', view.accessibilityValue);
    let a11yTraits = UIAccessibilityTraitNone;
    if (RoleTypeMap.has(accessibilityRole)) {
        a11yTraits |= RoleTypeMap.get(accessibilityRole);
    }
    switch (accessibilityRole) {
        case AccessibilityRole.Checkbox:
        case AccessibilityRole.RadioButton:
        case AccessibilityRole.Switch: {
            if (accessibilityState === AccessibilityState.Checked) {
                a11yTraits |= AccessibilityTraitsMap.get(AccessibilityTrait.Selected);
            }
            break;
        }
        default: {
            if (accessibilityState === AccessibilityState.Selected) {
                a11yTraits |= AccessibilityTraitsMap.get(AccessibilityTrait.Selected);
            }
            if (accessibilityState === AccessibilityState.Disabled) {
                a11yTraits |= AccessibilityTraitsMap.get(AccessibilityTrait.NotEnabled);
            }
            break;
        }
    }
    const UpdatesFrequentlyTrait = AccessibilityTraitsMap.get(AccessibilityTrait.UpdatesFrequently);
    switch (view.accessibilityLiveRegion) {
        case AccessibilityLiveRegion.Polite:
        case AccessibilityLiveRegion.Assertive: {
            a11yTraits |= UpdatesFrequentlyTrait;
            break;
        }
        default: {
            a11yTraits &= ~UpdatesFrequentlyTrait;
            break;
        }
    }
    // NOTE: left here for various core inspection passes while running the toolbox app
    // if (view.accessibilityLiveRegion) {
    // 	console.log('accessibilityLiveRegion:', view.accessibilityLiveRegion);
    // }
    if (view.accessibilityMediaSession) {
        a11yTraits |= RoleTypeMap.get(AccessibilityRole.StartsMediaSession);
    }
    // NOTE: There were duplicated types in traits and roles previously which we conslidated
    // not sure if this is still needed
    // accessibilityTraits used to be stored on {N} view component but if the above
    // is combining all traits fresh each time through, don't believe we need to keep track or previous traits
    // if (view.accessibilityTraits) {
    // 	a11yTraits |= inputArrayToBitMask(view.accessibilityTraits, AccessibilityTraitsMap);
    // }
    // NOTE: left here for various core inspection passes while running the toolbox app
    // console.log('a11yTraits:', a11yTraits);
    // console.log('    ');
    uiView.accessibilityTraits = a11yTraits;
}
export const sendAccessibilityEvent = () => { };
export const updateContentDescription = () => null;
let accessibilityServiceEnabled;
let nativeObserver;
export function isAccessibilityServiceEnabled() {
    if (typeof accessibilityServiceEnabled === 'boolean') {
        return accessibilityServiceEnabled;
    }
    let isVoiceOverRunning;
    if (typeof UIAccessibilityIsVoiceOverRunning === 'function') {
        isVoiceOverRunning = UIAccessibilityIsVoiceOverRunning;
    }
    else {
        // iOS is too old to tell us if voice over is enabled
        if (typeof UIAccessibilityIsVoiceOverRunning !== 'function') {
            accessibilityServiceEnabled = false;
            return accessibilityServiceEnabled;
        }
    }
    accessibilityServiceEnabled = isVoiceOverRunning();
    let voiceOverStatusChangedNotificationName = null;
    if (typeof UIAccessibilityVoiceOverStatusDidChangeNotification !== 'undefined') {
        voiceOverStatusChangedNotificationName = UIAccessibilityVoiceOverStatusDidChangeNotification;
    }
    else if (typeof UIAccessibilityVoiceOverStatusChanged !== 'undefined') {
        voiceOverStatusChangedNotificationName = UIAccessibilityVoiceOverStatusChanged;
    }
    if (voiceOverStatusChangedNotificationName) {
        nativeObserver = Application.ios.addNotificationObserver(voiceOverStatusChangedNotificationName, () => {
            accessibilityServiceEnabled = isVoiceOverRunning();
        });
        Application.on(Application.exitEvent, () => {
            if (nativeObserver) {
                Application.ios.removeNotificationObserver(nativeObserver, voiceOverStatusChangedNotificationName);
            }
            accessibilityServiceEnabled = undefined;
            nativeObserver = null;
        });
    }
    Application.on(Application.resumeEvent, () => {
        accessibilityServiceEnabled = isVoiceOverRunning();
    });
    return accessibilityServiceEnabled;
}
//# sourceMappingURL=index.ios.js.map