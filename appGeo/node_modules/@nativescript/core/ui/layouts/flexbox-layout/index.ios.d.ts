import { FlexboxLayoutBase } from './flexbox-layout-common';
import { View } from '../../core/view';
export * from './flexbox-layout-common';
export declare class FlexboxLayout extends FlexboxLayoutBase {
    private _reorderedIndices;
    private _orderCache;
    private _flexLines;
    private _childrenFrozen;
    private measureContext;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    private _getReorderedChildAt;
    private _createReorderedIndices;
    private _sortOrdersIntoReorderedIndices;
    private _createOrders;
    private get _isOrderChangedFromLastMeasurement();
    private _measureHorizontal;
    private _measureVertical;
    private _checkSizeConstraints;
    private _addFlexLineIfLastFlexItem;
    private _addFlexLine;
    private _determineMainSize;
    private _expandFlexItems;
    private _shrinkFlexItems;
    private _determineCrossSize;
    private _stretchViews;
    private _stretchViewVertically;
    private _stretchViewHorizontally;
    private _setMeasuredDimensionForFlex;
    private _isWrapRequired;
    private _getLargestMainSize;
    private _getSumOfCrossSize;
    private _isMainAxisDirectionHorizontal;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    private _layoutHorizontal;
    private _layoutSingleChildHorizontal;
    private _layoutVertical;
    private _layoutSingleChildVertical;
    private static getChildMeasureSpec;
}
export declare namespace FlexboxLayout {
    function getBaseline(child: View): number;
    function getPaddingStart(child: View): number;
    function getPaddingEnd(child: View): number;
}
