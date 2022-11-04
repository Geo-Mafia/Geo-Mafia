import { iOSFrame as iOSFrameDefinition, BackstackEntry, NavigationTransition } from '.';
import { FrameBase, NavigationType } from './frame-common';
import { Page } from '../page';
export * from './frame-common';
export declare class Frame extends FrameBase {
    viewController: UINavigationControllerImpl;
    _animatedDelegate: UINavigationControllerDelegate;
    _ios: iOSFrame;
    constructor();
    createNativeView(): UIView;
    disposeNativeView(): void;
    get ios(): iOSFrame;
    setCurrent(entry: BackstackEntry, navigationType: NavigationType): void;
    _navigateCore(backstackEntry: any): void;
    _goBackCore(backstackEntry: BackstackEntry): void;
    _updateActionBar(page?: Page, disableNavBarAnimation?: boolean): void;
    _getNavBarVisible(page: Page): boolean;
    static get defaultAnimatedNavigation(): boolean;
    static set defaultAnimatedNavigation(value: boolean);
    static get defaultTransition(): NavigationTransition;
    static set defaultTransition(value: NavigationTransition);
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    layoutNativeView(left: number, top: number, right: number, bottom: number): void;
    _setNativeViewFrame(nativeView: UIView, frame: CGRect): void;
    _onNavigatingTo(backstackEntry: BackstackEntry, isBack: boolean): void;
}
declare class UINavigationControllerImpl extends UINavigationController {
    private _owner;
    static initWithOwner(owner: WeakRef<Frame>): UINavigationControllerImpl;
    get owner(): Frame;
    viewWillAppear(animated: boolean): void;
    viewDidDisappear(animated: boolean): void;
    private animateWithDuration;
    pushViewControllerAnimated(viewController: UIViewController, animated: boolean): void;
    setViewControllersAnimated(viewControllers: NSArray<any>, animated: boolean): void;
    popViewControllerAnimated(animated: boolean): UIViewController;
    popToViewControllerAnimated(viewController: UIViewController, animated: boolean): NSArray<UIViewController>;
    traitCollectionDidChange(previousTraitCollection: UITraitCollection): void;
}
export declare function _getNativeCurve(transition: NavigationTransition): UIViewAnimationCurve;
declare class iOSFrame implements iOSFrameDefinition {
    private _controller;
    private _showNavigationBar;
    private _navBarVisibility;
    _disableNavBarAnimation: boolean;
    constructor(frame: Frame);
    get controller(): UINavigationControllerImpl;
    set controller(value: UINavigationControllerImpl);
    get showNavigationBar(): boolean;
    set showNavigationBar(value: boolean);
    get navBarVisibility(): 'auto' | 'never' | 'always';
    set navBarVisibility(value: 'auto' | 'never' | 'always');
}
export declare function setActivityCallbacks(activity: any): void;
