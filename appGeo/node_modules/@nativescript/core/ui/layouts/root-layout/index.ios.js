import { Color } from '../../../color';
import { RootLayoutBase, defaultShadeCoverOptions } from './root-layout-common';
import { LinearGradient } from '../../styling/linear-gradient';
import { ios as iosViewUtils } from '../../utils';
import { parseLinearGradient } from '../../../css/parser';
export * from './root-layout-common';
export class RootLayout extends RootLayoutBase {
    constructor() {
        super();
    }
    _bringToFront(view) {
        this.nativeViewProtected.bringSubviewToFront(view.nativeViewProtected);
    }
    _initShadeCover(view, shadeOptions) {
        var _a;
        const initialState = Object.assign(Object.assign({}, defaultShadeCoverOptions.animation.enterFrom), (_a = shadeOptions === null || shadeOptions === void 0 ? void 0 : shadeOptions.animation) === null || _a === void 0 ? void 0 : _a.enterFrom);
        this._applyAnimationProperties(view, initialState);
    }
    _updateShadeCover(view, shadeOptions) {
        return new Promise((resolve) => {
            var _a, _b;
            const options = Object.assign(Object.assign({}, defaultShadeCoverOptions), shadeOptions);
            if (view === null || view === void 0 ? void 0 : view.nativeViewProtected) {
                const duration = this._convertDurationToSeconds(((_b = (_a = options.animation) === null || _a === void 0 ? void 0 : _a.enterFrom) === null || _b === void 0 ? void 0 : _b.duration) || defaultShadeCoverOptions.animation.enterFrom.duration);
                if (options.color && options.color.startsWith('linear-gradient')) {
                    if (options.color !== this._currentGradient) {
                        this._currentGradient = options.color;
                        const parsedGradient = parseLinearGradient(options.color);
                        this._gradientLayer = iosViewUtils.drawGradient(view.nativeViewProtected, LinearGradient.parse(parsedGradient.value), 0);
                    }
                }
                UIView.animateWithDurationAnimationsCompletion(duration, () => {
                    if (this._gradientLayer) {
                        this._gradientLayer.opacity = 1;
                    }
                    else if (options.color && (view === null || view === void 0 ? void 0 : view.nativeViewProtected)) {
                        view.nativeViewProtected.backgroundColor = new Color(options.color).ios;
                    }
                    this._applyAnimationProperties(view, {
                        translateX: 0,
                        translateY: 0,
                        scaleX: 1,
                        scaleY: 1,
                        rotate: 0,
                        opacity: shadeOptions.opacity,
                    });
                }, (completed) => {
                    resolve();
                });
            }
        });
    }
    _closeShadeCover(view, shadeOptions) {
        return new Promise((resolve) => {
            var _a;
            const exitState = Object.assign(Object.assign({}, defaultShadeCoverOptions.animation.exitTo), (_a = shadeOptions === null || shadeOptions === void 0 ? void 0 : shadeOptions.animation) === null || _a === void 0 ? void 0 : _a.exitTo);
            if (view && view.nativeViewProtected) {
                UIView.animateWithDurationAnimationsCompletion(this._convertDurationToSeconds(exitState.duration), () => {
                    this._applyAnimationProperties(view, exitState);
                }, (completed) => {
                    resolve();
                });
            }
        });
    }
    _cleanupPlatformShadeCover() {
        this._currentGradient = null;
        this._gradientLayer = null;
    }
    _applyAnimationProperties(view, shadeCoverAnimation) {
        if (view === null || view === void 0 ? void 0 : view.nativeViewProtected) {
            const translate = CGAffineTransformMakeTranslation(shadeCoverAnimation.translateX, shadeCoverAnimation.translateY);
            // ios doesn't like scale being 0, default it to a small number greater than 0
            const scale = CGAffineTransformMakeScale(shadeCoverAnimation.scaleX || 0.1, shadeCoverAnimation.scaleY || 0.1);
            const rotate = CGAffineTransformMakeRotation((shadeCoverAnimation.rotate * Math.PI) / 180); // convert degress to radians
            const translateAndScale = CGAffineTransformConcat(translate, scale);
            view.nativeViewProtected.transform = CGAffineTransformConcat(rotate, translateAndScale);
            view.nativeViewProtected.alpha = shadeCoverAnimation.opacity;
        }
    }
    _convertDurationToSeconds(duration) {
        return duration / 1000;
    }
}
//# sourceMappingURL=index.ios.js.map