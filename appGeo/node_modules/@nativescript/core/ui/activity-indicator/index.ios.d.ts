import { ActivityIndicatorBase } from './activity-indicator-common';
export * from './activity-indicator-common';
export declare class ActivityIndicator extends ActivityIndicatorBase {
    nativeViewProtected: UIActivityIndicatorView;
    private _activityIndicatorViewStyle;
    createNativeView(): UIActivityIndicatorView;
    get ios(): UIActivityIndicatorView;
}
