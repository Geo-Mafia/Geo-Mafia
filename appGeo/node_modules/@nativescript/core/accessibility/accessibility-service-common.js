import { Observable } from '../data/observable';
export class SharedA11YObservable extends Observable {
}
export const AccessibilityServiceEnabledPropName = 'accessibilityServiceEnabled';
export class CommonA11YServiceEnabledObservable extends SharedA11YObservable {
    constructor(sharedA11YObservable) {
        super();
        const ref = new WeakRef(this);
        let lastValue;
        function callback() {
            const self = ref === null || ref === void 0 ? void 0 : ref.get();
            if (!self) {
                sharedA11YObservable.off(Observable.propertyChangeEvent, callback);
                return;
            }
            const newValue = !!sharedA11YObservable.accessibilityServiceEnabled;
            if (newValue !== lastValue) {
                self.set(AccessibilityServiceEnabledPropName, newValue);
                lastValue = newValue;
            }
        }
        sharedA11YObservable.on(Observable.propertyChangeEvent, callback);
        this.set(AccessibilityServiceEnabledPropName, !!sharedA11YObservable.accessibilityServiceEnabled);
    }
}
//# sourceMappingURL=accessibility-service-common.js.map