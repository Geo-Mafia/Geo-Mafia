import { CoreTypes } from '../../../core-types';
import { LayoutBase } from '../layout-base';
import { View, CSSType } from '../../core/view';
import { Property, makeValidator, makeParser } from '../../core/properties';
import { booleanConverter } from '../../core/view-base';
function validateArgs(element) {
    if (!element) {
        throw new Error('element cannot be null or undefinied.');
    }
    return element;
}
export * from '../layout-base';
let DockLayoutBase = class DockLayoutBase extends LayoutBase {
    static getDock(element) {
        return validateArgs(element).dock;
    }
    static setDock(element, value) {
        validateArgs(element).dock = value;
    }
    onDockChanged(view, oldValue, newValue) {
        //
    }
};
DockLayoutBase = __decorate([
    CSSType('DockLayout')
], DockLayoutBase);
export { DockLayoutBase };
DockLayoutBase.prototype.recycleNativeView = 'auto';
const dockConverter = makeParser(makeValidator(CoreTypes.Dock.left, CoreTypes.Dock.top, CoreTypes.Dock.right, CoreTypes.Dock.bottom));
export const dockProperty = new Property({
    name: 'dock',
    defaultValue: 'left',
    valueChanged: (target, oldValue, newValue) => {
        if (target instanceof View) {
            const layout = target.parent;
            if (layout instanceof DockLayoutBase) {
                layout.onDockChanged(target, oldValue, newValue);
            }
        }
    },
    valueConverter: dockConverter,
});
dockProperty.register(View);
export const stretchLastChildProperty = new Property({
    name: 'stretchLastChild',
    defaultValue: true,
    affectsLayout: global.isIOS,
    valueConverter: booleanConverter,
});
stretchLastChildProperty.register(DockLayoutBase);
//# sourceMappingURL=dock-layout-common.js.map