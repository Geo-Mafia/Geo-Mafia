import { ImageBase } from './image-common';
import { ImageSource } from '../../image-source';
import { ImageAsset } from '../../image-asset';
export * from './image-common';
export declare class Image extends ImageBase {
    nativeViewProtected: org.nativescript.widgets.ImageView;
    useCache: boolean;
    createNativeView(): org.nativescript.widgets.ImageView;
    initNativeView(): void;
    disposeNativeView(): void;
    resetNativeView(): void;
    _createImageSourceFromSrc(value: string | ImageSource | ImageAsset): void;
    private _calculateKeepAspectRatio;
}
