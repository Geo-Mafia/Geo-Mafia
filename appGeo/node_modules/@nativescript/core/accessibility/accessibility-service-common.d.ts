import { Observable } from '../data/observable';
export declare class SharedA11YObservable extends Observable {
    accessibilityServiceEnabled?: boolean;
}
export declare const AccessibilityServiceEnabledPropName = "accessibilityServiceEnabled";
export declare class CommonA11YServiceEnabledObservable extends SharedA11YObservable {
    constructor(sharedA11YObservable: SharedA11YObservable);
}
