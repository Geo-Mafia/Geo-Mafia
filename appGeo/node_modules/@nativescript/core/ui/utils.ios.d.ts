import { LinearGradient } from './styling/linear-gradient';
interface NativeScriptUIView extends UIView {
    hasNonUniformBorder: boolean;
    borderLayer: CALayer;
    hasBorderMask: boolean;
    borderOriginalMask: CALayer;
    topBorderLayer: CALayer;
    rightBorderLayer: CALayer;
    bottomBorderLayer: CALayer;
    leftBorderLayer: CALayer;
    gradientLayer: CAGradientLayer;
    boxShadowLayer: CALayer;
}
export declare namespace ios {
    function getActualHeight(view: UIView): number;
    function getStatusBarHeight(viewController?: UIViewController): number;
    function drawGradient(nativeView: NativeScriptUIView, gradient: LinearGradient, gradientLayerOpacity?: number, index?: number): CAGradientLayer;
    function clearGradient(nativeView: NativeScriptUIView): void;
}
export {};
