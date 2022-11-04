export declare class Transition {
    static AndroidTransitionType: {
        enter: string;
        exit: string;
        popEnter: string;
        popExit: string;
    };
    private _duration;
    private _interpolator;
    private _id;
    constructor(duration: number, curve: any);
    getDuration(): number;
    getCurve(): android.view.animation.Interpolator;
    animateIOSTransition(containerView: any, fromView: any, toView: any, operation: any, completion: (finished: boolean) => void): void;
    createAndroidAnimator(transitionType: string): android.animation.Animator;
    toString(): string;
}
