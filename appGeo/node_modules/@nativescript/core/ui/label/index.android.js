import { TextBase, whiteSpaceProperty } from '../text-base';
import { profile } from '../../profiling';
import { CSSType } from '../core/view';
import { booleanConverter } from '../core/view-base';
export * from '../text-base';
let TextView;
let Label = class Label extends TextBase {
    get textWrap() {
        return this.style.whiteSpace === 'normal';
    }
    set textWrap(value) {
        if (typeof value === 'string') {
            value = booleanConverter(value);
        }
        this.style.whiteSpace = value ? 'normal' : 'nowrap';
    }
    createNativeView() {
        if (!TextView) {
            TextView = android.widget.TextView;
        }
        return new TextView(this._context);
    }
    initNativeView() {
        super.initNativeView();
        const textView = this.nativeTextViewProtected;
        textView.setSingleLine(true);
        textView.setEllipsize(android.text.TextUtils.TruncateAt.END);
    }
    [whiteSpaceProperty.setNative](value) {
        // Label initial value is no-wrap. set in initNativeView
        const newValue = value === 'initial' ? 'nowrap' : value;
        super[whiteSpaceProperty.setNative](newValue);
    }
};
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Label.prototype, "createNativeView", null);
Label = __decorate([
    CSSType('Label')
], Label);
export { Label };
Label.prototype._isSingleLine = true;
Label.prototype.recycleNativeView = 'auto';
//# sourceMappingURL=index.android.js.map