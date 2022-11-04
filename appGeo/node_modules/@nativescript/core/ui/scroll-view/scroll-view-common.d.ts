import { ScrollView as ScrollViewDefinition, ScrollEventData } from '.';
import { ContentView } from '../content-view';
import { Property } from '../core/properties';
import { EventData } from '../../data/observable';
import { CoreTypes } from '../../core-types';
export declare abstract class ScrollViewBase extends ContentView implements ScrollViewDefinition {
    private _scrollChangeCount;
    static scrollEvent: string;
    orientation: CoreTypes.OrientationType;
    scrollBarIndicatorVisible: boolean;
    isScrollEnabled: boolean;
    addEventListener(arg: string, callback: any, thisArg?: any): void;
    removeEventListener(arg: string, callback: any, thisArg?: any): void;
    onLoaded(): void;
    onUnloaded(): void;
    private attach;
    private dettach;
    protected attachNative(): void;
    protected dettachNative(): void;
    get horizontalOffset(): number;
    get verticalOffset(): number;
    get scrollableWidth(): number;
    get scrollableHeight(): number;
    abstract scrollToVerticalOffset(value: number, animated: boolean): any;
    abstract scrollToHorizontalOffset(value: number, animated: boolean): any;
    abstract _onOrientationChanged(): any;
}
export interface ScrollViewBase {
    on(eventNames: string, callback: (data: EventData) => void, thisArg?: any): any;
    on(event: 'scroll', callback: (args: ScrollEventData) => void, thisArg?: any): any;
}
export declare const orientationProperty: Property<ScrollViewBase, CoreTypes.OrientationType>;
export declare const scrollBarIndicatorVisibleProperty: Property<ScrollViewBase, boolean>;
export declare const isScrollEnabledProperty: Property<ScrollViewBase, boolean>;
