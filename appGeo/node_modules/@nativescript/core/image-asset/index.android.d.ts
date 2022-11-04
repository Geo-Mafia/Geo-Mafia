import { ImageAssetBase } from './image-asset-common';
export * from './image-asset-common';
export declare class ImageAsset extends ImageAssetBase {
    private _android;
    constructor(asset: string);
    get android(): string;
    set android(value: string);
    getImageAsync(callback: (image: any, error: any) => void): void;
}
