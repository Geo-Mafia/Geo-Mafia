import { ImageAssetBase } from './image-asset-common';
export * from './image-asset-common';
export declare class ImageAsset extends ImageAssetBase {
    private _ios;
    constructor(asset: string | PHAsset | UIImage);
    get ios(): PHAsset;
    set ios(value: PHAsset);
    getImageAsync(callback: (image: any, error: any) => void): void;
    private scaleImage;
}
