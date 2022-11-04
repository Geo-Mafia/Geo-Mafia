import { ViewBase } from '../view-base';
import { PropertyChangeData } from '../../../data/observable';
/**
 * The options object used in the Bindable.bind method.
 */
export interface BindingOptions {
    /**
     * The property name of the source object (typically the ViewModel) to bind to.
     */
    sourceProperty: string;
    /**
     * The property name of the target object (that is the Bindable instance) to bind the source property to.
     */
    targetProperty: string;
    /**
     * True to establish a two-way binding, false otherwise. A two-way binding will synchronize both the source and the target property values regardless of which one initiated the change.
     */
    twoWay?: boolean;
    /**
     * An expression used for calculations (convertions) based on the value of the property.
     */
    expression?: string;
}
/**
 * An interface which defines methods need to create binding value converter.
 */
export interface ValueConverter {
    /**
     * A method that will be executed when a value (of the binding property) should be converted to the observable model.
     * For example: user types in a text field, but our business logic requires to store data in a different manner (e.g. in lower case).
     * @param params - An array of parameters where first element is the value of the property and next elements are parameters send to converter.
     */
    toModel: (...params: any[]) => any;
    /**
     * A method that will be executed when a value should be converted to the UI view. For example we have a date object which should be displayed to the end user in a specific date format.
     * @param params - An array of parameters where first element is the value of the property and next elements are parameters send to converter.
     */
    toView: (...params: any[]) => any;
}
export declare function getEventOrGestureName(name: string): string;
export declare function isGesture(eventOrGestureName: string): boolean;
export declare function isEventOrGesture(name: string, view: ViewBase): boolean;
export declare class Binding {
    private source;
    target: WeakRef<ViewBase>;
    private sourceOptions;
    private targetOptions;
    private sourceProperties;
    private propertyChangeListeners;
    updating: boolean;
    sourceIsBindingContext: boolean;
    options: BindingOptions;
    constructor(target: ViewBase, options: BindingOptions);
    private onTargetPropertyChanged;
    loadedHandlerVisualTreeBinding(args: any): void;
    clearSource(): void;
    private sourceAsObject;
    private bindingContextChanged;
    bind(source: any): void;
    private update;
    unbind(): void;
    private resolveObjectsAndProperties;
    private addPropertyChangeListeners;
    private prepareExpressionForUpdate;
    private updateTwoWay;
    private _getExpressionValue;
    onSourcePropertyChanged(data: PropertyChangeData): void;
    private prepareContextForExpression;
    private getSourcePropertyValue;
    clearBinding(): void;
    private updateTarget;
    private updateSource;
    private getParentView;
    private resolveOptions;
    private updateOptions;
}
