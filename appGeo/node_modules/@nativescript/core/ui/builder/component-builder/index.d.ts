import { View } from '../../core/view';
export interface ComponentModule {
    component: View;
    exports: any;
}
export declare function getComponentModule(elementName: string, namespace: string, attributes: Object, moduleExports: Object, moduleNamePath?: string, isRootComponent?: boolean): ComponentModule;
export declare function setPropertyValue(instance: View, instanceModule: Object, exports: Object, propertyName: string, propertyValue: any): void;
