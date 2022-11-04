import { CoreTypes } from '../../core-types';
import { LinearGradient } from './linear-gradient';
import { Color } from '../../color';
import { CSSShadow } from './css-shadow';
/**
 * Flags used to hint the background handler if it has to clear a specific property
 *
 * Flags can be combined with the | operator
 * for example: BackgroundClearFlags.CLEAR_BACKGROUND_COLOR | BackgroundClearFlags.CLEAR_BOX_SHADOW
 *
 * Flags can be checked for using the & operator
 * for example: if(clearFlags & BackgroundClearFlags.CLEAR_BOX_SHADOW) { ...clear box shadow... }
 */
export declare const enum BackgroundClearFlags {
    NONE = 0,
    CLEAR_BACKGROUND_COLOR = 1,
    CLEAR_BOX_SHADOW = 2
}
export declare class Background {
    static default: Background;
    color: Color;
    image: string | LinearGradient;
    repeat: CoreTypes.BackgroundRepeatType;
    position: string;
    size: string;
    borderTopColor: Color;
    borderRightColor: Color;
    borderBottomColor: Color;
    borderLeftColor: Color;
    borderTopWidth: number;
    borderRightWidth: number;
    borderBottomWidth: number;
    borderLeftWidth: number;
    borderTopLeftRadius: number;
    borderTopRightRadius: number;
    borderBottomLeftRadius: number;
    borderBottomRightRadius: number;
    clipPath: string;
    boxShadow: CSSShadow;
    clearFlags: number;
    private clone;
    withColor(value: Color): Background;
    withImage(value: string | LinearGradient): Background;
    withRepeat(value: CoreTypes.BackgroundRepeatType): Background;
    withPosition(value: string): Background;
    withSize(value: string): Background;
    withBorderTopColor(value: Color): Background;
    withBorderRightColor(value: Color): Background;
    withBorderBottomColor(value: Color): Background;
    withBorderLeftColor(value: Color): Background;
    withBorderTopWidth(value: number): Background;
    withBorderRightWidth(value: number): Background;
    withBorderBottomWidth(value: number): Background;
    withBorderLeftWidth(value: number): Background;
    withBorderTopLeftRadius(value: number): Background;
    withBorderTopRightRadius(value: number): Background;
    withBorderBottomRightRadius(value: number): Background;
    withBorderBottomLeftRadius(value: number): Background;
    withClipPath(value: string): Background;
    withBoxShadow(value: CSSShadow): Background;
    isEmpty(): boolean;
    static equals(value1: Background, value2: Background): boolean;
    hasBorderColor(): boolean;
    hasBorderWidth(): boolean;
    hasBorderRadius(): boolean;
    hasUniformBorderColor(): boolean;
    hasUniformBorderWidth(): boolean;
    hasUniformBorderRadius(): boolean;
    hasUniformBorder(): boolean;
    getUniformBorderColor(): Color;
    getUniformBorderWidth(): number;
    getUniformBorderRadius(): number;
    hasBoxShadow(): boolean;
    getBoxShadow(): CSSShadow;
    toString(): string;
}
