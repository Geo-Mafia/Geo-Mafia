import { GridLayoutBase, ItemSpec } from './grid-layout-common';
import { View } from '../../core/view';
import { layout } from '../../../utils';
export * from './grid-layout-common';
export class GridLayout extends GridLayoutBase {
    constructor() {
        super();
        this.columnOffsets = new Array();
        this.rowOffsets = new Array();
        this.map = new Map();
        this.helper = new MeasureHelper(this);
    }
    _onRowAdded(itemSpec) {
        this.helper.rows.push(new ItemGroup(itemSpec));
    }
    _onColumnAdded(itemSpec) {
        this.helper.columns.push(new ItemGroup(itemSpec));
    }
    _onRowRemoved(itemSpec, index) {
        this.helper.rows[index].children.length = 0;
        this.helper.rows.splice(index, 1);
    }
    _onColumnRemoved(itemSpec, index) {
        this.helper.columns[index].children.length = 0;
        this.helper.columns.splice(index, 1);
    }
    _registerLayoutChild(child) {
        this.addToMap(child);
    }
    _unregisterLayoutChild(child) {
        this.removeFromMap(child);
    }
    invalidate() {
        super.invalidate();
        this.requestLayout();
    }
    getColumnIndex(view) {
        return Math.max(0, Math.min(GridLayout.getColumn(view), this.columnsInternal.length - 1));
    }
    getRowIndex(view) {
        return Math.max(0, Math.min(GridLayout.getRow(view), this.rowsInternal.length - 1));
    }
    getColumnSpan(view, columnIndex) {
        return Math.max(1, Math.min(GridLayout.getColumnSpan(view), this.columnsInternal.length - columnIndex));
    }
    getRowSpan(view, rowIndex) {
        return Math.max(1, Math.min(GridLayout.getRowSpan(view), this.rowsInternal.length - rowIndex));
    }
    getColumnSpec(view) {
        return this.columnsInternal[this.getColumnIndex(view)] || this.helper.singleColumn;
    }
    getRowSpec(view) {
        return this.rowsInternal[this.getRowIndex(view)] || this.helper.singleRow;
    }
    updateMeasureSpecs(child, measureSpec) {
        const column = this.getColumnSpec(child);
        const columnIndex = this.getColumnIndex(child);
        const columnSpan = this.getColumnSpan(child, columnIndex);
        const row = this.getRowSpec(child);
        const rowIndex = this.getRowIndex(child);
        const rowSpan = this.getRowSpan(child, rowIndex);
        measureSpec.setColumn(column);
        measureSpec.setColumnIndex(columnIndex);
        measureSpec.setColumnSpan(columnSpan);
        measureSpec.setRow(row);
        measureSpec.setRowIndex(rowIndex);
        measureSpec.setRowSpan(rowSpan);
        measureSpec.autoColumnsCount = 0;
        measureSpec.autoRowsCount = 0;
        measureSpec.measured = false;
        measureSpec.pixelHeight = 0;
        measureSpec.pixelWidth = 0;
        measureSpec.starColumnsCount = 0;
        measureSpec.starRowsCount = 0;
    }
    addToMap(child) {
        this.map.set(child, new MeasureSpecs(child));
    }
    removeFromMap(child) {
        this.map.delete(child);
    }
    onMeasure(widthMeasureSpec, heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        let measureWidth = 0;
        let measureHeight = 0;
        const width = layout.getMeasureSpecSize(widthMeasureSpec);
        const widthMode = layout.getMeasureSpecMode(widthMeasureSpec);
        const height = layout.getMeasureSpecSize(heightMeasureSpec);
        const heightMode = layout.getMeasureSpecMode(heightMeasureSpec);
        const horizontalPaddingsAndMargins = this.effectivePaddingLeft + this.effectivePaddingRight + this.effectiveBorderLeftWidth + this.effectiveBorderRightWidth;
        const verticalPaddingsAndMargins = this.effectivePaddingTop + this.effectivePaddingBottom + this.effectiveBorderTopWidth + this.effectiveBorderBottomWidth;
        const infinityWidth = widthMode === layout.UNSPECIFIED;
        const infinityHeight = heightMode === layout.UNSPECIFIED;
        this.helper.width = Math.max(0, width - horizontalPaddingsAndMargins);
        this.helper.height = Math.max(0, height - verticalPaddingsAndMargins);
        this.helper.stretchedHorizontally = widthMode === layout.EXACTLY || (this.horizontalAlignment === 'stretch' && !infinityWidth);
        this.helper.stretchedVertically = heightMode === layout.EXACTLY || (this.verticalAlignment === 'stretch' && !infinityHeight);
        this.helper.setInfinityWidth(infinityWidth);
        this.helper.setInfinityHeight(infinityHeight);
        this.helper.clearMeasureSpecs();
        this.helper.init();
        this.eachLayoutChild((child, last) => {
            const measureSpecs = this.map.get(child);
            if (!measureSpecs) {
                return;
            }
            this.updateMeasureSpecs(child, measureSpecs);
            this.helper.addMeasureSpec(measureSpecs);
        });
        this.helper.measure();
        // Add in our padding
        measureWidth = this.helper.measuredWidth + horizontalPaddingsAndMargins;
        measureHeight = this.helper.measuredHeight + verticalPaddingsAndMargins;
        // Check against our minimum sizes
        measureWidth = Math.max(measureWidth, this.effectiveMinWidth);
        measureHeight = Math.max(measureHeight, this.effectiveMinHeight);
        const widthSizeAndState = View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        const heightSizeAndState = View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthSizeAndState, heightSizeAndState);
    }
    onLayout(left, top, right, bottom) {
        super.onLayout(left, top, right, bottom);
        const insets = this.getSafeAreaInsets();
        const paddingLeft = this.effectiveBorderLeftWidth + this.effectivePaddingLeft + insets.left;
        const paddingTop = this.effectiveBorderTopWidth + this.effectivePaddingTop + insets.top;
        this.columnOffsets.length = 0;
        this.rowOffsets.length = 0;
        this.columnOffsets.push(paddingLeft);
        this.rowOffsets.push(paddingTop);
        let offset = this.columnOffsets[0];
        let roundedOffset = paddingLeft;
        let roundedLength = 0;
        let actualLength = 0;
        for (let i = 0, size = this.helper.columns.length; i < size; i++) {
            const columnGroup = this.helper.columns[i];
            offset += columnGroup.length;
            actualLength = offset - roundedOffset;
            roundedLength = Math.round(actualLength);
            columnGroup.rowOrColumn._actualLength = layout.round(layout.toDeviceIndependentPixels(roundedLength));
            roundedOffset += roundedLength;
            this.columnOffsets.push(roundedOffset);
        }
        offset = this.rowOffsets[0];
        roundedOffset = paddingTop;
        roundedLength = 0;
        actualLength = 0;
        for (let i = 0, size = this.helper.rows.length; i < size; i++) {
            const rowGroup = this.helper.rows[i];
            offset += rowGroup.length;
            actualLength = offset - roundedOffset;
            roundedLength = Math.round(actualLength);
            rowGroup.rowOrColumn._actualLength = layout.round(layout.toDeviceIndependentPixels(roundedLength));
            roundedOffset += roundedLength;
            this.rowOffsets.push(roundedOffset);
        }
        for (let i = 0, columns = this.helper.columns.length; i < columns; i++) {
            const columnGroup = this.helper.columns[i];
            for (let j = 0, children = columnGroup.children.length; j < children; j++) {
                const measureSpec = columnGroup.children[j];
                const childLeft = this.columnOffsets[measureSpec.getColumnIndex()];
                const childRight = this.columnOffsets[measureSpec.getColumnIndex() + measureSpec.getColumnSpan()];
                const childTop = this.rowOffsets[measureSpec.getRowIndex()];
                const childBottom = this.rowOffsets[measureSpec.getRowIndex() + measureSpec.getRowSpan()];
                // No need to include margins in the width, height
                View.layoutChild(this, measureSpec.child, childLeft, childTop, childRight, childBottom);
            }
        }
    }
}
class MeasureSpecs {
    constructor(child) {
        this._columnSpan = 1;
        this._rowSpan = 1;
        this.pixelWidth = 0;
        this.pixelHeight = 0;
        this.starColumnsCount = 0;
        this.starRowsCount = 0;
        this.autoColumnsCount = 0;
        this.autoRowsCount = 0;
        this.measured = false;
        this.columnIndex = 0;
        this.rowIndex = 0;
        this.child = child;
    }
    getSpanned() {
        return this._columnSpan > 1 || this._rowSpan > 1;
    }
    getIsStar() {
        return this.starRowsCount > 0 || this.starColumnsCount > 0;
    }
    getColumnSpan() {
        return this._columnSpan;
    }
    getRowSpan() {
        return this._rowSpan;
    }
    setRowSpan(value) {
        // cannot have zero rowSpan.
        this._rowSpan = Math.max(1, value);
    }
    setColumnSpan(value) {
        // cannot have zero colSpan.
        this._columnSpan = Math.max(1, value);
    }
    getRowIndex() {
        return this.rowIndex;
    }
    getColumnIndex() {
        return this.columnIndex;
    }
    setRowIndex(value) {
        this.rowIndex = value;
    }
    setColumnIndex(value) {
        this.columnIndex = value;
    }
    getRow() {
        return this.row;
    }
    getColumn() {
        return this.column;
    }
    setRow(value) {
        this.row = value;
    }
    setColumn(value) {
        this.column = value;
    }
}
class ItemGroup {
    constructor(spec) {
        this.length = 0;
        this.measuredCount = 0;
        this.children = new Array();
        this.measureToFix = 0;
        this.currentMeasureToFixCount = 0;
        this.infinityLength = false;
        this.rowOrColumn = spec;
    }
    setIsLengthInfinity(infinityLength) {
        this.infinityLength = infinityLength;
    }
    init(density) {
        this.measuredCount = 0;
        this.currentMeasureToFixCount = 0;
        this.length = this.rowOrColumn.isAbsolute ? this.rowOrColumn.value * density : 0;
    }
    getAllMeasured() {
        return this.measuredCount === this.children.length;
    }
    getCanBeFixed() {
        return this.currentMeasureToFixCount === this.measureToFix;
    }
    getIsAuto() {
        return this.rowOrColumn.isAuto || (this.rowOrColumn.isStar && this.infinityLength);
    }
    getIsStar() {
        return this.rowOrColumn.isStar && !this.infinityLength;
    }
    getIsAbsolute() {
        return this.rowOrColumn.isAbsolute;
    }
}
class MeasureHelper {
    constructor(grid) {
        this.infinity = layout.makeMeasureSpec(0, layout.UNSPECIFIED);
        this.rows = new Array();
        this.columns = new Array();
        this.width = 0;
        this.height = 0;
        this.stretchedHorizontally = false;
        this.stretchedVertically = false;
        this.infinityWidth = false;
        this.infinityHeight = false;
        this.minColumnStarValue = 0;
        this.maxColumnStarValue = 0;
        this.minRowStarValue = 0;
        this.maxRowStarValue = 0;
        this.measuredWidth = 0;
        this.measuredHeight = 0;
        this.fakeRowAdded = false;
        this.fakeColumnAdded = false;
        this.grid = grid;
        this.singleRow = new ItemSpec();
        this.singleColumn = new ItemSpec();
        this.singleRowGroup = new ItemGroup(this.singleRow);
        this.singleColumnGroup = new ItemGroup(this.singleColumn);
    }
    setInfinityWidth(value) {
        this.infinityWidth = value;
        for (let i = 0, size = this.columns.length; i < size; i++) {
            const columnGroup = this.columns[i];
            columnGroup.setIsLengthInfinity(value);
        }
    }
    setInfinityHeight(value) {
        this.infinityHeight = value;
        for (let i = 0, size = this.rows.length; i < size; i++) {
            const rowGroup = this.rows[i];
            rowGroup.setIsLengthInfinity(value);
        }
    }
    addMeasureSpec(measureSpec) {
        // Get column stats
        let size = measureSpec.getColumnIndex() + measureSpec.getColumnSpan();
        for (let i = measureSpec.getColumnIndex(); i < size; i++) {
            const columnGroup = this.columns[i];
            if (columnGroup.getIsAuto()) {
                measureSpec.autoColumnsCount++;
            }
            else if (columnGroup.getIsStar()) {
                measureSpec.starColumnsCount += columnGroup.rowOrColumn.value;
            }
            else if (columnGroup.getIsAbsolute()) {
                measureSpec.pixelWidth += layout.toDevicePixels(columnGroup.rowOrColumn.value);
            }
        }
        if (measureSpec.autoColumnsCount > 0 && measureSpec.starColumnsCount === 0) {
            // Determine which auto columns are affected by this element
            for (let i = measureSpec.getColumnIndex(); i < size; i++) {
                const columnGroup = this.columns[i];
                if (columnGroup.getIsAuto()) {
                    columnGroup.measureToFix++;
                }
            }
        }
        // Get row stats
        size = measureSpec.getRowIndex() + measureSpec.getRowSpan();
        for (let i = measureSpec.getRowIndex(); i < size; i++) {
            const rowGroup = this.rows[i];
            if (rowGroup.getIsAuto()) {
                measureSpec.autoRowsCount++;
            }
            else if (rowGroup.getIsStar()) {
                measureSpec.starRowsCount += rowGroup.rowOrColumn.value;
            }
            else if (rowGroup.getIsAbsolute()) {
                measureSpec.pixelHeight += layout.toDevicePixels(rowGroup.rowOrColumn.value);
            }
        }
        if (measureSpec.autoRowsCount > 0 && measureSpec.starRowsCount === 0) {
            // Determine which auto rows are affected by this element
            for (let i = measureSpec.getRowIndex(); i < size; i++) {
                const rowGroup = this.rows[i];
                if (rowGroup.getIsAuto()) {
                    rowGroup.measureToFix++;
                }
            }
        }
        this.columns[measureSpec.getColumnIndex()].children.push(measureSpec);
        this.rows[measureSpec.getRowIndex()].children.push(measureSpec);
    }
    clearMeasureSpecs() {
        for (let i = 0, size = this.columns.length; i < size; i++) {
            this.columns[i].children.length = 0;
        }
        for (let i = 0, size = this.rows.length; i < size; i++) {
            this.rows[i].children.length = 0;
        }
    }
    static initList(list) {
        const density = layout.getDisplayDensity();
        for (let i = 0, size = list.length; i < size; i++) {
            const item = list[i];
            item.init(density);
        }
    }
    init() {
        const rows = this.rows.length;
        if (rows === 0) {
            this.singleRowGroup.setIsLengthInfinity(this.infinityHeight);
            this.rows.push(this.singleRowGroup);
            this.fakeRowAdded = true;
        }
        else if (rows > 1 && this.fakeRowAdded) {
            this.rows.splice(0, 1);
            this.fakeRowAdded = false;
        }
        const cols = this.columns.length;
        if (cols === 0) {
            this.fakeColumnAdded = true;
            this.singleColumnGroup.setIsLengthInfinity(this.infinityWidth);
            this.columns.push(this.singleColumnGroup);
        }
        else if (cols > 1 && this.fakeColumnAdded) {
            this.columns.splice(0, 1);
            this.fakeColumnAdded = false;
        }
        MeasureHelper.initList(this.rows);
        MeasureHelper.initList(this.columns);
        this.minColumnStarValue = -1;
        this.minRowStarValue = -1;
        this.maxColumnStarValue = -1;
        this.maxRowStarValue = -1;
    }
    itemMeasured(measureSpec, isFakeMeasure) {
        if (!isFakeMeasure) {
            this.columns[measureSpec.getColumnIndex()].measuredCount++;
            this.rows[measureSpec.getRowIndex()].measuredCount++;
            measureSpec.measured = true;
        }
        if (measureSpec.autoColumnsCount > 0 && measureSpec.starColumnsCount === 0) {
            const size = measureSpec.getColumnIndex() + measureSpec.getColumnSpan();
            for (let i = measureSpec.getColumnIndex(); i < size; i++) {
                const columnGroup = this.columns[i];
                if (columnGroup.getIsAuto()) {
                    columnGroup.currentMeasureToFixCount++;
                }
            }
        }
        if (measureSpec.autoRowsCount > 0 && measureSpec.starRowsCount === 0) {
            const size = measureSpec.getRowIndex() + measureSpec.getRowSpan();
            for (let i = measureSpec.getRowIndex(); i < size; i++) {
                const rowGroup = this.rows[i];
                if (rowGroup.getIsAuto()) {
                    rowGroup.currentMeasureToFixCount++;
                }
            }
        }
    }
    fixColumns() {
        let currentColumnWidth = 0;
        let columnStarCount = 0;
        const columnCount = this.columns.length;
        for (let i = 0; i < columnCount; i++) {
            const item = this.columns[i];
            if (item.rowOrColumn.isStar) {
                columnStarCount += item.rowOrColumn.value;
            }
            else {
                // Star columns are still zeros (not calculated).
                currentColumnWidth += item.length;
            }
        }
        const widthForStarColumns = Math.max(0, this.width - currentColumnWidth);
        this.maxColumnStarValue = columnStarCount > 0 ? widthForStarColumns / columnStarCount : 0;
        MeasureHelper.updateStarLength(this.columns, this.maxColumnStarValue);
    }
    fixRows() {
        let currentRowHeight = 0;
        let rowStarCount = 0;
        const rowCount = this.rows.length;
        for (let i = 0; i < rowCount; i++) {
            const item = this.rows[i];
            if (item.rowOrColumn.isStar) {
                rowStarCount += item.rowOrColumn.value;
            }
            else {
                // Star rows are still zeros (not calculated).
                currentRowHeight += item.length;
            }
        }
        const heightForStarRows = Math.max(0, this.height - currentRowHeight);
        this.maxRowStarValue = rowStarCount > 0 ? heightForStarRows / rowStarCount : 0;
        MeasureHelper.updateStarLength(this.rows, this.maxRowStarValue);
    }
    static updateStarLength(list, starValue) {
        let offset = 0;
        let roundedOffset = 0;
        for (let i = 0, rowCount = list.length; i < rowCount; i++) {
            const item = list[i];
            if (item.getIsStar()) {
                offset += item.rowOrColumn.value * starValue;
                const actualLength = offset - roundedOffset;
                const roundedLength = Math.round(actualLength);
                item.length = roundedLength;
                roundedOffset += roundedLength;
            }
        }
    }
    fakeMeasure() {
        // Fake measure - measure all elements that have star rows and auto columns - with infinity Width and infinity Height
        for (let i = 0, size = this.columns.length; i < size; i++) {
            const columnGroup = this.columns[i];
            if (columnGroup.getAllMeasured()) {
                continue;
            }
            for (let j = 0, childrenCount = columnGroup.children.length; j < childrenCount; j++) {
                const measureSpec = columnGroup.children[j];
                if (measureSpec.starRowsCount > 0 && measureSpec.autoColumnsCount > 0 && measureSpec.starColumnsCount === 0) {
                    this.measureChild(measureSpec, true);
                }
            }
        }
    }
    measureFixedColumnsNoStarRows() {
        for (let i = 0, size = this.columns.length; i < size; i++) {
            const columnGroup = this.columns[i];
            for (let j = 0, childrenCount = columnGroup.children.length; j < childrenCount; j++) {
                const measureSpec = columnGroup.children[j];
                if (measureSpec.starColumnsCount > 0 && measureSpec.starRowsCount === 0) {
                    this.measureChildFixedColumns(measureSpec);
                }
            }
        }
    }
    measureNoStarColumnsFixedRows() {
        for (let i = 0, size = this.columns.length; i < size; i++) {
            const columnGroup = this.columns[i];
            for (let j = 0, childrenCount = columnGroup.children.length; j < childrenCount; j++) {
                const measureSpec = columnGroup.children[j];
                if (measureSpec.starRowsCount > 0 && measureSpec.starColumnsCount === 0) {
                    this.measureChildFixedRows(measureSpec);
                }
            }
        }
    }
    static canFix(list) {
        for (let i = 0, size = list.length; i < size; i++) {
            const item = list[i];
            if (!item.getCanBeFixed()) {
                return false;
            }
        }
        return true;
    }
    static getMeasureLength(list) {
        let result = 0;
        for (let i = 0, size = list.length; i < size; i++) {
            const item = list[i];
            result += item.length;
        }
        return result;
    }
    measure() {
        // Measure auto & pixel columns and rows (no spans).
        let size = this.columns.length;
        for (let i = 0; i < size; i++) {
            const columnGroup = this.columns[i];
            for (let j = 0, childrenCount = columnGroup.children.length; j < childrenCount; j++) {
                const measureSpec = columnGroup.children[j];
                if (measureSpec.getIsStar() || measureSpec.getSpanned()) {
                    continue;
                }
                this.measureChild(measureSpec, false);
            }
        }
        // Measure auto & pixel columns and rows (with spans).
        for (let i = 0; i < size; i++) {
            const columnGroup = this.columns[i];
            for (let j = 0, childrenCount = columnGroup.children.length; j < childrenCount; j++) {
                const measureSpec = columnGroup.children[j];
                if (measureSpec.getIsStar() || !measureSpec.getSpanned()) {
                    continue;
                }
                this.measureChild(measureSpec, false);
            }
        }
        // try fix stars!
        const fixColumns = MeasureHelper.canFix(this.columns);
        const fixRows = MeasureHelper.canFix(this.rows);
        if (fixColumns) {
            this.fixColumns();
        }
        if (fixRows) {
            this.fixRows();
        }
        if (!fixColumns && !fixRows) {
            // Fake measure - measure all elements that have star rows and auto columns - with infinity Width and infinity Height
            // should be able to fix rows after that
            this.fakeMeasure();
            this.fixColumns();
            // Measure all elements that have star columns(already fixed), but no stars at the rows
            this.measureFixedColumnsNoStarRows();
            this.fixRows();
        }
        else if (fixColumns && !fixRows) {
            // Measure all elements that have star columns(already fixed) but no stars at the rows
            this.measureFixedColumnsNoStarRows();
            // Then
            this.fixRows();
        }
        else if (!fixColumns && fixRows) {
            // Measure all elements that have star rows(already fixed) but no star at the columns
            this.measureNoStarColumnsFixedRows();
            // Then
            this.fixColumns();
        }
        // Rows and columns are fixed here - measure remaining elements
        size = this.columns.length;
        for (let i = 0; i < size; i++) {
            const columnGroup = this.columns[i];
            for (let j = 0, childCount = columnGroup.children.length; j < childCount; j++) {
                const measureSpec = columnGroup.children[j];
                if (!measureSpec.measured) {
                    this.measureChildFixedColumnsAndRows(measureSpec);
                }
            }
        }
        // If we are not stretched and minColumnStarValue is less than maxColumnStarValue
        // we need to reduce the width of star columns.
        if (!this.stretchedHorizontally && this.minColumnStarValue !== -1 && this.minColumnStarValue < this.maxColumnStarValue) {
            MeasureHelper.updateStarLength(this.columns, this.minColumnStarValue);
        }
        // If we are not stretched and minRowStarValue is less than maxRowStarValue
        // we need to reduce the height of star maxRowStarValue.
        if (!this.stretchedVertically && this.minRowStarValue !== -1 && this.minRowStarValue < this.maxRowStarValue) {
            MeasureHelper.updateStarLength(this.rows, this.minRowStarValue);
        }
        this.measuredWidth = MeasureHelper.getMeasureLength(this.columns);
        this.measuredHeight = MeasureHelper.getMeasureLength(this.rows);
    }
    measureChild(measureSpec, isFakeMeasure) {
        const widthMeasureSpec = measureSpec.autoColumnsCount > 0 ? this.infinity : layout.makeMeasureSpec(measureSpec.pixelWidth, layout.EXACTLY);
        const heightMeasureSpec = isFakeMeasure || measureSpec.autoRowsCount > 0 ? this.infinity : layout.makeMeasureSpec(measureSpec.pixelHeight, layout.EXACTLY);
        const childSize = View.measureChild(this.grid, measureSpec.child, widthMeasureSpec, heightMeasureSpec);
        const childMeasuredWidth = childSize.measuredWidth;
        const childMeasuredHeight = childSize.measuredHeight;
        const columnSpanEnd = measureSpec.getColumnIndex() + measureSpec.getColumnSpan();
        const rowSpanEnd = measureSpec.getRowIndex() + measureSpec.getRowSpan();
        if (measureSpec.autoColumnsCount > 0) {
            let remainingSpace = childMeasuredWidth;
            for (let i = measureSpec.getColumnIndex(); i < columnSpanEnd; i++) {
                const columnGroup = this.columns[i];
                remainingSpace -= columnGroup.length;
            }
            if (remainingSpace > 0) {
                const growSize = remainingSpace / measureSpec.autoColumnsCount;
                for (let i = measureSpec.getColumnIndex(); i < columnSpanEnd; i++) {
                    const columnGroup = this.columns[i];
                    if (columnGroup.getIsAuto()) {
                        columnGroup.length += growSize;
                    }
                }
            }
        }
        if (!isFakeMeasure && measureSpec.autoRowsCount > 0) {
            let remainingSpace = childMeasuredHeight;
            for (let i = measureSpec.getRowIndex(); i < rowSpanEnd; i++) {
                const rowGroup = this.rows[i];
                remainingSpace -= rowGroup.length;
            }
            if (remainingSpace > 0) {
                const growSize = remainingSpace / measureSpec.autoRowsCount;
                for (let i = measureSpec.getRowIndex(); i < rowSpanEnd; i++) {
                    const rowGroup = this.rows[i];
                    if (rowGroup.getIsAuto()) {
                        rowGroup.length += growSize;
                    }
                }
            }
        }
        this.itemMeasured(measureSpec, isFakeMeasure);
    }
    measureChildFixedColumns(measureSpec) {
        const columnIndex = measureSpec.getColumnIndex();
        const columnSpanEnd = columnIndex + measureSpec.getColumnSpan();
        const rowIndex = measureSpec.getRowIndex();
        const rowSpanEnd = rowIndex + measureSpec.getRowSpan();
        let measureWidth = 0;
        let growSize = 0;
        for (let i = columnIndex; i < columnSpanEnd; i++) {
            const columnGroup = this.columns[i];
            measureWidth += columnGroup.length;
        }
        const widthMeasureSpec = layout.makeMeasureSpec(measureWidth, this.stretchedHorizontally ? layout.EXACTLY : layout.AT_MOST);
        const heightMeasureSpec = measureSpec.autoRowsCount > 0 ? this.infinity : layout.makeMeasureSpec(measureSpec.pixelHeight, layout.EXACTLY);
        const childSize = View.measureChild(this.grid, measureSpec.child, widthMeasureSpec, heightMeasureSpec);
        const childMeasuredWidth = childSize.measuredWidth;
        const childMeasuredHeight = childSize.measuredHeight;
        this.updateMinColumnStarValueIfNeeded(measureSpec, childMeasuredWidth);
        // Distribute height over auto rows
        if (measureSpec.autoRowsCount > 0) {
            let remainingSpace = childMeasuredHeight;
            for (let i = rowIndex; i < rowSpanEnd; i++) {
                const rowGroup = this.rows[i];
                remainingSpace -= rowGroup.length;
            }
            if (remainingSpace > 0) {
                growSize = remainingSpace / measureSpec.autoRowsCount;
                for (let i = rowIndex; i < rowSpanEnd; i++) {
                    const rowGroup = this.rows[i];
                    if (rowGroup.getIsAuto()) {
                        rowGroup.length += growSize;
                    }
                }
            }
        }
        this.itemMeasured(measureSpec, false);
    }
    measureChildFixedRows(measureSpec) {
        const columnIndex = measureSpec.getColumnIndex();
        const columnSpanEnd = columnIndex + measureSpec.getColumnSpan();
        const rowIndex = measureSpec.getRowIndex();
        const rowSpanEnd = rowIndex + measureSpec.getRowSpan();
        let measureHeight = 0;
        for (let i = rowIndex; i < rowSpanEnd; i++) {
            const rowGroup = this.rows[i];
            measureHeight += rowGroup.length;
        }
        const widthMeasureSpec = measureSpec.autoColumnsCount > 0 ? this.infinity : layout.makeMeasureSpec(measureSpec.pixelWidth, layout.EXACTLY);
        const heightMeasureSpec = layout.makeMeasureSpec(measureHeight, this.stretchedVertically ? layout.EXACTLY : layout.AT_MOST);
        const childSize = View.measureChild(this.grid, measureSpec.child, widthMeasureSpec, heightMeasureSpec);
        const childMeasuredWidth = childSize.measuredWidth;
        const childMeasuredHeight = childSize.measuredHeight;
        let remainingSpace = 0;
        let growSize = 0;
        // Distribute width over auto columns
        if (measureSpec.autoColumnsCount > 0) {
            remainingSpace = childMeasuredWidth;
            for (let i = columnIndex; i < columnSpanEnd; i++) {
                const columnGroup = this.columns[i];
                remainingSpace -= columnGroup.length;
            }
            if (remainingSpace > 0) {
                growSize = remainingSpace / measureSpec.autoColumnsCount;
                for (let i = columnIndex; i < columnSpanEnd; i++) {
                    const columnGroup = this.columns[i];
                    if (columnGroup.getIsAuto()) {
                        columnGroup.length += growSize;
                    }
                }
            }
        }
        this.updateMinRowStarValueIfNeeded(measureSpec, childMeasuredHeight);
        this.itemMeasured(measureSpec, false);
    }
    measureChildFixedColumnsAndRows(measureSpec) {
        const columnIndex = measureSpec.getColumnIndex();
        const columnSpanEnd = columnIndex + measureSpec.getColumnSpan();
        const rowIndex = measureSpec.getRowIndex();
        const rowSpanEnd = rowIndex + measureSpec.getRowSpan();
        let measureWidth = 0;
        for (let i = columnIndex; i < columnSpanEnd; i++) {
            const columnGroup = this.columns[i];
            measureWidth += columnGroup.length;
        }
        let measureHeight = 0;
        for (let i = rowIndex; i < rowSpanEnd; i++) {
            const rowGroup = this.rows[i];
            measureHeight += rowGroup.length;
        }
        // if (have stars) & (not stretch) - at most
        const widthMeasureSpec = layout.makeMeasureSpec(measureWidth, measureSpec.starColumnsCount > 0 && !this.stretchedHorizontally ? layout.AT_MOST : layout.EXACTLY);
        const heightMeasureSpec = layout.makeMeasureSpec(measureHeight, measureSpec.starRowsCount > 0 && !this.stretchedVertically ? layout.AT_MOST : layout.EXACTLY);
        const childSize = View.measureChild(this.grid, measureSpec.child, widthMeasureSpec, heightMeasureSpec);
        const childMeasuredWidth = childSize.measuredWidth;
        const childMeasuredHeight = childSize.measuredHeight;
        this.updateMinColumnStarValueIfNeeded(measureSpec, childMeasuredWidth);
        this.updateMinRowStarValueIfNeeded(measureSpec, childMeasuredHeight);
        this.itemMeasured(measureSpec, false);
    }
    updateMinRowStarValueIfNeeded(measureSpec, childMeasuredHeight) {
        if (!this.stretchedVertically && measureSpec.starRowsCount > 0) {
            let remainingSpace = childMeasuredHeight;
            const rowIndex = measureSpec.getRowIndex();
            const rowSpanEnd = rowIndex + measureSpec.getRowSpan();
            for (let i = rowIndex; i < rowSpanEnd; i++) {
                const rowGroup = this.rows[i];
                if (!rowGroup.getIsStar()) {
                    remainingSpace -= rowGroup.length;
                }
            }
            if (remainingSpace > 0) {
                this.minRowStarValue = Math.max(remainingSpace / measureSpec.starRowsCount, this.minRowStarValue);
            }
        }
    }
    updateMinColumnStarValueIfNeeded(measureSpec, childMeasuredWidth) {
        // When not stretched star columns are not fixed so we may grow them here
        // if there is an element that spans on multiple columns
        if (!this.stretchedHorizontally && measureSpec.starColumnsCount > 0) {
            let remainingSpace = childMeasuredWidth;
            const columnIndex = measureSpec.getColumnIndex();
            const columnSpanEnd = columnIndex + measureSpec.getColumnSpan();
            for (let i = columnIndex; i < columnSpanEnd; i++) {
                const columnGroup = this.columns[i];
                if (!columnGroup.getIsStar()) {
                    remainingSpace -= columnGroup.length;
                }
            }
            if (remainingSpace > 0) {
                this.minColumnStarValue = Math.max(remainingSpace / measureSpec.starColumnsCount, this.minColumnStarValue);
            }
        }
    }
}
//# sourceMappingURL=index.ios.js.map