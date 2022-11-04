import { AnimationDefinitionInternal, AnimationPromise } from './animation-common';
import { AnimationBase, CubicBezierAnimationCurve } from './animation-common';
export * from './animation-common';
export { KeyframeAnimation, KeyframeAnimationInfo, KeyframeDeclaration, KeyframeInfo } from './keyframe-animation';
export declare function _resolveAnimationCurve(curve: string | CubicBezierAnimationCurve | android.view.animation.Interpolator | android.view.animation.LinearInterpolator): android.view.animation.Interpolator;
export declare class Animation extends AnimationBase {
    private _animatorListener;
    private _nativeAnimatorsArray;
    private _animatorSet;
    private _animators;
    private _propertyUpdateCallbacks;
    private _propertyResetCallbacks;
    private _valueSource;
    private _target;
    private _resetOnFinish;
    constructor(animationDefinitions: Array<AnimationDefinitionInternal>, playSequentially?: boolean);
    play(resetOnFinish?: boolean): AnimationPromise;
    cancel(): void;
    _resolveAnimationCurve(curve: string | CubicBezierAnimationCurve | android.view.animation.Interpolator): android.view.animation.Interpolator;
    private _play;
    private _onAndroidAnimationEnd;
    private _onAndroidAnimationCancel;
    private _createAnimators;
}
