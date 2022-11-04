import { LayoutBaseCommon, clipToBoundsProperty, isPassThroughParentEnabledProperty } from './layout-base-common';
export * from './layout-base-common';
export class LayoutBase extends LayoutBaseCommon {
    addChild(child) {
        super.addChild(child);
        this.requestLayout();
    }
    insertChild(child, atIndex) {
        super.insertChild(child, atIndex);
        this.requestLayout();
    }
    removeChild(child) {
        super.removeChild(child);
        this.requestLayout();
    }
    _setNativeClipToBounds() {
        if (this.clipToBounds) {
            this.nativeViewProtected.clipsToBounds = true;
        }
        else {
            super._setNativeClipToBounds();
        }
    }
    [clipToBoundsProperty.getDefault]() {
        return false;
    }
    [clipToBoundsProperty.setNative](value) {
        this._setNativeClipToBounds();
    }
    [isPassThroughParentEnabledProperty.setNative](value) {
        this.nativeViewProtected.setPassThroughParent(value);
    }
}
//# sourceMappingURL=layout-base.ios.js.map