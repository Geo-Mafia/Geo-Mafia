import { Color } from '../../../color';
import { RootLayoutBase, defaultShadeCoverOptions } from './root-layout-common';
import { parseLinearGradient } from '../../../css/parser';
import { LinearGradient } from '../../styling/linear-gradient';
export * from './root-layout-common';
export class RootLayout extends RootLayoutBase {
    constructor() {
        super();
    }
    insertChild(view, atIndex) {
        super.insertChild(view, atIndex);
        if (!view.hasGestureObservers()) {
            // block tap events from going through to layers behind the view
            view.nativeViewProtected.setOnTouchListener(new android.view.View.OnTouchListener({
                onTouch: function (view, event) {
                    return true;
                },
            }));
        }
    }
    removeChild(view) {
        if (view.hasGestureObservers()) {
            view.nativeViewProtected.setOnTouchListener(null);
        }
        super.removeChild(view);
    }
    _bringToFront(view) {
        view.nativeViewProtected.bringToFront();
    }
    _initShadeCover(view, shadeOptions) {
        var _a;
        const initialState = Object.assign(Object.assign({}, defaultShadeCoverOptions.animation.enterFrom), (_a = shadeOptions === null || shadeOptions === void 0 ? void 0 : shadeOptions.animation) === null || _a === void 0 ? void 0 : _a.enterFrom);
        this._playAnimation(this._getAnimationSet(view, initialState));
    }
    _updateShadeCover(view, shadeOptions) {
        var _a, _b;
        const options = Object.assign(Object.assign({}, defaultShadeCoverOptions), shadeOptions);
        const duration = ((_b = (_a = options.animation) === null || _a === void 0 ? void 0 : _a.enterFrom) === null || _b === void 0 ? void 0 : _b.duration) || defaultShadeCoverOptions.animation.enterFrom.duration;
        return this._playAnimation(this._getAnimationSet(view, {
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
            rotate: 0,
            opacity: options.opacity,
        }, options.color), duration);
    }
    _closeShadeCover(view, shadeOptions) {
        var _a;
        const exitState = Object.assign(Object.assign({}, defaultShadeCoverOptions.animation.exitTo), (_a = shadeOptions === null || shadeOptions === void 0 ? void 0 : shadeOptions.animation) === null || _a === void 0 ? void 0 : _a.exitTo);
        return this._playAnimation(this._getAnimationSet(view, exitState), exitState === null || exitState === void 0 ? void 0 : exitState.duration);
    }
    _getAnimationSet(view, shadeCoverAnimation, backgroundColor = defaultShadeCoverOptions.color) {
        const backgroundIsGradient = backgroundColor.startsWith('linear-gradient');
        const animationSet = Array.create(android.animation.Animator, backgroundIsGradient ? 6 : 7);
        animationSet[0] = android.animation.ObjectAnimator.ofFloat(view.nativeViewProtected, 'translationX', [shadeCoverAnimation.translateX]);
        animationSet[1] = android.animation.ObjectAnimator.ofFloat(view.nativeViewProtected, 'translationY', [shadeCoverAnimation.translateY]);
        animationSet[2] = android.animation.ObjectAnimator.ofFloat(view.nativeViewProtected, 'scaleX', [shadeCoverAnimation.scaleX]);
        animationSet[3] = android.animation.ObjectAnimator.ofFloat(view.nativeViewProtected, 'scaleY', [shadeCoverAnimation.scaleY]);
        animationSet[4] = android.animation.ObjectAnimator.ofFloat(view.nativeViewProtected, 'rotation', [shadeCoverAnimation.rotate]);
        animationSet[5] = android.animation.ObjectAnimator.ofFloat(view.nativeViewProtected, 'alpha', [shadeCoverAnimation.opacity]);
        if (backgroundIsGradient) {
            if (view.backgroundColor) {
                view.backgroundColor = undefined;
            }
            const parsedGradient = parseLinearGradient(backgroundColor);
            view.backgroundImage = LinearGradient.parse(parsedGradient.value);
        }
        else {
            if (view.backgroundImage) {
                view.backgroundImage = undefined;
            }
            animationSet[6] = this._getBackgroundColorAnimator(view, backgroundColor);
        }
        return animationSet;
    }
    _getBackgroundColorAnimator(view, backgroundColor) {
        const nativeArray = Array.create(java.lang.Object, 2);
        nativeArray[0] = view.backgroundColor ? java.lang.Integer.valueOf(view.backgroundColor.argb) : java.lang.Integer.valueOf(-1);
        nativeArray[1] = java.lang.Integer.valueOf(new Color(backgroundColor).argb);
        const backgroundColorAnimator = android.animation.ValueAnimator.ofObject(new android.animation.ArgbEvaluator(), nativeArray);
        backgroundColorAnimator.addUpdateListener(new android.animation.ValueAnimator.AnimatorUpdateListener({
            onAnimationUpdate(animator) {
                let argb = animator.getAnimatedValue().intValue();
                view.backgroundColor = new Color(argb);
            },
        }));
        return backgroundColorAnimator;
    }
    _playAnimation(animationSet, duration = 0) {
        return new Promise((resolve) => {
            const animatorSet = new android.animation.AnimatorSet();
            animatorSet.playTogether(animationSet);
            animatorSet.setDuration(duration);
            animatorSet.addListener(new android.animation.Animator.AnimatorListener({
                onAnimationStart: function (animator) { },
                onAnimationEnd: function (animator) {
                    resolve();
                },
                onAnimationRepeat: function (animator) { },
                onAnimationCancel: function (animator) { },
            }));
            animatorSet.start();
        });
    }
}
//# sourceMappingURL=index.android.js.map