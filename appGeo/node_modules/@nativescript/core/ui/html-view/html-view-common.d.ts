import { CssProperty } from '../core/properties';
import { View } from '../core/view';
import { Property } from '../core/properties';
import { Style } from '../styling/style';
import { Color } from '../../color';
import { HtmlView as HtmlViewDefinition } from '.';
export declare class HtmlViewBase extends View implements HtmlViewDefinition {
    html: string;
}
export declare const htmlProperty: Property<HtmlViewBase, string>;
export declare const linkColorProperty: CssProperty<Style, Color>;
