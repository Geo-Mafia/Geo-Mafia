export declare class Transition {
    static AndroidTransitionType: {};
    private _duration;
    private _curve;
    private _id;
    constructor(duration: number, curve?: UIViewAnimationCurve);
    getDuration(): number;
    getCurve(): UIViewAnimationCurve;
    animateIOSTransition(containerView: UIView, fromView: UIView, toView: UIView, operation: UINavigationControllerOperation, completion: (finished: boolean) => void): void;
    createAndroidAnimator(transitionType: string): any;
    toString(): string;
}
