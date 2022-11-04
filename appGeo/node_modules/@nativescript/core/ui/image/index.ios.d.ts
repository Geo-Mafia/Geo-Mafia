import { ImageBase } from './image-common';
export * from './image-common';
export declare class Image extends ImageBase {
    nativeViewProtected: UIImageView;
    private _imageSourceAffectsLayout;
    private _templateImageWasCreated;
    createNativeView(): UIImageView;
    initNativeView(): void;
    disposeImageSource(): void;
    disposeNativeView(): void;
    private setTintColor;
    _setNativeImage(nativeImage: UIImage): void;
    _setNativeClipToBounds(): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    private static computeScaleFactor;
}
