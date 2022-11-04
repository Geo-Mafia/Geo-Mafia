import { Transition } from '.';
export declare class SlideTransition extends Transition {
    private _direction;
    constructor(direction: string, duration: number, curve: any);
    animateIOSTransition(containerView: UIView, fromView: UIView, toView: UIView, operation: UINavigationControllerOperation, completion: (finished: boolean) => void): void;
}
