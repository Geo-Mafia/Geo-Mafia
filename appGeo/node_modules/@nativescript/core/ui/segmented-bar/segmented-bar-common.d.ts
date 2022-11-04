import { SegmentedBar as SegmentedBarDefinition, SegmentedBarItem as SegmentedBarItemDefinition, SelectedIndexChangedEventData } from '.';
import { View, AddChildFromBuilder, AddArrayFromBuilder } from '../core/view';
import { ViewBase } from '../core/view-base';
import { Property, CoercibleProperty, InheritedCssProperty } from '../core/properties';
import { Color } from '../../color';
import { Style } from '../styling/style';
import { EventData } from '../../data/observable';
export declare abstract class SegmentedBarItemBase extends ViewBase implements SegmentedBarItemDefinition {
    private _title;
    get title(): string;
    set title(value: string);
    abstract _update(): any;
}
export declare abstract class SegmentedBarBase extends View implements SegmentedBarDefinition, AddChildFromBuilder, AddArrayFromBuilder {
    static selectedIndexChangedEvent: string;
    selectedIndex: number;
    items: Array<SegmentedBarItemDefinition>;
    get selectedBackgroundColor(): Color;
    set selectedBackgroundColor(value: Color);
    _addArrayFromBuilder(name: string, value: Array<any>): void;
    _addChildFromBuilder(name: string, value: any): void;
    onItemsChanged(oldItems: SegmentedBarItemDefinition[], newItems: SegmentedBarItemDefinition[]): void;
    eachChild(callback: (child: ViewBase) => boolean): void;
}
export interface SegmentedBarBase {
    on(eventNames: string, callback: (data: EventData) => void, thisArg?: any): any;
    on(event: 'selectedIndexChanged', callback: (args: SelectedIndexChangedEventData) => void, thisArg?: any): any;
}
/**
 * Gets or sets the selected index dependency property of the SegmentedBar.
 */
export declare const selectedIndexProperty: CoercibleProperty<SegmentedBarBase, number>;
export declare const itemsProperty: Property<SegmentedBarBase, SegmentedBarItemDefinition[]>;
export declare const selectedBackgroundColorProperty: InheritedCssProperty<Style, Color>;
