import * as common from './color-common';
export declare class Color extends common.Color {
    private _ios;
    get ios(): UIColor;
    static fromIosColor(value: UIColor): Color;
}
