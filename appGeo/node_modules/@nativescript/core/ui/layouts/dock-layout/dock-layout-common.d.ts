import { DockLayout as DockLayoutDefinition } from '.';
import { CoreTypes } from '../../../core-types';
import { LayoutBase } from '../layout-base';
import { View } from '../../core/view';
import { Property } from '../../core/properties';
export * from '../layout-base';
export declare class DockLayoutBase extends LayoutBase implements DockLayoutDefinition {
    static getDock(element: View): CoreTypes.DockType;
    static setDock(element: View, value: CoreTypes.DockType): void;
    stretchLastChild: boolean;
    onDockChanged(view: View, oldValue: CoreTypes.DockType, newValue: CoreTypes.DockType): void;
}
export declare const dockProperty: Property<View, CoreTypes.DockType>;
export declare const stretchLastChildProperty: Property<DockLayoutBase, boolean>;
