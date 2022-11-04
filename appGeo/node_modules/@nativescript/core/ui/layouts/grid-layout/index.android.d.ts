import { GridLayoutBase, ItemSpec as ItemSpecBase } from './grid-layout-common';
export * from './grid-layout-common';
export declare class ItemSpec extends ItemSpecBase {
    nativeSpec: org.nativescript.widgets.ItemSpec;
    get actualLength(): number;
}
export declare class GridLayout extends GridLayoutBase {
    nativeViewProtected: org.nativescript.widgets.GridLayout;
    createNativeView(): org.nativescript.widgets.GridLayout;
    initNativeView(): void;
    resetNativeView(): void;
    _onRowAdded(itemSpec: ItemSpec): void;
    _onColumnAdded(itemSpec: ItemSpec): void;
    _onRowRemoved(itemSpec: ItemSpec, index: number): void;
    _onColumnRemoved(itemSpec: ItemSpec, index: number): void;
    protected invalidate(): void;
}
