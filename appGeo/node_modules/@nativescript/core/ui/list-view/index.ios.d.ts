import { ListViewBase } from './list-view-common';
import { CoreTypes } from '../../core-types';
import { View } from '../core/view';
export * from './list-view-common';
declare class ListViewCell extends UITableViewCell {
    static initWithEmptyBackground(): ListViewCell;
    initWithStyleReuseIdentifier(style: UITableViewCellStyle, reuseIdentifier: string): this;
    willMoveToSuperview(newSuperview: UIView): void;
    get view(): View;
    owner: WeakRef<View>;
}
export declare class ListView extends ListViewBase {
    nativeViewProtected: UITableView;
    private _dataSource;
    private _delegate;
    private _heights;
    private _preparingCell;
    private _isDataDirty;
    private _map;
    widthMeasureSpec: number;
    constructor();
    createNativeView(): UITableView;
    initNativeView(): void;
    disposeNativeView(): void;
    _setNativeClipToBounds(): void;
    onLoaded(): void;
    onUnloaded(): void;
    get ios(): UITableView;
    get _childrenCount(): number;
    eachChildView(callback: (child: View) => boolean): void;
    scrollToIndex(index: number): void;
    scrollToIndexAnimated(index: number): void;
    private _scrollToIndex;
    refresh(): void;
    isItemAtIndexVisible(itemIndex: number): boolean;
    getHeight(index: number): number;
    setHeight(index: number, value: number): void;
    _onRowHeightPropertyChanged(oldValue: CoreTypes.LengthType, newValue: CoreTypes.LengthType): void;
    requestLayout(): void;
    measure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    private _layoutCell;
    _prepareCell(cell: ListViewCell, indexPath: NSIndexPath): number;
    _removeContainer(cell: ListViewCell): void;
}
