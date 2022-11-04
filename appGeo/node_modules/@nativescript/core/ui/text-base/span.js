import { ViewBase } from '../core/view-base';
import { isNullOrUndefined, isString } from '../../utils/types';
export class Span extends ViewBase {
    constructor() {
        super(...arguments);
        this._tappable = false;
    }
    get fontFamily() {
        return this.style.fontFamily;
    }
    set fontFamily(value) {
        this.style.fontFamily = value;
    }
    get fontSize() {
        return this.style.fontSize;
    }
    set fontSize(value) {
        this.style.fontSize = value;
    }
    // Italic
    get fontStyle() {
        return this.style.fontStyle;
    }
    set fontStyle(value) {
        this.style.fontStyle = value;
    }
    // Bold
    get fontWeight() {
        return this.style.fontWeight;
    }
    set fontWeight(value) {
        this.style.fontWeight = value;
    }
    get textDecoration() {
        return this.style.textDecoration;
    }
    set textDecoration(value) {
        this.style.textDecoration = value;
    }
    get color() {
        return this.style.color;
    }
    set color(value) {
        this.style.color = value;
    }
    get backgroundColor() {
        return this.style.backgroundColor;
    }
    set backgroundColor(value) {
        this.style.backgroundColor = value;
    }
    get text() {
        return this._text;
    }
    set text(value) {
        if (this._text !== value) {
            if (isNullOrUndefined(value)) {
                this._text = '';
            }
            else {
                // value can be a number
                this._text = isString(value) ? `${value}`.replace('\\n', '\n').replace('\\t', '\t') : `${value}`;
            }
            this.notifyPropertyChange('text', this._text);
        }
    }
    get tappable() {
        return this._tappable;
    }
    addEventListener(arg, callback, thisArg) {
        super.addEventListener(arg, callback, thisArg);
        this._setTappable(this.hasListeners(Span.linkTapEvent));
    }
    removeEventListener(arg, callback, thisArg) {
        super.removeEventListener(arg, callback, thisArg);
        this._setTappable(this.hasListeners(Span.linkTapEvent));
    }
    _setTextInternal(value) {
        this._text = value;
    }
    _setTappable(value) {
        if (this._tappable !== value) {
            this._tappable = value;
            this.notifyPropertyChange('tappable', value);
        }
    }
}
Span.linkTapEvent = 'linkTap';
//# sourceMappingURL=span.js.map