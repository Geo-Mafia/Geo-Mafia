import { LayoutBase } from '../layout-base';
import { View, CSSType } from '../../core/view';
import { CssProperty, ShorthandProperty, makeParser, makeValidator, unsetValue } from '../../core/properties';
import { Style } from '../../styling/style';
export const ORDER_DEFAULT = 1;
export const FLEX_GROW_DEFAULT = 0.0;
export const FLEX_SHRINK_DEFAULT = 1.0;
export var FlexDirection;
(function (FlexDirection) {
    FlexDirection.ROW = 'row';
    FlexDirection.ROW_REVERSE = 'row-reverse';
    FlexDirection.COLUMN = 'column';
    FlexDirection.COLUMN_REVERSE = 'column-reverse';
    FlexDirection.isValid = makeValidator(FlexDirection.ROW, FlexDirection.ROW_REVERSE, FlexDirection.COLUMN, FlexDirection.COLUMN_REVERSE);
    FlexDirection.parse = makeParser(FlexDirection.isValid);
})(FlexDirection || (FlexDirection = {}));
export var FlexWrap;
(function (FlexWrap) {
    FlexWrap.NOWRAP = 'nowrap';
    FlexWrap.WRAP = 'wrap';
    FlexWrap.WRAP_REVERSE = 'wrap-reverse';
    FlexWrap.isValid = makeValidator(FlexWrap.NOWRAP, FlexWrap.WRAP, FlexWrap.WRAP_REVERSE);
    FlexWrap.parse = makeParser(FlexWrap.isValid);
})(FlexWrap || (FlexWrap = {}));
export var JustifyContent;
(function (JustifyContent) {
    JustifyContent.FLEX_START = 'flex-start';
    JustifyContent.FLEX_END = 'flex-end';
    JustifyContent.CENTER = 'center';
    JustifyContent.SPACE_BETWEEN = 'space-between';
    JustifyContent.SPACE_AROUND = 'space-around';
    JustifyContent.isValid = makeValidator(JustifyContent.FLEX_START, JustifyContent.FLEX_END, JustifyContent.CENTER, JustifyContent.SPACE_BETWEEN, JustifyContent.SPACE_AROUND);
    JustifyContent.parse = makeParser(JustifyContent.isValid);
})(JustifyContent || (JustifyContent = {}));
export var FlexBasisPercent;
(function (FlexBasisPercent) {
    FlexBasisPercent.DEFAULT = -1;
})(FlexBasisPercent || (FlexBasisPercent = {}));
export var AlignItems;
(function (AlignItems) {
    AlignItems.FLEX_START = 'flex-start';
    AlignItems.FLEX_END = 'flex-end';
    AlignItems.CENTER = 'center';
    AlignItems.BASELINE = 'baseline';
    AlignItems.STRETCH = 'stretch';
    AlignItems.isValid = makeValidator(AlignItems.FLEX_START, AlignItems.FLEX_END, AlignItems.CENTER, AlignItems.BASELINE, AlignItems.STRETCH);
    AlignItems.parse = makeParser(AlignItems.isValid);
})(AlignItems || (AlignItems = {}));
export var AlignContent;
(function (AlignContent) {
    AlignContent.FLEX_START = 'flex-start';
    AlignContent.FLEX_END = 'flex-end';
    AlignContent.CENTER = 'center';
    AlignContent.SPACE_BETWEEN = 'space-between';
    AlignContent.SPACE_AROUND = 'space-around';
    AlignContent.STRETCH = 'stretch';
    AlignContent.isValid = makeValidator(AlignContent.FLEX_START, AlignContent.FLEX_END, AlignContent.CENTER, AlignContent.SPACE_BETWEEN, AlignContent.SPACE_AROUND, AlignContent.STRETCH);
    AlignContent.parse = makeParser(AlignContent.isValid);
})(AlignContent || (AlignContent = {}));
export var Order;
(function (Order) {
    function isValid(value) {
        return isFinite(parseInt(value));
    }
    Order.isValid = isValid;
    Order.parse = parseInt;
})(Order || (Order = {}));
export var FlexGrow;
(function (FlexGrow) {
    function isValid(value) {
        const parsed = parseInt(value);
        return isFinite(parsed) && value >= 0;
    }
    FlexGrow.isValid = isValid;
    FlexGrow.parse = parseFloat;
})(FlexGrow || (FlexGrow = {}));
export var FlexShrink;
(function (FlexShrink) {
    function isValid(value) {
        const parsed = parseInt(value);
        return isFinite(parsed) && value >= 0;
    }
    FlexShrink.isValid = isValid;
    FlexShrink.parse = parseFloat;
})(FlexShrink || (FlexShrink = {}));
export var FlexWrapBefore;
(function (FlexWrapBefore) {
    function isValid(value) {
        if (typeof value === 'boolean') {
            return true;
        }
        if (typeof value === 'string') {
            const str = value.trim().toLowerCase();
            return str === 'true' || str === 'false';
        }
        return false;
    }
    FlexWrapBefore.isValid = isValid;
    function parse(value) {
        return value && value.toString().trim().toLowerCase() === 'true';
    }
    FlexWrapBefore.parse = parse;
})(FlexWrapBefore || (FlexWrapBefore = {}));
export var AlignSelf;
(function (AlignSelf) {
    AlignSelf.AUTO = 'auto';
    AlignSelf.FLEX_START = 'flex-start';
    AlignSelf.FLEX_END = 'flex-end';
    AlignSelf.CENTER = 'center';
    AlignSelf.BASELINE = 'baseline';
    AlignSelf.STRETCH = 'stretch';
    AlignSelf.isValid = makeValidator(AlignSelf.AUTO, AlignSelf.FLEX_START, AlignSelf.FLEX_END, AlignSelf.CENTER, AlignSelf.BASELINE, AlignSelf.STRETCH);
    AlignSelf.parse = makeParser(AlignSelf.isValid);
})(AlignSelf || (AlignSelf = {}));
function validateArgs(element) {
    if (!element) {
        throw new Error('element cannot be null or undefinied.');
    }
    return element;
}
/**
 * A common base class for all cross platform flexbox layout implementations.
 */
let FlexboxLayoutBase = class FlexboxLayoutBase extends LayoutBase {
    get flexDirection() {
        return this.style.flexDirection;
    }
    set flexDirection(value) {
        this.style.flexDirection = value;
    }
    get flexWrap() {
        return this.style.flexWrap;
    }
    set flexWrap(value) {
        this.style.flexWrap = value;
    }
    get justifyContent() {
        return this.style.justifyContent;
    }
    set justifyContent(value) {
        this.style.justifyContent = value;
    }
    get alignItems() {
        return this.style.alignItems;
    }
    set alignItems(value) {
        this.style.alignItems = value;
    }
    get alignContent() {
        return this.style.alignContent;
    }
    set alignContent(value) {
        this.style.alignContent = value;
    }
    static setOrder(view, order) {
        validateArgs(view).style.order = order;
    }
    static getOrder(view) {
        return validateArgs(view).style.order;
    }
    static setFlexGrow(view, grow) {
        validateArgs(view).style.flexGrow = grow;
    }
    static getFlexGrow(view) {
        return validateArgs(view).style.flexGrow;
    }
    static setFlexShrink(view, shrink) {
        validateArgs(view).style.flexShrink = shrink;
    }
    static getFlexShrink(view) {
        return validateArgs(view).style.flexShrink;
    }
    static setAlignSelf(view, align) {
        validateArgs(view).style.alignSelf = align;
    }
    static getAlignSelf(view) {
        return validateArgs(view).style.alignSelf;
    }
    static setFlexWrapBefore(view, wrap) {
        validateArgs(view).style.flexWrapBefore = wrap;
    }
    static getFlexWrapBefore(view) {
        return validateArgs(view).style.flexWrapBefore;
    }
};
FlexboxLayoutBase = __decorate([
    CSSType('FlexboxLayout')
], FlexboxLayoutBase);
export { FlexboxLayoutBase };
FlexboxLayoutBase.prototype.recycleNativeView = 'auto';
export const flexDirectionProperty = new CssProperty({
    name: 'flexDirection',
    cssName: 'flex-direction',
    defaultValue: FlexDirection.ROW,
    affectsLayout: global.isIOS,
    valueConverter: FlexDirection.parse,
});
flexDirectionProperty.register(Style);
export const flexWrapProperty = new CssProperty({
    name: 'flexWrap',
    cssName: 'flex-wrap',
    defaultValue: 'nowrap',
    affectsLayout: global.isIOS,
    valueConverter: FlexWrap.parse,
});
flexWrapProperty.register(Style);
export const justifyContentProperty = new CssProperty({
    name: 'justifyContent',
    cssName: 'justify-content',
    defaultValue: JustifyContent.FLEX_START,
    affectsLayout: global.isIOS,
    valueConverter: JustifyContent.parse,
});
justifyContentProperty.register(Style);
export const alignItemsProperty = new CssProperty({
    name: 'alignItems',
    cssName: 'align-items',
    defaultValue: AlignItems.STRETCH,
    affectsLayout: global.isIOS,
    valueConverter: AlignItems.parse,
});
alignItemsProperty.register(Style);
export const alignContentProperty = new CssProperty({
    name: 'alignContent',
    cssName: 'align-content',
    defaultValue: AlignContent.STRETCH,
    affectsLayout: global.isIOS,
    valueConverter: AlignContent.parse,
});
alignContentProperty.register(Style);
export const orderProperty = new CssProperty({
    name: 'order',
    cssName: 'order',
    defaultValue: ORDER_DEFAULT,
    valueConverter: Order.parse,
});
orderProperty.register(Style);
Object.defineProperty(View.prototype, 'order', {
    get() {
        return this.style.order;
    },
    set(value) {
        this.style.order = value;
    },
    enumerable: true,
    configurable: true,
});
export const flexGrowProperty = new CssProperty({
    name: 'flexGrow',
    cssName: 'flex-grow',
    defaultValue: FLEX_GROW_DEFAULT,
    valueConverter: FlexGrow.parse,
});
flexGrowProperty.register(Style);
Object.defineProperty(View.prototype, 'flexGrow', {
    get() {
        return this.style.flexGrow;
    },
    set(value) {
        this.style.flexGrow = value;
    },
    enumerable: true,
    configurable: true,
});
export const flexShrinkProperty = new CssProperty({
    name: 'flexShrink',
    cssName: 'flex-shrink',
    defaultValue: FLEX_SHRINK_DEFAULT,
    valueConverter: FlexShrink.parse,
});
flexShrinkProperty.register(Style);
Object.defineProperty(View.prototype, 'flexShrink', {
    get() {
        return this.style.flexShrink;
    },
    set(value) {
        this.style.flexShrink = value;
    },
    enumerable: true,
    configurable: true,
});
export const flexWrapBeforeProperty = new CssProperty({
    name: 'flexWrapBefore',
    cssName: 'flex-wrap-before',
    defaultValue: false,
    valueConverter: FlexWrapBefore.parse,
});
flexWrapBeforeProperty.register(Style);
Object.defineProperty(View.prototype, 'flexWrapBefore', {
    get() {
        return this.style.flexWrapBefore;
    },
    set(value) {
        this.style.flexWrapBefore = value;
    },
    enumerable: true,
    configurable: true,
});
export const alignSelfProperty = new CssProperty({
    name: 'alignSelf',
    cssName: 'align-self',
    defaultValue: AlignSelf.AUTO,
    valueConverter: AlignSelf.parse,
});
alignSelfProperty.register(Style);
Object.defineProperty(View.prototype, 'alignSelf', {
    get() {
        return this.style.alignSelf;
    },
    set(value) {
        this.style.alignSelf = value;
    },
    enumerable: true,
    configurable: true,
});
// flex-flow: <flex-direction> || <flex-wrap>
const flexFlowProperty = new ShorthandProperty({
    name: 'flexFlow',
    cssName: 'flex-flow',
    getter: function () {
        return `${this.flexDirection} ${this.flexWrap}`;
    },
    converter: function (value) {
        const properties = [];
        if (value === unsetValue) {
            properties.push([flexDirectionProperty, value]);
            properties.push([flexWrapProperty, value]);
        }
        else {
            const trimmed = value && value.trim();
            if (trimmed) {
                const values = trimmed.split(/\s+/);
                if (values.length >= 1 && FlexDirection.isValid(values[0])) {
                    properties.push([flexDirectionProperty, FlexDirection.parse(values[0])]);
                }
                if (value.length >= 2 && FlexWrap.isValid(values[1])) {
                    properties.push([flexWrapProperty, FlexWrap.parse(values[1])]);
                }
            }
        }
        return properties;
    },
});
flexFlowProperty.register(Style);
// flex: inital | auto | none | <flex-grow> <flex-shrink> || <flex-basis>
const flexProperty = new ShorthandProperty({
    name: 'flex',
    cssName: 'flex',
    getter: function () {
        return `${this.flexGrow} ${this.flexShrink}`;
    },
    converter: function (value) {
        const properties = [];
        if (value === unsetValue) {
            properties.push([flexGrowProperty, value]);
            properties.push([flexShrinkProperty, value]);
        }
        else {
            const trimmed = value && value.trim();
            if (trimmed) {
                const values = trimmed.split(/\s+/);
                if (values.length === 1) {
                    switch (values[0]) {
                        case 'inital':
                            properties.push([flexGrowProperty, 0]);
                            properties.push([flexShrinkProperty, 1]);
                            // properties.push([flexBasisProperty, FlexBasis.AUTO])
                            break;
                        case 'auto':
                            properties.push([flexGrowProperty, 1]);
                            properties.push([flexShrinkProperty, 1]);
                            // properties.push([flexBasisProperty, FlexBasis.AUTO])
                            break;
                        case 'none':
                            properties.push([flexGrowProperty, 0]);
                            properties.push([flexShrinkProperty, 0]);
                            // properties.push([flexBasisProperty, FlexBasis.AUTO])
                            break;
                        default:
                            if (FlexGrow.isValid(values[0])) {
                                properties.push([flexGrowProperty, FlexGrow.parse(values[0])]);
                                properties.push([flexShrinkProperty, 1]);
                                // properties.push([flexBasisProperty, 0])
                            }
                    }
                }
                if (values.length >= 2) {
                    if (FlexGrow.isValid(values[0]) && FlexShrink.isValid(values[1])) {
                        properties.push([flexGrowProperty, FlexGrow.parse(values[0])]);
                        properties.push([flexShrinkProperty, FlexShrink.parse(values[1])]);
                    }
                }
                // if (value.length >= 3) {
                //     properties.push({ property: flexBasisProperty, value: FlexBasis.parse(values[2])})
                // }
            }
        }
        return properties;
    },
});
flexProperty.register(Style);
//# sourceMappingURL=flexbox-layout-common.js.map