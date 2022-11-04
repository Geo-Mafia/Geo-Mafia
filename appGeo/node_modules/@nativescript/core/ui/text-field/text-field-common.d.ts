import { TextField as TextFieldDefinition } from '.';
import { EditableTextBase } from '../editable-text-base';
import { Property } from '../core/properties';
export declare class TextFieldBase extends EditableTextBase implements TextFieldDefinition {
    static returnPressEvent: string;
    secure: boolean;
    closeOnReturn: boolean;
    secureWithoutAutofill: boolean;
}
export declare const secureProperty: Property<TextFieldBase, boolean>;
export declare const closeOnReturnProperty: Property<TextFieldBase, boolean>;
