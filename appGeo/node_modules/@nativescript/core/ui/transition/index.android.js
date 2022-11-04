// Types.
import { _resolveAnimationCurve } from '../animation';
import lazy from '../../utils/lazy';
const _defaultInterpolator = lazy(() => new android.view.animation.AccelerateDecelerateInterpolator());
let transitionId = 0;
export class Transition {
    constructor(duration, curve) {
        this._duration = duration;
        this._interpolator = curve ? _resolveAnimationCurve(curve) : _defaultInterpolator();
        this._id = transitionId++;
    }
    getDuration() {
        return this._duration;
    }
    getCurve() {
        return this._interpolator;
    }
    animateIOSTransition(containerView, fromView, toView, operation, completion) {
        throw new Error('Abstract method call');
    }
    createAndroidAnimator(transitionType) {
        throw new Error('Abstract method call');
    }
    toString() {
        return `Transition@${this._id}`;
    }
}
Transition.AndroidTransitionType = {
    enter: 'enter',
    exit: 'exit',
    popEnter: 'popEnter',
    popExit: 'popExit',
};
//# sourceMappingURL=index.android.js.map