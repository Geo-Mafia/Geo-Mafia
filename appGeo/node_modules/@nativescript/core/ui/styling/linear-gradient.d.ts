import { CoreTypes } from '../../core-types';
import { Color } from '../../color';
import type { LinearGradient as CSSLinearGradient } from '../../css/parser';
export interface ColorStop {
    color: Color;
    offset?: CoreTypes.LengthPercentUnit;
}
export declare class LinearGradient {
    angle: number;
    colorStops: ColorStop[];
    static parse(value: CSSLinearGradient): LinearGradient;
    static equals(first: LinearGradient, second: LinearGradient): boolean;
}
