import { SlideTransition } from '../transition/slide-transition';
import { FadeTransition } from '../transition/fade-transition';
import { Trace } from '../../trace';
var UIViewControllerAnimatedTransitioningMethods;
(function (UIViewControllerAnimatedTransitioningMethods) {
    const methodSignature = NSMethodSignature.signatureWithObjCTypes('v@:c');
    const invocation = NSInvocation.invocationWithMethodSignature(methodSignature);
    invocation.selector = 'completeTransition:';
    function completeTransition(didComplete) {
        const didCompleteReference = new interop.Reference(interop.types.bool, didComplete);
        invocation.setArgumentAtIndex(didCompleteReference, 2);
        invocation.invokeWithTarget(this);
    }
    UIViewControllerAnimatedTransitioningMethods.completeTransition = completeTransition;
})(UIViewControllerAnimatedTransitioningMethods || (UIViewControllerAnimatedTransitioningMethods = {}));
var AnimatedTransitioning = /** @class */ (function (_super) {
    __extends(AnimatedTransitioning, _super);
    function AnimatedTransitioning() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimatedTransitioning.init = function (transition, operation, fromVC, toVC) {
        var impl = AnimatedTransitioning.new();
        impl._transition = transition;
        impl._operation = operation;
        impl._fromVC = fromVC;
        impl._toVC = toVC;
        return impl;
    };
    AnimatedTransitioning.prototype.animateTransition = function (transitionContext) {
        var containerView = transitionContext.valueForKey('containerView');
        var completion = UIViewControllerAnimatedTransitioningMethods.completeTransition.bind(transitionContext);
        switch (this._operation) {
            case UINavigationControllerOperation.Push:
                this._transitionType = 'push';
                break;
            case UINavigationControllerOperation.Pop:
                this._transitionType = 'pop';
                break;
            case UINavigationControllerOperation.None:
                this._transitionType = 'none';
                break;
        }
        if (Trace.isEnabled()) {
            Trace.write("START ".concat(this._transition, " ").concat(this._transitionType), Trace.categories.Transition);
        }
        this._transition.animateIOSTransition(containerView, this._fromVC.view, this._toVC.view, this._operation, completion);
    };
    AnimatedTransitioning.prototype.transitionDuration = function (transitionContext) {
        return this._transition.getDuration();
    };
    AnimatedTransitioning.prototype.animationEnded = function (transitionCompleted) {
        if (transitionCompleted) {
            if (Trace.isEnabled()) {
                Trace.write("END ".concat(this._transition, " ").concat(this._transitionType), Trace.categories.Transition);
            }
        }
        else {
            if (Trace.isEnabled()) {
                Trace.write("CANCEL ".concat(this._transition, " ").concat(this._transitionType), Trace.categories.Transition);
            }
        }
    };
    AnimatedTransitioning.ObjCProtocols = [UIViewControllerAnimatedTransitioning];
    return AnimatedTransitioning;
}(NSObject));
export function _createIOSAnimatedTransitioning(navigationTransition, nativeCurve, operation, fromVC, toVC) {
    const instance = navigationTransition.instance;
    let transition;
    if (instance) {
        // Instance transition should take precedence even if the given name match existing transition.
        transition = instance;
    }
    else if (navigationTransition.name) {
        const name = navigationTransition.name.toLowerCase();
        if (name.indexOf('slide') === 0) {
            const direction = name.substr('slide'.length) || 'left'; //Extract the direction from the string
            transition = new SlideTransition(direction, navigationTransition.duration, nativeCurve);
        }
        else if (name === 'fade') {
            transition = new FadeTransition(navigationTransition.duration, nativeCurve);
        }
    }
    return transition ? AnimatedTransitioning.init(transition, operation, fromVC, toVC) : undefined;
}
//# sourceMappingURL=fragment.transitions.ios.js.map