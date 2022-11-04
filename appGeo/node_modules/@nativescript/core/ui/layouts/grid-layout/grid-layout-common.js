var GridLayoutBase_1;
import { LayoutBase } from '../layout-base';
import { View, CSSType } from '../../core/view';
import { Property, makeParser, makeValidator } from '../../core/properties';
import { Observable } from '../../../data/observable';
function validateArgs(element) {
    if (!element) {
        throw new Error('element cannot be null or undefined.');
    }
    return element;
}
View.prototype.row = 0;
View.prototype.col = 0;
View.prototype.rowSpan = 1;
View.prototype.colSpan = 1;
Object.defineProperty(View.prototype, 'column', {
    get() {
        return this.col;
    },
    set(value) {
        this.col = value;
    },
    enumerable: true,
    configurable: true,
});
Object.defineProperty(View.prototype, 'columnSpan', {
    get() {
        return this.colSpan;
    },
    set(value) {
        this.colSpan = value;
    },
    enumerable: true,
    configurable: true,
});
function validateItemSpec(itemSpec) {
    if (!itemSpec) {
        throw new Error('Value cannot be undefined.');
    }
    if (itemSpec.owner) {
        throw new Error('itemSpec is already added to GridLayout.');
    }
}
function convertGridLength(value) {
    if (value === GridUnitType.AUTO) {
        return ItemSpec.create(1, GridUnitType.AUTO);
    }
    else if (value.indexOf('*') !== -1) {
        const starCount = parseInt(value.replace('*', '') || '1');
        return ItemSpec.create(starCount, GridUnitType.STAR);
    }
    else if (!isNaN(parseInt(value))) {
        return ItemSpec.create(parseInt(value), GridUnitType.PIXEL);
    }
    else {
        throw new Error(`Cannot parse item spec from string: ${value}`);
    }
}
function parseAndAddItemSpecs(value, func) {
    // ensure value is a string since view bindings could be parsed as number/int's here
    const arr = `${value}`.split(/[\s,]+/);
    for (let i = 0, length = arr.length; i < length; i++) {
        const str = arr[i].trim();
        if (str.length > 0) {
            func(convertGridLength(arr[i].trim()));
        }
    }
}
export class ItemSpec extends Observable {
    constructor() {
        super();
        this._actualLength = 0;
        if (arguments.length === 0) {
            this._value = 1;
            this._unitType = GridUnitType.STAR;
        }
        else if (arguments.length === 2) {
            const value = arguments[0];
            const type = arguments[1];
            if (typeof value === 'number' && typeof type === 'string') {
                if (value < 0 || isNaN(value) || !isFinite(value)) {
                    throw new Error(`Value should not be negative, NaN or Infinity: ${value}`);
                }
                this._value = value;
                this._unitType = GridUnitType.parse(type);
            }
            else {
                throw new Error('First argument should be number, second argument should be string.');
            }
        }
        else {
            throw new Error('ItemSpec expects 0 or 2 arguments');
        }
        this.index = -1;
    }
    static create(value, type) {
        const spec = new ItemSpec();
        spec._value = value;
        spec._unitType = type;
        return spec;
    }
    get actualLength() {
        return this._actualLength;
    }
    static equals(value1, value2) {
        return value1.gridUnitType === value2.gridUnitType && value1.value === value2.value && value1.owner === value2.owner && value1.index === value2.index;
    }
    get gridUnitType() {
        return this._unitType;
    }
    get isAbsolute() {
        return this._unitType === GridUnitType.PIXEL;
    }
    get isAuto() {
        return this._unitType === GridUnitType.AUTO;
    }
    get isStar() {
        return this._unitType === GridUnitType.STAR;
    }
    get value() {
        return this._value;
    }
}
let GridLayoutBase = GridLayoutBase_1 = class GridLayoutBase extends LayoutBase {
    constructor() {
        super(...arguments);
        this._rows = new Array();
        this._cols = new Array();
    }
    static getColumn(element) {
        return validateArgs(element).col;
    }
    static setColumn(element, value) {
        validateArgs(element).col = value;
    }
    static getColumnSpan(element) {
        return validateArgs(element).colSpan;
    }
    static setColumnSpan(element, value) {
        validateArgs(element).colSpan = value;
    }
    static getRow(element) {
        return validateArgs(element).row;
    }
    static setRow(element, value) {
        validateArgs(element).row = value;
    }
    static getRowSpan(element) {
        return validateArgs(element).rowSpan;
    }
    static setRowSpan(element, value) {
        validateArgs(element).rowSpan = value;
    }
    addRow(itemSpec) {
        validateItemSpec(itemSpec);
        itemSpec.owner = this;
        this._rows.push(itemSpec);
        this._onRowAdded(itemSpec);
        this.invalidate();
    }
    addColumn(itemSpec) {
        validateItemSpec(itemSpec);
        itemSpec.owner = this;
        this._cols.push(itemSpec);
        this._onColumnAdded(itemSpec);
        this.invalidate();
    }
    addChildAtCell(view, row, column, rowSpan, columnSpan) {
        this.addChild(view);
        GridLayoutBase_1.setRow(view, row);
        GridLayoutBase_1.setColumn(view, column);
        if (rowSpan) {
            GridLayoutBase_1.setRowSpan(view, rowSpan);
        }
        if (columnSpan) {
            GridLayoutBase_1.setColumnSpan(view, columnSpan);
        }
    }
    removeRow(itemSpec) {
        if (!itemSpec) {
            throw new Error('Value is null.');
        }
        const index = this._rows.indexOf(itemSpec);
        if (itemSpec.owner !== this || index < 0) {
            throw new Error('Row is not child of this GridLayout');
        }
        itemSpec.index = -1;
        this._rows.splice(index, 1);
        this._onRowRemoved(itemSpec, index);
        this.invalidate();
    }
    removeColumn(itemSpec) {
        if (!itemSpec) {
            throw new Error('Value is null.');
        }
        const index = this._cols.indexOf(itemSpec);
        if (itemSpec.owner !== this || index < 0) {
            throw new Error('Column is not child of this GridLayout');
        }
        itemSpec.index = -1;
        this._cols.splice(index, 1);
        this._onColumnRemoved(itemSpec, index);
        this.invalidate();
    }
    removeColumns() {
        for (let i = this._cols.length - 1; i >= 0; i--) {
            const colSpec = this._cols[i];
            this._onColumnRemoved(colSpec, i);
            colSpec.index = -1;
        }
        this._cols.length = 0;
        this.invalidate();
    }
    removeRows() {
        for (let i = this._rows.length - 1; i >= 0; i--) {
            const rowSpec = this._rows[i];
            this._onRowRemoved(rowSpec, i);
            rowSpec.index = -1;
        }
        this._rows.length = 0;
        this.invalidate();
    }
    onRowChanged(element, oldValue, newValue) {
        this.invalidate();
    }
    onRowSpanChanged(element, oldValue, newValue) {
        this.invalidate();
    }
    onColumnChanged(element, oldValue, newValue) {
        this.invalidate();
    }
    onColumnSpanChanged(element, oldValue, newValue) {
        this.invalidate();
    }
    _onRowAdded(itemSpec) {
        //
    }
    _onColumnAdded(itemSpec) {
        //
    }
    _onRowRemoved(itemSpec, index) {
        //
    }
    _onColumnRemoved(itemSpec, index) {
        //
    }
    getColumns() {
        return this._cols.slice();
    }
    getRows() {
        return this._rows.slice();
    }
    get columnsInternal() {
        return this._cols;
    }
    get rowsInternal() {
        return this._rows;
    }
    invalidate() {
        // handled natively in android and overridden in ios.
    }
    set rows(value) {
        this.removeRows();
        parseAndAddItemSpecs(value, (spec) => this.addRow(spec));
    }
    set columns(value) {
        this.removeColumns();
        parseAndAddItemSpecs(value, (spec) => this.addColumn(spec));
    }
};
GridLayoutBase = GridLayoutBase_1 = __decorate([
    CSSType('GridLayout')
], GridLayoutBase);
export { GridLayoutBase };
GridLayoutBase.prototype.recycleNativeView = 'auto';
export const columnProperty = new Property({
    name: 'col',
    defaultValue: 0,
    valueChanged: (target, oldValue, newValue) => {
        const grid = target.parent;
        if (grid instanceof GridLayoutBase) {
            grid.onColumnChanged(target, oldValue, newValue);
        }
    },
    valueConverter: (v) => Math.max(0, parseInt(v)),
});
columnProperty.register(View);
export const columnSpanProperty = new Property({
    name: 'colSpan',
    defaultValue: 1,
    valueChanged: (target, oldValue, newValue) => {
        const grid = target.parent;
        if (grid instanceof GridLayoutBase) {
            grid.onColumnSpanChanged(target, oldValue, newValue);
        }
    },
    valueConverter: (v) => Math.max(1, parseInt(v)),
});
columnSpanProperty.register(View);
export const rowProperty = new Property({
    name: 'row',
    defaultValue: 0,
    valueChanged: (target, oldValue, newValue) => {
        const grid = target.parent;
        if (grid instanceof GridLayoutBase) {
            grid.onRowChanged(target, oldValue, newValue);
        }
    },
    valueConverter: (v) => Math.max(0, parseInt(v)),
});
rowProperty.register(View);
export const rowSpanProperty = new Property({
    name: 'rowSpan',
    defaultValue: 1,
    valueChanged: (target, oldValue, newValue) => {
        const grid = target.parent;
        if (grid instanceof GridLayoutBase) {
            grid.onRowSpanChanged(target, oldValue, newValue);
        }
    },
    valueConverter: (v) => Math.max(1, parseInt(v)),
});
rowSpanProperty.register(View);
export var GridUnitType;
(function (GridUnitType) {
    GridUnitType.PIXEL = 'pixel';
    GridUnitType.STAR = 'star';
    GridUnitType.AUTO = 'auto';
    GridUnitType.isValid = makeValidator(GridUnitType.PIXEL, GridUnitType.STAR, GridUnitType.AUTO);
    GridUnitType.parse = makeParser(GridUnitType.isValid);
})(GridUnitType || (GridUnitType = {}));
//# sourceMappingURL=grid-layout-common.js.map