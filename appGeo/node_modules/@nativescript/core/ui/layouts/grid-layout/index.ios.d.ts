import { GridLayoutBase, ItemSpec } from './grid-layout-common';
import { View } from '../../core/view';
export * from './grid-layout-common';
export declare class GridLayout extends GridLayoutBase {
    private helper;
    private columnOffsets;
    private rowOffsets;
    private map;
    constructor();
    _onRowAdded(itemSpec: ItemSpec): void;
    _onColumnAdded(itemSpec: ItemSpec): void;
    _onRowRemoved(itemSpec: ItemSpec, index: number): void;
    _onColumnRemoved(itemSpec: ItemSpec, index: number): void;
    _registerLayoutChild(child: View): void;
    _unregisterLayoutChild(child: View): void;
    protected invalidate(): void;
    private getColumnIndex;
    private getRowIndex;
    private getColumnSpan;
    private getRowSpan;
    private getColumnSpec;
    private getRowSpec;
    private updateMeasureSpecs;
    private addToMap;
    private removeFromMap;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
}
