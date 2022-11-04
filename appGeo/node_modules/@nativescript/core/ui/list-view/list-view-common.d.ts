import { ListView as ListViewDefinition, ItemsSource, ItemEventData, TemplatedItemsView } from '.';
import { View, ContainerView, Template, KeyedTemplate } from '../core/view';
import { Property, CoercibleProperty, CssProperty } from '../core/properties';
import { Style } from '../styling/style';
import { Color } from '../../color';
import { EventData } from '../../data/observable';
import { ChangedData } from '../../data/observable-array';
import { CoreTypes } from '../../core-types';
export declare abstract class ListViewBase extends ContainerView implements ListViewDefinition, TemplatedItemsView {
    static itemLoadingEvent: string;
    static itemTapEvent: string;
    static loadMoreItemsEvent: string;
    static knownFunctions: string[];
    private _itemIdGenerator;
    private _itemTemplateSelector;
    private _itemTemplateSelectorBindable;
    _defaultTemplate: KeyedTemplate;
    _itemTemplatesInternal: KeyedTemplate[];
    _effectiveRowHeight: number;
    rowHeight: CoreTypes.LengthType;
    iosEstimatedRowHeight: CoreTypes.LengthType;
    items: any[] | ItemsSource;
    itemTemplate: string | Template;
    itemTemplates: string | Array<KeyedTemplate>;
    get separatorColor(): Color;
    set separatorColor(value: Color);
    get itemTemplateSelector(): string | ((item: any, index: number, items: any) => string);
    set itemTemplateSelector(value: string | ((item: any, index: number, items: any) => string));
    get itemIdGenerator(): (item: any, index: number, items: any) => number;
    set itemIdGenerator(generatorFn: (item: any, index: number, items: any) => number);
    refresh(): void;
    scrollToIndex(index: number): void;
    scrollToIndexAnimated(index: number): void;
    _getItemTemplate(index: number): KeyedTemplate;
    _prepareItem(item: View, index: number): void;
    private _getDataItem;
    _getDefaultItemContent(index: number): View;
    _onItemsChanged(args: ChangedData<any>): void;
    _onRowHeightPropertyChanged(oldValue: CoreTypes.LengthType, newValue: CoreTypes.LengthType): void;
    isItemAtIndexVisible(index: number): boolean;
    protected updateEffectiveRowHeight(): void;
}
export interface ListViewBase {
    on(eventNames: string, callback: (data: EventData) => void, thisArg?: any): void;
    on(event: 'itemLoading', callback: (args: ItemEventData) => void, thisArg?: any): void;
    on(event: 'itemTap', callback: (args: ItemEventData) => void, thisArg?: any): void;
    on(event: 'loadMoreItems', callback: (args: EventData) => void, thisArg?: any): void;
}
/**
 * Represents the property backing the items property of each ListView instance.
 */
export declare const itemsProperty: Property<ListViewBase, any[] | ItemsSource>;
/**
 * Represents the item template property of each ListView instance.
 */
export declare const itemTemplateProperty: Property<ListViewBase, string | Template>;
/**
 * Represents the items template property of each ListView instance.
 */
export declare const itemTemplatesProperty: Property<ListViewBase, string | KeyedTemplate[]>;
/**
 * Represents the observable property backing the rowHeight property of each ListView instance.
 */
export declare const rowHeightProperty: CoercibleProperty<ListViewBase, CoreTypes.LengthType>;
export declare const iosEstimatedRowHeightProperty: Property<ListViewBase, CoreTypes.LengthType>;
export declare const separatorColorProperty: CssProperty<Style, Color>;
