import { ProgressBase } from './progress-common';
export * from './progress-common';
export declare class Progress extends ProgressBase {
    nativeViewProtected: android.widget.ProgressBar;
    createNativeView(): globalAndroid.widget.ProgressBar;
}
