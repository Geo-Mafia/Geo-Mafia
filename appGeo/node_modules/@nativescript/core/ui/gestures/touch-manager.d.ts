import { Animation } from '../animation';
import { AnimationDefinition } from '../animation/animation-interfaces';
import { View } from '../core/view';
export declare type TouchAnimationFn = (view: View) => void;
export declare type TouchAnimationOptions = {
    up?: TouchAnimationFn | AnimationDefinition;
    down?: TouchAnimationFn | AnimationDefinition;
};
export declare enum TouchAnimationTypes {
    up = "up",
    down = "down"
}
/**
 * Manage interactivity in your apps easily with TouchManager.
 * Store reusable down/up animation settings for touches as well as optionally enable automatic tap (down/up) animations for your app.
 */
export declare class TouchManager {
    /**
     * Enable animations for all tap bindings in the UI.
     */
    static enableGlobalTapAnimations: boolean;
    /**
     * Define reusable touch animations to use on views with touchAnimation defined or with enableGlobalTapAnimations on.
     */
    static animations: TouchAnimationOptions;
    /**
     * Native Touch handlers (iOS only) registered with the view through the TouchManager.
     * The TouchManager uses this internally but makes public for other versatility if needed.
     */
    static touchHandlers: Array<{
        view: View;
        handler: any;
    }>;
    /**
     * When using NativeScript AnimationDefinition's for touch animations this will contain any instances for finer grain control of starting/stopping under various circumstances.
     * The TouchManager uses this internally but makes public for other versatility if needed.
     */
    static touchAnimationDefinitions: Array<{
        view: View;
        animation: Animation;
        type: TouchAnimationTypes;
    }>;
    /**
     * The TouchManager uses this internally.
     * Adds touch animations to view based upon it's touchAnimation property or TouchManager.animations.
     * @param view NativeScript view instance
     */
    static addAnimations(view: View): void;
    static startAnimationForType(view: View, type: TouchAnimationTypes): void;
}
export declare let TouchControlHandler: {
    initWithOwner: (owner: WeakRef<View>) => any;
};
