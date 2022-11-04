import { ProgressBase } from './progress-common';
export * from './progress-common';
export declare class Progress extends ProgressBase {
    nativeViewProtected: UIProgressView;
    createNativeView(): UIProgressView;
    get ios(): UIProgressView;
}
