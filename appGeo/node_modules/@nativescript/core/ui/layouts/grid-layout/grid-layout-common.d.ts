import { GridLayout as GridLayoutDefinition, ItemSpec as ItemSpecDefinition } from '.';
import { LayoutBase } from '../layout-base';
import { View } from '../../core/view';
import { Property } from '../../core/properties';
import { Observable } from '../../../data/observable';
export declare class ItemSpec extends Observable implements ItemSpecDefinition {
    private _value;
    private _unitType;
    constructor();
    owner: GridLayoutBase;
    index: number;
    _actualLength: number;
    static create(value: number, type: GridUnitType): ItemSpec;
    get actualLength(): number;
    static equals(value1: ItemSpec, value2: ItemSpec): boolean;
    get gridUnitType(): GridUnitType;
    get isAbsolute(): boolean;
    get isAuto(): boolean;
    get isStar(): boolean;
    get value(): number;
}
export declare class GridLayoutBase extends LayoutBase implements GridLayoutDefinition {
    private _rows;
    private _cols;
    static getColumn(element: View): number;
    static setColumn(element: View, value: number): void;
    static getColumnSpan(element: View): number;
    static setColumnSpan(element: View, value: number): void;
    static getRow(element: View): number;
    static setRow(element: View, value: number): void;
    static getRowSpan(element: View): number;
    static setRowSpan(element: View, value: number): void;
    addRow(itemSpec: ItemSpec): void;
    addColumn(itemSpec: ItemSpec): void;
    addChildAtCell(view: View, row: number, column: number, rowSpan?: number, columnSpan?: number): void;
    removeRow(itemSpec: ItemSpec): void;
    removeColumn(itemSpec: ItemSpec): void;
    removeColumns(): void;
    removeRows(): void;
    onRowChanged(element: View, oldValue: number, newValue: number): void;
    onRowSpanChanged(element: View, oldValue: number, newValue: number): void;
    onColumnChanged(element: View, oldValue: number, newValue: number): void;
    onColumnSpanChanged(element: View, oldValue: number, newValue: number): void;
    _onRowAdded(itemSpec: ItemSpec): void;
    _onColumnAdded(itemSpec: ItemSpec): void;
    _onRowRemoved(itemSpec: ItemSpec, index: number): void;
    _onColumnRemoved(itemSpec: ItemSpec, index: number): void;
    getColumns(): Array<ItemSpec>;
    getRows(): Array<ItemSpec>;
    protected get columnsInternal(): Array<ItemSpec>;
    protected get rowsInternal(): Array<ItemSpec>;
    protected invalidate(): void;
    set rows(value: string);
    set columns(value: string);
}
export declare const columnProperty: Property<View, number>;
export declare const columnSpanProperty: Property<View, number>;
export declare const rowProperty: Property<View, number>;
export declare const rowSpanProperty: Property<View, number>;
export declare type GridUnitType = 'pixel' | 'star' | 'auto';
export declare namespace GridUnitType {
    const PIXEL: 'pixel';
    const STAR: 'star';
    const AUTO: 'auto';
    const isValid: (value: any) => value is GridUnitType;
    const parse: (value: any) => GridUnitType;
}
