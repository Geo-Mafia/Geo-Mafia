import { ButtonBase } from './button-common';
import { PseudoClassHandler } from '../core/view';
import { paddingLeftProperty, paddingTopProperty, paddingRightProperty, paddingBottomProperty, Length, zIndexProperty, minWidthProperty, minHeightProperty } from '../styling/style-properties';
import { textAlignmentProperty } from '../text-base';
import { profile } from '../../profiling';
import { GestureTypes, TouchAction } from '../gestures';
import { Device } from '../../platform';
import lazy from '../../utils/lazy';
export * from './button-common';
const sdkVersion = lazy(() => parseInt(Device.sdkVersion));
let ClickListener;
let APILEVEL;
let AndroidButton;
function initializeClickListener() {
    if (ClickListener) {
        return;
    }
    var ClickListenerImpl = /** @class */ (function (_super) {
    __extends(ClickListenerImpl, _super);
    function ClickListenerImpl(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    ClickListenerImpl.prototype.onClick = function (v) {
        var owner = this.owner;
        if (owner) {
            owner._emit(ButtonBase.tapEvent);
        }
    };
    ClickListenerImpl = __decorate([
        Interfaces([android.view.View.OnClickListener])
    ], ClickListenerImpl);
    return ClickListenerImpl;
}(java.lang.Object));
    ClickListener = ClickListenerImpl;
}
export class Button extends ButtonBase {
    constructor() {
        super();
        if (!APILEVEL) {
            APILEVEL = android.os.Build.VERSION.SDK_INT;
        }
    }
    _applyBackground(background, isBorderDrawable, onlyColor, backgroundDrawable) {
        const nativeView = this.nativeViewProtected;
        if (backgroundDrawable && onlyColor) {
            if (isBorderDrawable && nativeView._cachedDrawable) {
                backgroundDrawable = nativeView._cachedDrawable;
                // we need to duplicate the drawable or we lose the "default" cached drawable
                const constantState = backgroundDrawable.getConstantState();
                if (constantState) {
                    try {
                        backgroundDrawable = constantState.newDrawable(nativeView.getResources());
                        // eslint-disable-next-line no-empty
                    }
                    catch (_a) { }
                }
                nativeView.setBackground(backgroundDrawable);
            }
            const backgroundColor = (backgroundDrawable.backgroundColor = background.color.android);
            backgroundDrawable.mutate();
            backgroundDrawable.setColorFilter(backgroundColor, android.graphics.PorterDuff.Mode.SRC_IN);
            backgroundDrawable.invalidateSelf(); // Make sure the drawable is invalidated. Android forgets to invalidate it in some cases: toolbar
            backgroundDrawable.backgroundColor = backgroundColor;
        }
        else {
            super._applyBackground(background, isBorderDrawable, onlyColor, backgroundDrawable);
        }
    }
    createNativeView() {
        if (!AndroidButton) {
            AndroidButton = android.widget.Button;
        }
        return new AndroidButton(this._context);
    }
    initNativeView() {
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        initializeClickListener();
        const clickListener = new ClickListener(this);
        nativeView.setOnClickListener(clickListener);
        nativeView.clickListener = clickListener;
    }
    disposeNativeView() {
        if (this.nativeViewProtected) {
            this.nativeViewProtected.clickListener.owner = null;
        }
        super.disposeNativeView();
    }
    resetNativeView() {
        super.resetNativeView();
        if (this._stateListAnimator && APILEVEL >= 21) {
            this.nativeViewProtected.setStateListAnimator(this._stateListAnimator);
            this._stateListAnimator = undefined;
        }
    }
    _updateButtonStateChangeHandler(subscribe) {
        if (subscribe) {
            this._highlightedHandler =
                this._highlightedHandler ||
                    ((args) => {
                        switch (args.action) {
                            case TouchAction.up:
                            case TouchAction.cancel:
                                this._goToVisualState('normal');
                                break;
                            case TouchAction.down:
                                this._goToVisualState('highlighted');
                                break;
                        }
                    });
            this.on(GestureTypes.touch, this._highlightedHandler);
        }
        else {
            this.off(GestureTypes.touch, this._highlightedHandler);
        }
    }
    [minWidthProperty.getDefault]() {
        const dips = org.nativescript.widgets.ViewHelper.getMinWidth(this.nativeViewProtected);
        return { value: dips, unit: 'px' };
    }
    [minHeightProperty.getDefault]() {
        const dips = org.nativescript.widgets.ViewHelper.getMinHeight(this.nativeViewProtected);
        return { value: dips, unit: 'px' };
    }
    [paddingTopProperty.getDefault]() {
        return { value: this._defaultPaddingTop, unit: 'px' };
    }
    [paddingTopProperty.setNative](value) {
        org.nativescript.widgets.ViewHelper.setPaddingTop(this.nativeViewProtected, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderTopWidth, 0));
    }
    [paddingRightProperty.getDefault]() {
        return { value: this._defaultPaddingRight, unit: 'px' };
    }
    [paddingRightProperty.setNative](value) {
        org.nativescript.widgets.ViewHelper.setPaddingRight(this.nativeViewProtected, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderRightWidth, 0));
    }
    [paddingBottomProperty.getDefault]() {
        return { value: this._defaultPaddingBottom, unit: 'px' };
    }
    [paddingBottomProperty.setNative](value) {
        org.nativescript.widgets.ViewHelper.setPaddingBottom(this.nativeViewProtected, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderBottomWidth, 0));
    }
    [paddingLeftProperty.getDefault]() {
        return { value: this._defaultPaddingLeft, unit: 'px' };
    }
    [paddingLeftProperty.setNative](value) {
        org.nativescript.widgets.ViewHelper.setPaddingLeft(this.nativeViewProtected, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderLeftWidth, 0));
    }
    [zIndexProperty.setNative](value) {
        // API >= 21
        if (APILEVEL >= 21) {
            const nativeView = this.nativeViewProtected;
            if (!this._stateListAnimator) {
                this._stateListAnimator = nativeView.getStateListAnimator();
            }
            nativeView.setStateListAnimator(null);
        }
        org.nativescript.widgets.ViewHelper.setZIndex(this.nativeViewProtected, value);
    }
    [textAlignmentProperty.setNative](value) {
        // Button initial value is center.
        const newValue = value === 'initial' ? 'center' : value;
        super[textAlignmentProperty.setNative](newValue);
    }
    getDefaultElevation() {
        if (sdkVersion() < 21) {
            return 0;
        }
        // NOTE: Button widget has StateListAnimator that defines the elevation value and
        // at the time of the getDefault() query the animator is not applied yet so we
        // return the hardcoded @dimen/button_elevation_material value 2dp here instead
        return 2;
    }
    getDefaultDynamicElevationOffset() {
        if (sdkVersion() < 21) {
            return 0;
        }
        return 4; // 4dp @dimen/button_pressed_z_material
    }
}
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Button.prototype, "createNativeView", null);
__decorate([
    PseudoClassHandler('normal', 'highlighted', 'pressed', 'active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], Button.prototype, "_updateButtonStateChangeHandler", null);
Button.prototype._ignoreFlexMinWidthHeightReset = true;
//# sourceMappingURL=index.android.js.map