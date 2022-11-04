import { NavigationTransition, BackstackEntry } from '.';
import { Transition } from '../transition';
export declare const waitingQueue: Map<number, Set<ExpandedEntry>>;
export declare const completedEntries: Map<number, ExpandedEntry>;
interface ExpandedTransitionListener extends androidx.transition.Transition.TransitionListener {
    entry: ExpandedEntry;
    transition: androidx.transition.Transition;
}
interface ExpandedAnimator extends android.animation.Animator {
    entry: ExpandedEntry;
    backEntry?: BackstackEntry;
    transitionType?: string;
}
export interface ExpandedEntry extends BackstackEntry {
    enterTransitionListener: ExpandedTransitionListener;
    exitTransitionListener: ExpandedTransitionListener;
    reenterTransitionListener: ExpandedTransitionListener;
    returnTransitionListener: ExpandedTransitionListener;
    enterAnimator: ExpandedAnimator;
    exitAnimator: ExpandedAnimator;
    popEnterAnimator: ExpandedAnimator;
    popExitAnimator: ExpandedAnimator;
    transition: Transition;
    transitionName: string;
    frameId: number;
    isNestedDefaultTransition: boolean;
    isAnimationRunning: boolean;
}
export declare function _setAndroidFragmentTransitions(animated: boolean, navigationTransition: NavigationTransition, currentEntry: ExpandedEntry, newEntry: ExpandedEntry, frameId: number, fragmentTransaction: androidx.fragment.app.FragmentTransaction, isNestedDefaultTransition?: boolean): void;
export declare function _getAnimatedEntries(frameId: number): Set<BackstackEntry>;
export declare function _updateTransitions(entry: ExpandedEntry): void;
export declare function _reverseTransitions(previousEntry: ExpandedEntry, currentEntry: ExpandedEntry): boolean;
export declare function _clearFragment(entry: ExpandedEntry): void;
export declare function _clearEntry(entry: ExpandedEntry): void;
export declare function addNativeTransitionListener(entry: ExpandedEntry, nativeTransition: androidx.transition.Transition): ExpandedTransitionListener;
export {};
