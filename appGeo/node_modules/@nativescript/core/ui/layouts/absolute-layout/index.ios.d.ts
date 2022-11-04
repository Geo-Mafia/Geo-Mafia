import { AbsoluteLayoutBase } from './absolute-layout-common';
import { CoreTypes } from '../../../core-types';
import { View } from '../../core/view';
export * from './absolute-layout-common';
export declare class AbsoluteLayout extends AbsoluteLayoutBase {
    onLeftChanged(view: View, oldValue: CoreTypes.LengthType, newValue: CoreTypes.LengthType): void;
    onTopChanged(view: View, oldValue: CoreTypes.LengthType, newValue: CoreTypes.LengthType): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
}
