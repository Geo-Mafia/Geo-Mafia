import { SearchBar as SearchBarDefinition } from '.';
import { View } from '../core/view';
import { Property } from '../core/properties';
import { Color } from '../../color';
export declare abstract class SearchBarBase extends View implements SearchBarDefinition {
    static submitEvent: string;
    static clearEvent: string;
    text: string;
    hint: string;
    textFieldBackgroundColor: Color;
    textFieldHintColor: Color;
    abstract dismissSoftInput(): any;
}
export declare const textProperty: Property<SearchBarBase, string>;
export declare const hintProperty: Property<SearchBarBase, string>;
export declare const textFieldHintColorProperty: Property<SearchBarBase, Color>;
export declare const textFieldBackgroundColorProperty: Property<SearchBarBase, Color>;
