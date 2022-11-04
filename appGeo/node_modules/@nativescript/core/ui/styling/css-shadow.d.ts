import { CoreTypes } from '../../core-types';
import { Color } from '../../color';
export interface CSSShadow {
    inset: boolean;
    offsetX: CoreTypes.LengthType;
    offsetY: CoreTypes.LengthType;
    blurRadius?: CoreTypes.LengthType;
    spreadRadius?: CoreTypes.LengthType;
    color: Color;
}
/**
 * Parse a string into a CSSShadow
 * Supports any valid css box/text shadow combination.
 *
 * inspired by https://github.com/jxnblk/css-box-shadow/blob/master/index.js (MIT License)
 *
 * @param value
 */
export declare function parseCSSShadow(value: string): CSSShadow;
