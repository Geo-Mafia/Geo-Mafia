import { CubicBezierAnimationCurve as CubicBezierAnimationCurveDefinition, Animation as AnimationBaseDefinition } from '.';
import { AnimationDefinition, AnimationPromise as AnimationPromiseDefinition, PropertyAnimation } from './animation-interfaces';
export * from './animation-interfaces';
export declare namespace Properties {
    const opacity = "opacity";
    const backgroundColor = "backgroundColor";
    const translate = "translate";
    const rotate = "rotate";
    const scale = "scale";
    const height = "height";
    const width = "width";
}
export declare class CubicBezierAnimationCurve implements CubicBezierAnimationCurveDefinition {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    constructor(x1: number, y1: number, x2: number, y2: number);
}
export declare abstract class AnimationBase implements AnimationBaseDefinition {
    _propertyAnimations: Array<PropertyAnimation>;
    _playSequentially: boolean;
    private _isPlaying;
    private _resolve;
    private _reject;
    constructor(animationDefinitions: Array<AnimationDefinition>, playSequentially?: boolean);
    abstract _resolveAnimationCurve(curve: any): any;
    protected _rejectAlreadyPlaying(): AnimationPromiseDefinition;
    play(): AnimationPromiseDefinition;
    private fixupAnimationPromise;
    cancel(): void;
    get isPlaying(): boolean;
    _resolveAnimationFinishedPromise(): void;
    _rejectAnimationFinishedPromise(): void;
    private static _createPropertyAnimations;
    static _getAnimationInfo(animation: PropertyAnimation): string;
}
