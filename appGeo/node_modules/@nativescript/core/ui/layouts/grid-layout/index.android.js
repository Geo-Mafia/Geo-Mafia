import { GridLayoutBase, ItemSpec as ItemSpecBase, rowProperty, columnProperty, rowSpanProperty, columnSpanProperty, GridUnitType } from './grid-layout-common';
import { View } from '../../core/view';
import { layout } from '../../../utils';
export * from './grid-layout-common';
function makeNativeSetter(setter) {
    return function (value) {
        const nativeView = this.nativeViewProtected;
        const lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
        if (lp instanceof org.nativescript.widgets.CommonLayoutParams) {
            setter(lp, value);
            nativeView.setLayoutParams(lp);
        }
    };
}
View.prototype[rowProperty.setNative] = makeNativeSetter((lp, value) => (lp.row = value));
View.prototype[columnProperty.setNative] = makeNativeSetter((lp, value) => (lp.column = value));
View.prototype[rowSpanProperty.setNative] = makeNativeSetter((lp, value) => (lp.rowSpan = value));
View.prototype[columnSpanProperty.setNative] = makeNativeSetter((lp, value) => (lp.columnSpan = value));
function createNativeSpec(itemSpec) {
    switch (itemSpec.gridUnitType) {
        case GridUnitType.AUTO:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value, org.nativescript.widgets.GridUnitType.auto);
        case GridUnitType.STAR:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value, org.nativescript.widgets.GridUnitType.star);
        case GridUnitType.PIXEL:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value * layout.getDisplayDensity(), org.nativescript.widgets.GridUnitType.pixel);
        default:
            throw new Error('Invalid gridUnitType: ' + itemSpec.gridUnitType);
    }
}
export class ItemSpec extends ItemSpecBase {
    get actualLength() {
        if (this.nativeSpec) {
            return Math.round(this.nativeSpec.getActualLength() / layout.getDisplayDensity());
        }
        return 0;
    }
}
export class GridLayout extends GridLayoutBase {
    createNativeView() {
        return new org.nativescript.widgets.GridLayout(this._context);
    }
    initNativeView() {
        super.initNativeView();
        // Update native GridLayout
        this.rowsInternal.forEach((itemSpec, index, rows) => {
            this._onRowAdded(itemSpec);
        }, this);
        this.columnsInternal.forEach((itemSpec, index, rows) => {
            this._onColumnAdded(itemSpec);
        }, this);
    }
    resetNativeView() {
        // Update native GridLayout
        for (let i = this.rowsInternal.length; i--; i >= 0) {
            const itemSpec = this.rowsInternal[i];
            this._onRowRemoved(itemSpec, i);
        }
        for (let i = this.columnsInternal.length; i--; i >= 0) {
            const itemSpec = this.columnsInternal[i];
            this._onColumnRemoved(itemSpec, i);
        }
        super.resetNativeView();
    }
    _onRowAdded(itemSpec) {
        if (this.nativeViewProtected) {
            const nativeSpec = createNativeSpec(itemSpec);
            itemSpec.nativeSpec = nativeSpec;
            this.nativeViewProtected.addRow(nativeSpec);
        }
    }
    _onColumnAdded(itemSpec) {
        if (this.nativeViewProtected) {
            const nativeSpec = createNativeSpec(itemSpec);
            itemSpec.nativeSpec = nativeSpec;
            this.nativeViewProtected.addColumn(nativeSpec);
        }
    }
    _onRowRemoved(itemSpec, index) {
        itemSpec.nativeSpec = null;
        if (this.nativeViewProtected) {
            this.nativeViewProtected.removeRowAt(index);
        }
    }
    _onColumnRemoved(itemSpec, index) {
        itemSpec.nativeSpec = null;
        if (this.nativeViewProtected) {
            this.nativeViewProtected.removeColumnAt(index);
        }
    }
    invalidate() {
        // No need to request layout for android because it will be done in the native call.
    }
}
//# sourceMappingURL=index.android.js.map