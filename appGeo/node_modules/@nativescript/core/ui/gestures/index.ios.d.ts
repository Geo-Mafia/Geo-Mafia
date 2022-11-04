import { GestureEventData } from '.';
import { View } from '../core/view';
import { GesturesObserverBase, GestureTypes } from './gestures-common';
export * from './gestures-common';
export declare function observe(target: View, type: GestureTypes, callback: (args: GestureEventData) => void, context?: any): GesturesObserver;
export declare class GesturesObserver extends GesturesObserverBase {
    private _recognizers;
    private _onTargetLoaded;
    private _onTargetUnloaded;
    constructor(target: View, callback: (args: GestureEventData) => void, context: any);
    androidOnTouchEvent(motionEvent: android.view.MotionEvent): void;
    observe(type: GestureTypes): void;
    private _attach;
    private _detach;
    disconnect(): void;
    _executeCallback(args: GestureEventData): void;
    private _createRecognizer;
}
