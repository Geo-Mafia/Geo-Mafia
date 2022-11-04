import { Color } from '../../color';
import { View } from '../core/view';
import { Property } from '../core/properties';
import { Switch as SwitchDefinition } from '.';
export declare class SwitchBase extends View implements SwitchDefinition {
    static checkedChangeEvent: string;
    checked: boolean;
    offBackgroundColor: Color;
    _onCheckedPropertyChanged(newValue: boolean): void;
}
export declare const checkedProperty: Property<SwitchBase, boolean>;
export declare const offBackgroundColorProperty: Property<SwitchBase, Color>;
