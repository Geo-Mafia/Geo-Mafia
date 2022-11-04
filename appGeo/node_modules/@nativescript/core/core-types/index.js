/**
 * General @nativescript/core types used throughout the library.
 */
import { makeValidator, makeParser } from '../ui/core/properties';
export var CoreTypes;
(function (CoreTypes) {
    let KeyboardType;
    (function (KeyboardType) {
        KeyboardType.datetime = 'datetime';
        KeyboardType.phone = 'phone';
        KeyboardType.number = 'number';
        KeyboardType.url = 'url';
        KeyboardType.email = 'email';
        KeyboardType.integer = 'integer';
    })(KeyboardType = CoreTypes.KeyboardType || (CoreTypes.KeyboardType = {}));
    let AutofillType;
    (function (AutofillType) {
        AutofillType.username = 'username';
        AutofillType.password = 'password';
        AutofillType.none = 'none';
    })(AutofillType = CoreTypes.AutofillType || (CoreTypes.AutofillType = {}));
    let ReturnKeyType;
    (function (ReturnKeyType) {
        ReturnKeyType.done = 'done';
        ReturnKeyType.next = 'next';
        ReturnKeyType.go = 'go';
        ReturnKeyType.search = 'search';
        ReturnKeyType.send = 'send';
    })(ReturnKeyType = CoreTypes.ReturnKeyType || (CoreTypes.ReturnKeyType = {}));
    let TextAlignment;
    (function (TextAlignment) {
        TextAlignment.left = 'left';
        TextAlignment.center = 'center';
        TextAlignment.right = 'right';
        TextAlignment.justify = 'justify';
    })(TextAlignment = CoreTypes.TextAlignment || (CoreTypes.TextAlignment = {}));
    let TextDecoration;
    (function (TextDecoration) {
        TextDecoration.none = 'none';
        TextDecoration.underline = 'underline';
        TextDecoration.lineThrough = 'line-through';
    })(TextDecoration = CoreTypes.TextDecoration || (CoreTypes.TextDecoration = {}));
    let TextTransform;
    (function (TextTransform) {
        TextTransform.none = 'none';
        TextTransform.capitalize = 'capitalize';
        TextTransform.uppercase = 'uppercase';
        TextTransform.lowercase = 'lowercase';
    })(TextTransform = CoreTypes.TextTransform || (CoreTypes.TextTransform = {}));
    let WhiteSpace;
    (function (WhiteSpace) {
        WhiteSpace.normal = 'normal';
        WhiteSpace.nowrap = 'nowrap';
    })(WhiteSpace = CoreTypes.WhiteSpace || (CoreTypes.WhiteSpace = {}));
    let Orientation;
    (function (Orientation) {
        Orientation.horizontal = 'horizontal';
        Orientation.vertical = 'vertical';
    })(Orientation = CoreTypes.Orientation || (CoreTypes.Orientation = {}));
    let DeviceOrientation;
    (function (DeviceOrientation) {
        DeviceOrientation.portrait = 'portrait';
        DeviceOrientation.landscape = 'landscape';
        DeviceOrientation.unknown = 'unknown';
    })(DeviceOrientation = CoreTypes.DeviceOrientation || (CoreTypes.DeviceOrientation = {}));
    let HorizontalAlignment;
    (function (HorizontalAlignment) {
        HorizontalAlignment.left = 'left';
        HorizontalAlignment.center = 'center';
        HorizontalAlignment.right = 'right';
        HorizontalAlignment.stretch = 'stretch';
        HorizontalAlignment.isValid = makeValidator(HorizontalAlignment.left, HorizontalAlignment.center, HorizontalAlignment.right, HorizontalAlignment.stretch);
        HorizontalAlignment.parse = makeParser(HorizontalAlignment.isValid);
    })(HorizontalAlignment = CoreTypes.HorizontalAlignment || (CoreTypes.HorizontalAlignment = {}));
    let VerticalAlignment;
    (function (VerticalAlignment) {
        VerticalAlignment.top = 'top';
        VerticalAlignment.middle = 'middle';
        VerticalAlignment.bottom = 'bottom';
        VerticalAlignment.stretch = 'stretch';
    })(VerticalAlignment = CoreTypes.VerticalAlignment || (CoreTypes.VerticalAlignment = {}));
    let VerticalAlignmentText;
    (function (VerticalAlignmentText) {
        VerticalAlignmentText.top = 'top';
        VerticalAlignmentText.middle = 'middle';
        VerticalAlignmentText.bottom = 'bottom';
        VerticalAlignmentText.stretch = 'stretch';
        VerticalAlignmentText.texttop = 'text-top';
        VerticalAlignmentText.textbottom = 'text-bottom';
        VerticalAlignmentText.sup = 'sup';
        VerticalAlignmentText.sub = 'sub';
        VerticalAlignmentText.baseline = 'baseline';
        VerticalAlignmentText.isValid = makeValidator(VerticalAlignmentText.top, VerticalAlignmentText.middle, VerticalAlignmentText.bottom, VerticalAlignmentText.stretch, VerticalAlignmentText.texttop, VerticalAlignmentText.textbottom, VerticalAlignmentText.sup, VerticalAlignmentText.sub, VerticalAlignmentText.baseline);
        VerticalAlignmentText.parse = (value) => (value.toLowerCase() === 'center' ? VerticalAlignmentText.middle : parseStrict(value));
        const parseStrict = makeParser(VerticalAlignmentText.isValid);
    })(VerticalAlignmentText = CoreTypes.VerticalAlignmentText || (CoreTypes.VerticalAlignmentText = {}));
    let ImageStretch;
    (function (ImageStretch) {
        ImageStretch.none = 'none';
        ImageStretch.aspectFill = 'aspectFill';
        ImageStretch.aspectFit = 'aspectFit';
        ImageStretch.fill = 'fill';
    })(ImageStretch = CoreTypes.ImageStretch || (CoreTypes.ImageStretch = {}));
    let Visibility;
    (function (Visibility) {
        Visibility.visible = 'visible';
        Visibility.collapse = 'collapse';
        Visibility.collapsed = 'collapsed';
        Visibility.hidden = 'hidden';
        Visibility.isValid = makeValidator(Visibility.visible, Visibility.hidden, Visibility.collapse);
        Visibility.parse = (value) => (value.toLowerCase() === 'collapsed' ? Visibility.collapse : parseStrict(value));
        const parseStrict = makeParser(Visibility.isValid);
    })(Visibility = CoreTypes.Visibility || (CoreTypes.Visibility = {}));
    let FontAttributes;
    (function (FontAttributes) {
        FontAttributes.Normal = 0;
        FontAttributes.Bold = 1;
        FontAttributes.Italic = 1 << 1;
    })(FontAttributes = CoreTypes.FontAttributes || (CoreTypes.FontAttributes = {}));
    let DeviceType;
    (function (DeviceType) {
        DeviceType.Phone = 'Phone';
        DeviceType.Tablet = 'Tablet';
    })(DeviceType = CoreTypes.DeviceType || (CoreTypes.DeviceType = {}));
    let UpdateTextTrigger;
    (function (UpdateTextTrigger) {
        UpdateTextTrigger.focusLost = 'focusLost';
        UpdateTextTrigger.textChanged = 'textChanged';
    })(UpdateTextTrigger = CoreTypes.UpdateTextTrigger || (CoreTypes.UpdateTextTrigger = {}));
    let Accuracy;
    (function (Accuracy) {
        Accuracy.any = 300;
        Accuracy.high = 3;
    })(Accuracy = CoreTypes.Accuracy || (CoreTypes.Accuracy = {}));
    let Dock;
    (function (Dock) {
        Dock.left = 'left';
        Dock.top = 'top';
        Dock.right = 'right';
        Dock.bottom = 'bottom';
    })(Dock = CoreTypes.Dock || (CoreTypes.Dock = {}));
    let AutocapitalizationType;
    (function (AutocapitalizationType) {
        AutocapitalizationType.none = 'none';
        AutocapitalizationType.words = 'words';
        AutocapitalizationType.sentences = 'sentences';
        AutocapitalizationType.allCharacters = 'allcharacters';
    })(AutocapitalizationType = CoreTypes.AutocapitalizationType || (CoreTypes.AutocapitalizationType = {}));
    let NavigationBarVisibility;
    (function (NavigationBarVisibility) {
        NavigationBarVisibility.auto = 'auto';
        NavigationBarVisibility.never = 'never';
        NavigationBarVisibility.always = 'always';
    })(NavigationBarVisibility = CoreTypes.NavigationBarVisibility || (CoreTypes.NavigationBarVisibility = {}));
    let AndroidActionBarIconVisibility;
    (function (AndroidActionBarIconVisibility) {
        AndroidActionBarIconVisibility.auto = 'auto';
        AndroidActionBarIconVisibility.never = 'never';
        AndroidActionBarIconVisibility.always = 'always';
    })(AndroidActionBarIconVisibility = CoreTypes.AndroidActionBarIconVisibility || (CoreTypes.AndroidActionBarIconVisibility = {}));
    let AndroidActionItemPosition;
    (function (AndroidActionItemPosition) {
        AndroidActionItemPosition.actionBar = 'actionBar';
        AndroidActionItemPosition.actionBarIfRoom = 'actionBarIfRoom';
        AndroidActionItemPosition.popup = 'popup';
    })(AndroidActionItemPosition = CoreTypes.AndroidActionItemPosition || (CoreTypes.AndroidActionItemPosition = {}));
    let IOSActionItemPosition;
    (function (IOSActionItemPosition) {
        IOSActionItemPosition.left = 'left';
        IOSActionItemPosition.right = 'right';
    })(IOSActionItemPosition = CoreTypes.IOSActionItemPosition || (CoreTypes.IOSActionItemPosition = {}));
    let ImageFormat;
    (function (ImageFormat) {
        ImageFormat.png = 'png';
        ImageFormat.jpeg = 'jpeg';
        ImageFormat.jpg = 'jpg';
    })(ImageFormat = CoreTypes.ImageFormat || (CoreTypes.ImageFormat = {}));
    let FontStyle;
    (function (FontStyle) {
        FontStyle.normal = 'normal';
        FontStyle.italic = 'italic';
    })(FontStyle = CoreTypes.FontStyle || (CoreTypes.FontStyle = {}));
    let FontWeight;
    (function (FontWeight) {
        FontWeight.thin = '100';
        FontWeight.extraLight = '200';
        FontWeight.light = '300';
        FontWeight.normal = 'normal'; // 400
        FontWeight.medium = '500';
        FontWeight.semiBold = '600';
        FontWeight.bold = 'bold'; // 700
        FontWeight.extraBold = '800';
        FontWeight.black = '900';
    })(FontWeight = CoreTypes.FontWeight || (CoreTypes.FontWeight = {}));
    let BackgroundRepeat;
    (function (BackgroundRepeat) {
        BackgroundRepeat.repeat = 'repeat';
        BackgroundRepeat.repeatX = 'repeat-x';
        BackgroundRepeat.repeatY = 'repeat-y';
        BackgroundRepeat.noRepeat = 'no-repeat';
        BackgroundRepeat.isValid = makeValidator(BackgroundRepeat.repeat, BackgroundRepeat.repeatX, BackgroundRepeat.repeatY, BackgroundRepeat.noRepeat);
        BackgroundRepeat.parse = makeParser(BackgroundRepeat.isValid);
    })(BackgroundRepeat = CoreTypes.BackgroundRepeat || (CoreTypes.BackgroundRepeat = {}));
    let animation;
    let AnimationCurve;
    (function (AnimationCurve) {
        AnimationCurve.ease = 'ease';
        AnimationCurve.easeIn = 'easeIn';
        AnimationCurve.easeOut = 'easeOut';
        AnimationCurve.easeInOut = 'easeInOut';
        AnimationCurve.linear = 'linear';
        AnimationCurve.spring = 'spring';
        function cubicBezier(x1, y1, x2, y2) {
            animation = animation || require('../ui/animation');
            return new animation.CubicBezierAnimationCurve(x1, y1, x2, y2);
        }
        AnimationCurve.cubicBezier = cubicBezier;
    })(AnimationCurve = CoreTypes.AnimationCurve || (CoreTypes.AnimationCurve = {}));
    let StatusBarStyle;
    (function (StatusBarStyle) {
        StatusBarStyle.light = 'light';
        StatusBarStyle.dark = 'dark';
    })(StatusBarStyle = CoreTypes.StatusBarStyle || (CoreTypes.StatusBarStyle = {}));
    let SystemAppearance;
    (function (SystemAppearance) {
        SystemAppearance.light = 'light';
        SystemAppearance.dark = 'dark';
    })(SystemAppearance = CoreTypes.SystemAppearance || (CoreTypes.SystemAppearance = {}));
})(CoreTypes || (CoreTypes = {}));
/**
 * @deprecated Use `CoreTypes.AnimationCurve` instead.
 */
export const AnimationCurve = CoreTypes.AnimationCurve;
/**
 * @deprecated Use `CoreTypes` instead. Enums will be removed in 9.0
 */
export const Enums = {
    Accuracy: CoreTypes.Accuracy,
    AndroidActionBarIconVisibility: CoreTypes.AndroidActionBarIconVisibility,
    AndroidActionItemPosition: CoreTypes.AndroidActionItemPosition,
    AnimationCurve: CoreTypes.AnimationCurve,
    AutocapitalizationType: CoreTypes.AutocapitalizationType,
    BackgroundRepeat: CoreTypes.BackgroundRepeat,
    DeviceOrientation: CoreTypes.DeviceOrientation,
    DeviceType: CoreTypes.DeviceType,
    Dock: CoreTypes.Dock,
    FontAttributes: CoreTypes.FontAttributes,
    FontStyle: CoreTypes.FontStyle,
    FontWeight: CoreTypes.FontWeight,
    HorizontalAlignment: CoreTypes.HorizontalAlignment,
    IOSActionItemPosition: CoreTypes.IOSActionItemPosition,
    ImageFormat: CoreTypes.ImageFormat,
    KeyboardType: CoreTypes.KeyboardType,
    NavigationBarVisibility: CoreTypes.NavigationBarVisibility,
    Orientation: CoreTypes.Orientation,
    ReturnKeyType: CoreTypes.ReturnKeyType,
    StatusBarStyle: CoreTypes.StatusBarStyle,
    Stretch: CoreTypes.ImageStretch,
    SystemAppearance: CoreTypes.SystemAppearance,
    TextAlignment: CoreTypes.TextAlignment,
    TextDecoration: CoreTypes.TextDecoration,
    TextTransform: CoreTypes.TextTransform,
    UpdateTextTrigger: CoreTypes.UpdateTextTrigger,
    VerticalAlignment: CoreTypes.VerticalAlignment,
    Visibility: CoreTypes.Visibility,
    WhiteSpace: CoreTypes.WhiteSpace,
};
//# sourceMappingURL=index.js.map