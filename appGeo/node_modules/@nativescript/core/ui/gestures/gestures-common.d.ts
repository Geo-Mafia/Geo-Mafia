import { GestureEventData, GesturesObserver as GesturesObserverDefinition } from '.';
import { View } from '../core/view';
export * from './touch-manager';
export declare enum GestureEvents {
    gestureAttached = "gestureAttached",
    touchDown = "touchDown",
    touchUp = "touchUp"
}
export declare enum GestureTypes {
    tap = 1,
    doubleTap = 2,
    pinch = 4,
    pan = 8,
    swipe = 16,
    rotation = 32,
    longPress = 64,
    touch = 128
}
export declare enum GestureStateTypes {
    cancelled = 0,
    began = 1,
    changed = 2,
    ended = 3
}
export declare enum SwipeDirection {
    right = 1,
    left = 2,
    up = 4,
    down = 8
}
export declare namespace TouchAction {
    const down = "down";
    const up = "up";
    const move = "move";
    const cancel = "cancel";
}
export declare function toString(type: GestureTypes, separator?: string): string;
export declare function fromString(type: string): GestureTypes;
export declare abstract class GesturesObserverBase implements GesturesObserverDefinition {
    private _callback;
    private _target;
    private _context;
    type: GestureTypes;
    get callback(): (args: GestureEventData) => void;
    get target(): View;
    get context(): any;
    constructor(target: View, callback: (args: GestureEventData) => void, context: any);
    abstract androidOnTouchEvent(motionEvent: android.view.MotionEvent): any;
    abstract observe(type: GestureTypes): any;
    disconnect(): void;
}
