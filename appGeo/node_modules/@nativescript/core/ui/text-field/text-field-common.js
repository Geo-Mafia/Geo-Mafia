import { EditableTextBase } from '../editable-text-base';
import { Property } from '../core/properties';
import { CSSType } from '../core/view';
import { booleanConverter } from '../core/view-base';
let TextFieldBase = class TextFieldBase extends EditableTextBase {
};
TextFieldBase.returnPressEvent = 'returnPress';
TextFieldBase = __decorate([
    CSSType('TextField')
], TextFieldBase);
export { TextFieldBase };
TextFieldBase.prototype.recycleNativeView = 'auto';
export const secureProperty = new Property({
    name: 'secure',
    defaultValue: false,
    valueConverter: booleanConverter,
});
secureProperty.register(TextFieldBase);
export const closeOnReturnProperty = new Property({
    name: 'closeOnReturn',
    defaultValue: true,
    valueConverter: booleanConverter,
});
closeOnReturnProperty.register(TextFieldBase);
//# sourceMappingURL=text-field-common.js.map