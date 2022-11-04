import { ActivityIndicatorBase } from './activity-indicator-common';
export * from './activity-indicator-common';
export declare class ActivityIndicator extends ActivityIndicatorBase {
    nativeViewProtected: android.widget.ProgressBar;
    createNativeView(): globalAndroid.widget.ProgressBar;
}
