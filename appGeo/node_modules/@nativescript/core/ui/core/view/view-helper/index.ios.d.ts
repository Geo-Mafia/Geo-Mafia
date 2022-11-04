import { View } from '..';
export * from './view-helper-common';
declare class UILayoutViewController extends UIViewController {
    owner: WeakRef<View>;
    static initWithOwner(owner: WeakRef<View>): UILayoutViewController;
    viewDidLoad(): void;
    viewWillLayoutSubviews(): void;
    viewDidLayoutSubviews(): void;
    viewWillAppear(animated: boolean): void;
    viewDidDisappear(animated: boolean): void;
    traitCollectionDidChange(previousTraitCollection: UITraitCollection): void;
}
declare class UIAdaptivePresentationControllerDelegateImp extends NSObject implements UIAdaptivePresentationControllerDelegate {
    static ObjCProtocols: {
        prototype: UIAdaptivePresentationControllerDelegate;
    }[];
    private owner;
    private closedCallback;
    static initWithOwnerAndCallback(owner: WeakRef<View>, whenClosedCallback: Function): UIAdaptivePresentationControllerDelegateImp;
    presentationControllerDidDismiss(presentationController: UIPresentationController): void;
}
declare class UIPopoverPresentationControllerDelegateImp extends NSObject implements UIPopoverPresentationControllerDelegate {
    static ObjCProtocols: {
        prototype: UIPopoverPresentationControllerDelegate;
    }[];
    private owner;
    private closedCallback;
    static initWithOwnerAndCallback(owner: WeakRef<View>, whenClosedCallback: Function): UIPopoverPresentationControllerDelegateImp;
    popoverPresentationControllerDidDismissPopover(popoverPresentationController: UIPopoverPresentationController): void;
}
export declare class IOSHelper {
    static traitCollectionColorAppearanceChangedEvent: string;
    static UILayoutViewController: typeof UILayoutViewController;
    static UIAdaptivePresentationControllerDelegateImp: typeof UIAdaptivePresentationControllerDelegateImp;
    static UIPopoverPresentationControllerDelegateImp: typeof UIPopoverPresentationControllerDelegateImp;
    static getParentWithViewController(view: View): View;
    static updateAutoAdjustScrollInsets(controller: UIViewController, owner: View): void;
    static updateConstraints(controller: UIViewController, owner: View): void;
    static initLayoutGuide(controller: UIViewController): UILayoutGuide;
    static layoutView(controller: UIViewController, owner: View): void;
    static getPositionFromFrame(frame: CGRect): {
        left: any;
        top: any;
        right: any;
        bottom: any;
    };
    static getFrameFromPosition(position: {
        left: any;
        top: any;
        right: any;
        bottom: any;
    }, insets?: {
        left: any;
        top: any;
        right: any;
        bottom: any;
    }): CGRect;
    static shrinkToSafeArea(view: View, frame: CGRect): CGRect;
    static expandBeyondSafeArea(view: View, frame: CGRect): CGRect;
    static getAvailableSpaceFromParent(view: View, frame: CGRect): {
        safeArea: CGRect;
        fullscreen: CGRect;
        inWindow: CGRect;
    };
}
