import { Frame } from '../frame';
import { isObject, isString } from '../../utils/types';
export var DialogStrings;
(function (DialogStrings) {
    DialogStrings.STRING = 'string';
    DialogStrings.PROMPT = 'Prompt';
    DialogStrings.CONFIRM = 'Confirm';
    DialogStrings.ALERT = 'Alert';
    DialogStrings.LOGIN = 'Login';
    DialogStrings.OK = 'OK';
    DialogStrings.CANCEL = 'Cancel';
})(DialogStrings || (DialogStrings = {}));
/**
 * Defines the input type for prompt dialog.
 */
export var inputType;
(function (inputType) {
    /**
     * Plain text input type.
     */
    inputType.text = 'text';
    /**
     * Password input type.
     */
    inputType.password = 'password';
    /**
     * Email input type.
     */
    inputType.email = 'email';
    /**
     * Number input type
     */
    inputType.number = 'number';
    /**
     * Decimal input type
     */
    inputType.decimal = 'decimal';
    /**
     * Phone input type
     */
    inputType.phone = 'phone';
})(inputType || (inputType = {}));
/**
 * Defines the capitalization type for prompt dialog.
 */
export var capitalizationType;
(function (capitalizationType) {
    /**
     * No automatic capitalization.
     */
    capitalizationType.none = 'none';
    /**
     * Capitalizes every character.
     */
    capitalizationType.all = 'all';
    /**
     * Capitalize the first word of each sentence.
     */
    capitalizationType.sentences = 'sentences';
    /**
     * Capitalize the first letter of every word.
     */
    capitalizationType.words = 'words';
})(capitalizationType || (capitalizationType = {}));
export function getCurrentPage() {
    const topmostFrame = Frame.topmost();
    if (topmostFrame) {
        return topmostFrame.currentPage;
    }
    return undefined;
}
function applySelectors(view, callback) {
    const currentPage = getCurrentPage();
    if (currentPage) {
        const styleScope = currentPage._styleScope;
        if (styleScope) {
            view._inheritStyleScope(styleScope);
            view.onLoaded();
            callback(view);
            view.onUnloaded();
        }
    }
}
let button;
let label;
let textField;
export function getButtonColors() {
    if (!button) {
        const Button = require('../button').Button;
        button = new Button();
        if (global.isIOS) {
            button._setupUI({});
        }
    }
    let buttonColor;
    let buttonBackgroundColor;
    applySelectors(button, (btn) => {
        buttonColor = btn.color;
        buttonBackgroundColor = btn.backgroundColor;
    });
    return { color: buttonColor, backgroundColor: buttonBackgroundColor };
}
export function getLabelColor() {
    if (!label) {
        const Label = require('../label').Label;
        label = new Label();
        if (global.isIOS) {
            label._setupUI({});
        }
    }
    let labelColor;
    applySelectors(label, (lbl) => {
        labelColor = lbl.color;
    });
    return labelColor;
}
export function getTextFieldColor() {
    if (!textField) {
        const TextField = require('../text-field').TextField;
        textField = new TextField();
        if (global.isIOS) {
            textField._setupUI({});
        }
    }
    let textFieldColor;
    applySelectors(textField, (tf) => {
        textFieldColor = tf.color;
    });
    return textFieldColor;
}
export function isDialogOptions(arg) {
    return arg && (arg.message || arg.title);
}
export function parseLoginOptions(args) {
    // Handle options object first
    if (args.length === 1 && isObject(args[0])) {
        return args[0];
    }
    const options = {
        title: DialogStrings.LOGIN,
        okButtonText: DialogStrings.OK,
        cancelButtonText: DialogStrings.CANCEL,
    };
    if (isString(args[0])) {
        options.message = args[0];
    }
    if (isString(args[1])) {
        options.userNameHint = args[1];
    }
    if (isString(args[2])) {
        options.passwordHint = args[2];
    }
    if (isString(args[3])) {
        options.userName = args[3];
    }
    if (isString(args[4])) {
        options.password = args[4];
    }
    return options;
}
//# sourceMappingURL=dialogs-common.js.map