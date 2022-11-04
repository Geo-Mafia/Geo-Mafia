import { WrapLayoutBase } from './wrap-layout-common';
export * from './wrap-layout-common';
export declare class WrapLayout extends WrapLayoutBase {
    private _lengths;
    private static getChildMeasureSpec;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
}
