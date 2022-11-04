import { Color } from '../../color';
import { Page } from '../page';
export declare namespace DialogStrings {
    const STRING = "string";
    const PROMPT = "Prompt";
    const CONFIRM = "Confirm";
    const ALERT = "Alert";
    const LOGIN = "Login";
    const OK = "OK";
    const CANCEL = "Cancel";
}
/**
 * Provides options for the dialog.
 */
export interface CancelableOptions {
    /**
     * [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
     */
    cancelable?: boolean;
    /**
     * [Android only] Sets the theme of the Dialog. Usable themes can be found: https://developer.android.com/reference/android/R.style
     */
    theme?: number;
}
/**
 * Provides options for the dialog.
 */
export interface ActionOptions extends CancelableOptions {
    /**
     * Gets or sets the dialog title.
     */
    title?: string;
    /**
     * Gets or sets the dialog message.
     */
    message?: string;
    /**
     * Gets or sets the Cancel button text.
     */
    cancelButtonText?: string;
    /**
     * Gets or sets the list of available actions.
     */
    actions?: Array<string>;
    /**
     * [iOS only] Gets or sets the indexes of destructive actions.
     */
    destructiveActionsIndexes?: Array<number>;
}
/**
 * Provides options for the dialog.
 */
export interface DialogOptions extends CancelableOptions {
    /**
     * Gets or sets the dialog title.
     */
    title?: string;
    /**
     * Gets or sets the dialog message.
     */
    message?: string;
}
/**
 * Provides options for the alert.
 */
export interface AlertOptions extends DialogOptions {
    /**
     * Gets or sets the OK button text.
     */
    okButtonText?: string;
}
/**
 * Provides options for the confirm dialog.
 */
export interface ConfirmOptions extends AlertOptions {
    /**
     * Gets or sets the Cancel button text.
     */
    cancelButtonText?: string;
    /**
     * Gets or sets the neutral button text.
     */
    neutralButtonText?: string;
}
/**
 * Provides options for the prompt dialog.
 */
export interface PromptOptions extends ConfirmOptions {
    /**
     * Gets or sets the default text to display in the input box.
     */
    defaultText?: string;
    /**
     * Gets or sets the prompt input type (plain text, password, or email).
     */
    inputType?: string;
    /**
     * Gets or sets the prompt capitalizationType (none, all, sentences, or words).
     */
    capitalizationType?: string;
}
/**
 * Provides result data from the prompt dialog.
 */
export interface PromptResult {
    /**
     * Gets or sets the prompt dialog boolean result.
     */
    result: boolean;
    /**
     *  Gets or sets the text entered in the prompt dialog.
     */
    text: string;
}
/**
 * Provides result data from the login dialog.
 */
export interface LoginResult {
    /**
     * Gets or sets the login dialog boolean result.
     */
    result: boolean;
    /**
     *  Gets or sets the user entered in the login dialog.
     */
    userName: string;
    /**
     *  Gets or sets the password entered in the login dialog.
     */
    password: string;
}
/**
 * Provides options for the login dialog.
 */
export interface LoginOptions extends ConfirmOptions {
    /**
     * Gets or sets the default text to display as hint in the user name input box.
     */
    userNameHint?: string;
    /**
     * Gets or sets the default text to display as hint in the password input box.
     */
    passwordHint?: string;
    /**
     * Gets or sets the default text to display in the user name input box.
     */
    userName?: string;
    /**
     * Gets or sets the default text to display in the password input box.
     */
    password?: string;
}
/**
 * Defines the input type for prompt dialog.
 */
export declare namespace inputType {
    /**
     * Plain text input type.
     */
    const text = "text";
    /**
     * Password input type.
     */
    const password = "password";
    /**
     * Email input type.
     */
    const email = "email";
    /**
     * Number input type
     */
    const number = "number";
    /**
     * Decimal input type
     */
    const decimal = "decimal";
    /**
     * Phone input type
     */
    const phone = "phone";
}
/**
 * Defines the capitalization type for prompt dialog.
 */
export declare namespace capitalizationType {
    /**
     * No automatic capitalization.
     */
    const none = "none";
    /**
     * Capitalizes every character.
     */
    const all = "all";
    /**
     * Capitalize the first word of each sentence.
     */
    const sentences = "sentences";
    /**
     * Capitalize the first letter of every word.
     */
    const words = "words";
}
export declare function getCurrentPage(): Page;
export declare function getButtonColors(): {
    color: Color;
    backgroundColor: Color;
};
export declare function getLabelColor(): Color;
export declare function getTextFieldColor(): Color;
export declare function isDialogOptions(arg: any): boolean;
export declare function parseLoginOptions(args: any[]): LoginOptions;
