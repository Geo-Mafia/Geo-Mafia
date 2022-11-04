import { Transition } from '.';
export declare class FadeTransition extends Transition {
    animateIOSTransition(containerView: UIView, fromView: UIView, toView: UIView, operation: UINavigationControllerOperation, completion: (finished: boolean) => void): void;
}
