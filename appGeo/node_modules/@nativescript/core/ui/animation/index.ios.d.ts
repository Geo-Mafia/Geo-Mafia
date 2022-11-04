import { AnimationDefinitionInternal, AnimationPromise } from './animation-common';
import { View } from '../core/view';
import { AnimationBase, CubicBezierAnimationCurve } from './animation-common';
export * from './animation-common';
export { KeyframeAnimation, KeyframeAnimationInfo, KeyframeDeclaration, KeyframeInfo } from './keyframe-animation';
export declare function _resolveAnimationCurve(curve: string | CubicBezierAnimationCurve | CAMediaTimingFunction): CAMediaTimingFunction | string;
export declare class Animation extends AnimationBase {
    private _iOSAnimationFunction;
    private _finishedAnimations;
    private _cancelledAnimations;
    private _mergedPropertyAnimations;
    private _valueSource;
    constructor(animationDefinitions: Array<AnimationDefinitionInternal>, playSequentially?: boolean);
    play(): AnimationPromise;
    cancel(): void;
    _resolveAnimationCurve(curve: string | CubicBezierAnimationCurve | CAMediaTimingFunction): CAMediaTimingFunction | string;
    private static _createiOSAnimationFunction;
    private static _getNativeAnimationArguments;
    private static _createNativeAnimation;
    private static _createGroupAnimation;
    private static _createBasicAnimation;
    private static _createNativeSpringAnimation;
    private static _createNativeAffineTransform;
    private static _isAffineTransform;
    private static _canBeMerged;
    private static _mergeAffineTransformAnimations;
}
export declare function _getTransformMismatchErrorMessage(view: View): string;
