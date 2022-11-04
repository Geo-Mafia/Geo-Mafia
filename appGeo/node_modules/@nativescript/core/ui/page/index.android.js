import { PageBase, actionBarHiddenProperty, statusBarStyleProperty, androidStatusBarBackgroundProperty } from './page-common';
import { Color } from '../../color';
import { ActionBar } from '../action-bar';
import { GridLayout } from '../layouts/grid-layout';
import { Device } from '../../platform';
import { profile } from '../../profiling';
import { AndroidAccessibilityEvent, getLastFocusedViewOnPage, isAccessibilityServiceEnabled } from '../../accessibility';
export * from './page-common';
const SYSTEM_UI_FLAG_LIGHT_STATUS_BAR = 0x00002000;
const STATUS_BAR_LIGHT_BCKG = -657931;
const STATUS_BAR_DARK_BCKG = 1711276032;
export class Page extends PageBase {
    createNativeView() {
        const layout = new org.nativescript.widgets.GridLayout(this._context);
        layout.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
        layout.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
        return layout;
    }
    initNativeView() {
        super.initNativeView();
        this.nativeViewProtected.setBackgroundColor(-1); // White color.
    }
    _addViewToNativeVisualTree(child, atIndex) {
        // Set the row property for the child
        if (this.nativeViewProtected && child.nativeViewProtected) {
            if (child instanceof ActionBar) {
                GridLayout.setRow(child, 0);
                child.horizontalAlignment = 'stretch';
                child.verticalAlignment = 'top';
            }
            else {
                GridLayout.setRow(child, 1);
            }
        }
        return super._addViewToNativeVisualTree(child, atIndex);
    }
    onLoaded() {
        super.onLoaded();
        if (!this.hasActionBar && this.actionBarHidden !== true) {
            // ensure actionBar is created
            // but we only need to do that if the actionBarHidden is not hidden
            this.actionBar = new ActionBar();
        }
        if (this.hasActionBar) {
            this.updateActionBar();
        }
    }
    updateActionBar() {
        // the test is actually to ensure the actionBar is created
        // it will be created if not
        if (this.actionBar) {
            this.actionBar.update();
        }
    }
    [actionBarHiddenProperty.setNative](value) {
        // in case the actionBar is not created and actionBarHidden is changed to true
        // the actionBar will be created by updateActionBar
        if (!value || this.hasActionBar) {
            this.updateActionBar();
        }
    }
    [statusBarStyleProperty.getDefault]() {
        if (Device.sdkVersion >= '21') {
            const window = this._context.getWindow();
            const decorView = window.getDecorView();
            return {
                color: window.getStatusBarColor(),
                systemUiVisibility: decorView.getSystemUiVisibility(),
            };
        }
        return null;
    }
    [statusBarStyleProperty.setNative](value) {
        if (Device.sdkVersion >= '21') {
            const window = this._context.getWindow();
            const decorView = window.getDecorView();
            if (value === 'light') {
                window.setStatusBarColor(STATUS_BAR_LIGHT_BCKG);
                decorView.setSystemUiVisibility(SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            }
            else if (value === 'dark') {
                window.setStatusBarColor(STATUS_BAR_DARK_BCKG);
                decorView.setSystemUiVisibility(0);
            }
            else {
                window.setStatusBarColor(value.color);
                decorView.setSystemUiVisibility(value.systemUiVisibility);
            }
        }
    }
    [androidStatusBarBackgroundProperty.getDefault]() {
        if (Device.sdkVersion >= '21') {
            const window = this._context.getWindow();
            return window.getStatusBarColor();
        }
        return null;
    }
    [androidStatusBarBackgroundProperty.setNative](value) {
        if (Device.sdkVersion >= '21') {
            const window = this._context.getWindow();
            const color = value instanceof Color ? value.android : value;
            window.setStatusBarColor(color);
        }
    }
    accessibilityScreenChanged(refocus = false) {
        if (!isAccessibilityServiceEnabled()) {
            return;
        }
        if (refocus) {
            const lastFocusedView = getLastFocusedViewOnPage(this);
            if (lastFocusedView) {
                const announceView = lastFocusedView.nativeViewProtected;
                if (announceView) {
                    announceView.sendAccessibilityEvent(android.view.accessibility.AccessibilityEvent.TYPE_VIEW_FOCUSED);
                    announceView.sendAccessibilityEvent(android.view.accessibility.AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED);
                    return;
                }
            }
        }
        if (this.actionBarHidden || this.accessibilityLabel) {
            this.sendAccessibilityEvent({
                androidAccessibilityEvent: AndroidAccessibilityEvent.WINDOW_STATE_CHANGED,
            });
            return;
        }
        this.actionBar.accessibilityScreenChanged();
    }
}
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Page.prototype, "onLoaded", null);
//# sourceMappingURL=index.android.js.map