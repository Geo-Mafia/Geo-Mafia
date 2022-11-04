import { ImageAsset as ImageAssetDefinition, ImageAssetOptions } from '.';
import { Observable } from '../data/observable';
export declare class ImageAssetBase extends Observable implements ImageAssetDefinition {
    private _options;
    private _nativeImage;
    ios: PHAsset;
    android: string;
    constructor();
    get options(): ImageAssetOptions;
    set options(value: ImageAssetOptions);
    get nativeImage(): any;
    set nativeImage(value: any);
    getImageAsync(callback: (image: any, error: Error) => void): void;
}
export declare function getAspectSafeDimensions(sourceWidth: any, sourceHeight: any, reqWidth: any, reqHeight: any): {
    width: number;
    height: number;
};
export declare function getRequestedImageSize(src: {
    width: number;
    height: number;
}, options: ImageAssetOptions): {
    width: number;
    height: number;
};
