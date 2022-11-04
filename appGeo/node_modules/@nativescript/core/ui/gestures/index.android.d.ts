import { GestureEventData } from '.';
import { View } from '../core/view';
import { GesturesObserverBase, GestureTypes } from './gestures-common';
export * from './gestures-common';
export declare function observe(target: View, type: GestureTypes, callback: (args: GestureEventData) => void, context?: any): GesturesObserver;
export declare class GesturesObserver extends GesturesObserverBase {
    private _notifyTouch;
    private _simpleGestureDetector;
    private _scaleGestureDetector;
    private _swipeGestureDetector;
    private _panGestureDetector;
    private _rotateGestureDetector;
    private _eventData;
    private _onTargetLoaded;
    private _onTargetUnloaded;
    observe(type: GestureTypes): void;
    disconnect(): void;
    private _detach;
    private _attach;
    androidOnTouchEvent(motionEvent: android.view.MotionEvent): void;
}
