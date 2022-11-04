var ScrollViewBase_1;
import { ContentView } from '../content-view';
import { profile } from '../../profiling';
import { Property, makeParser, makeValidator } from '../core/properties';
import { CSSType } from '../core/view';
import { booleanConverter } from '../core/view-base';
import { CoreTypes } from '../../core-types';
let ScrollViewBase = ScrollViewBase_1 = class ScrollViewBase extends ContentView {
    constructor() {
        super(...arguments);
        this._scrollChangeCount = 0;
    }
    addEventListener(arg, callback, thisArg) {
        super.addEventListener(arg, callback, thisArg);
        if (arg === ScrollViewBase_1.scrollEvent) {
            this._scrollChangeCount++;
            this.attach();
        }
    }
    removeEventListener(arg, callback, thisArg) {
        super.removeEventListener(arg, callback, thisArg);
        if (arg === ScrollViewBase_1.scrollEvent) {
            this._scrollChangeCount--;
            this.dettach();
        }
    }
    onLoaded() {
        super.onLoaded();
        this.attach();
    }
    onUnloaded() {
        super.onUnloaded();
        this.dettach();
    }
    attach() {
        if (this._scrollChangeCount > 0 && this.isLoaded) {
            this.attachNative();
        }
    }
    dettach() {
        if (this._scrollChangeCount === 0 && this.isLoaded) {
            this.dettachNative();
        }
    }
    attachNative() {
        //
    }
    dettachNative() {
        //
    }
    get horizontalOffset() {
        return 0;
    }
    get verticalOffset() {
        return 0;
    }
    get scrollableWidth() {
        return 0;
    }
    get scrollableHeight() {
        return 0;
    }
};
ScrollViewBase.scrollEvent = 'scroll';
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScrollViewBase.prototype, "onLoaded", null);
ScrollViewBase = ScrollViewBase_1 = __decorate([
    CSSType('ScrollView')
], ScrollViewBase);
export { ScrollViewBase };
const converter = makeParser(makeValidator(CoreTypes.Orientation.horizontal, CoreTypes.Orientation.vertical));
export const orientationProperty = new Property({
    name: 'orientation',
    defaultValue: CoreTypes.Orientation.vertical,
    affectsLayout: true,
    valueChanged: (target, oldValue, newValue) => {
        target._onOrientationChanged();
    },
    valueConverter: converter,
});
orientationProperty.register(ScrollViewBase);
export const scrollBarIndicatorVisibleProperty = new Property({
    name: 'scrollBarIndicatorVisible',
    defaultValue: true,
    valueConverter: booleanConverter,
});
scrollBarIndicatorVisibleProperty.register(ScrollViewBase);
export const isScrollEnabledProperty = new Property({
    name: 'isScrollEnabled',
    defaultValue: true,
    valueConverter: booleanConverter,
});
isScrollEnabledProperty.register(ScrollViewBase);
//# sourceMappingURL=scroll-view-common.js.map