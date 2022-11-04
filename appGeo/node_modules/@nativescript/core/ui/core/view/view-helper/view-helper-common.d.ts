import { View as ViewDefinition } from '..';
export declare class ViewHelper {
    static measureChild(parent: ViewDefinition, child: ViewDefinition, widthMeasureSpec: number, heightMeasureSpec: number): {
        measuredWidth: number;
        measuredHeight: number;
    };
    static layoutChild(parent: ViewDefinition, child: ViewDefinition, left: number, top: number, right: number, bottom: number, setFrame?: boolean): void;
    static resolveSizeAndState(size: number, specSize: number, specMode: number, childMeasuredState: number): number;
    static combineMeasuredStates(curState: number, newState: any): number;
    private static getMeasureSpec;
}
