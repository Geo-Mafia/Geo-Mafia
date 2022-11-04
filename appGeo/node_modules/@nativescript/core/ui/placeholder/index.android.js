var Placeholder_1;
import { View, CSSType } from '../core/view';
export * from './placeholder-common';
let Placeholder = Placeholder_1 = class Placeholder extends View {
    createNativeView() {
        const args = {
            eventName: Placeholder_1.creatingViewEvent,
            object: this,
            view: undefined,
            context: this._context,
        };
        this.notify(args);
        return args.view;
    }
};
Placeholder.creatingViewEvent = 'creatingView';
Placeholder = Placeholder_1 = __decorate([
    CSSType('Placeholder')
], Placeholder);
export { Placeholder };
//# sourceMappingURL=index.android.js.map