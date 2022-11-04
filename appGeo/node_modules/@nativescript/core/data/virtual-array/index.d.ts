import { Observable, EventData } from '../observable';
import { ChangedData } from '../observable-array';
/**
 * Event args for "itemsLoading" event.
 */
export interface ItemsLoading extends EventData {
    /**
     * Start index.
     */
    index: number;
    /**
     * Number of items to load.
     */
    count: number;
}
/**
 * Advanced array like class that helps loading items on demand.
 */
export declare class VirtualArray<T> extends Observable {
    /**
     * String value used when hooking to change event.
     */
    static changeEvent: string;
    /**
     * String value used when hooking to itemsLoading event.
     */
    static itemsLoadingEvent: string;
    private _requestedIndexes;
    private _loadedIndexes;
    private _length;
    private _cache;
    constructor(length?: number);
    /**
     * Gets or sets length for the virtual array.
     */
    get length(): number;
    set length(value: number);
    /**
     * Gets or sets load size for the virtual array.
     */
    private _loadSize;
    get loadSize(): number;
    set loadSize(value: number);
    getItem(index: number): T;
    setItem(index: number, value: T): void;
    /**
     * Loads items from an array starting at index.
     */
    load(index: number, items: T[]): void;
    private requestItems;
}
export interface VirtualArray<T> {
    /**
     * A basic method signature to hook an event listener (shortcut alias to the addEventListener method).
     * @param eventNames - String corresponding to events (e.g. "propertyChange"). Optionally could be used more events separated by `,` (e.g. "propertyChange", "change").
     * @param callback - Callback function which will be executed when event is raised.
     * @param thisArg - An optional parameter which will be used as `this` context for callback execution.
     */
    on(eventNames: string, callback: (data: EventData) => void, thisArg?: any): void;
    /**
     * Raised when still not loaded items are requested.
     */
    on(event: 'itemsLoading', callback: (args: ItemsLoading) => void, thisArg?: any): void;
    /**
     * Raised when a change occurs.
     */
    on(event: 'change', callback: (args: ChangedData<T>) => void, thisArg?: any): void;
}
