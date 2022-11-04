import { Transition } from '.';
export declare class FlipTransition extends Transition {
    private _direction;
    constructor(direction: string, duration: number, curve: any);
    createAndroidAnimator(transitionType: string): android.animation.AnimatorSet;
}
