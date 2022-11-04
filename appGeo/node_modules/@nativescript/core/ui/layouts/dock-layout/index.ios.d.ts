import { DockLayoutBase } from './dock-layout-common';
import { View } from '../../core/view';
export * from './dock-layout-common';
export declare class DockLayout extends DockLayoutBase {
    onDockChanged(view: View, oldValue: 'left' | 'top' | 'right' | 'bottom', newValue: 'left' | 'top' | 'right' | 'bottom'): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
}
