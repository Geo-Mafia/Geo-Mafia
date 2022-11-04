import { CssProperty } from '../core/properties';
import { View, CSSType } from '../core/view';
import { Property } from '../core/properties';
import { Style } from '../styling/style';
import { Color } from '../../color';
let HtmlViewBase = class HtmlViewBase extends View {
};
HtmlViewBase = __decorate([
    CSSType('HtmlView')
], HtmlViewBase);
export { HtmlViewBase };
HtmlViewBase.prototype.recycleNativeView = 'auto';
// TODO: Can we use Label.ios optimization for affectsLayout???
export const htmlProperty = new Property({
    name: 'html',
    defaultValue: '',
    affectsLayout: true,
});
htmlProperty.register(HtmlViewBase);
export const linkColorProperty = new CssProperty({
    name: 'linkColor',
    cssName: 'link-color',
    equalityComparer: Color.equals,
    valueConverter: (value) => new Color(value),
});
linkColorProperty.register(Style);
//# sourceMappingURL=html-view-common.js.map