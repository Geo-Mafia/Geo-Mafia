import { View } from '../core/view';
export * from './placeholder-common';
export class Placeholder extends View {
    createNativeView() {
        const args = {
            eventName: Placeholder.creatingViewEvent,
            object: this,
            view: undefined,
            context: this._context,
        };
        this.notify(args);
        return args.view;
    }
}
Placeholder.creatingViewEvent = 'creatingView';
//# sourceMappingURL=index.js.map