import { StackLayoutBase } from './stack-layout-common';
export * from './stack-layout-common';
export declare class StackLayout extends StackLayoutBase {
    private _totalLength;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    private layoutVertical;
    private layoutHorizontal;
    private isUnsizedScrollableView;
}
