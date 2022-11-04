import { View } from '../core/view';
import { Property, CoercibleProperty } from '../core/properties';
export interface ItemsSource {
    length: number;
    getItem(index: number): any;
}
export declare class ListPickerBase extends View {
    selectedIndex: number;
    items: any[] | ItemsSource;
    isItemsSource: boolean;
    textField: string;
    valueField: string;
    selectedValue: any;
    _getItemAsString(index: number): any;
    private parseItem;
    updateSelectedValue(index: any): void;
}
export declare const selectedIndexProperty: CoercibleProperty<ListPickerBase, number>;
export declare const itemsProperty: Property<ListPickerBase, any[] | ItemsSource>;
export declare const textFieldProperty: Property<ListPickerBase, string>;
export declare const valueFieldProperty: Property<ListPickerBase, string>;
export declare const selectedValueProperty: Property<ListPickerBase, string>;
