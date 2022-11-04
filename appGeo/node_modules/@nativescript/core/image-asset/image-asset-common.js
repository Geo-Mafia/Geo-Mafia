import { Observable } from '../data/observable';
import { Screen } from '../platform';
export class ImageAssetBase extends Observable {
    constructor() {
        super();
        this._options = { keepAspectRatio: true, autoScaleFactor: true };
    }
    get options() {
        return this._options;
    }
    set options(value) {
        this._options = value;
    }
    get nativeImage() {
        return this._nativeImage;
    }
    set nativeImage(value) {
        this._nativeImage = value;
    }
    getImageAsync(callback) {
        //
    }
}
export function getAspectSafeDimensions(sourceWidth, sourceHeight, reqWidth, reqHeight) {
    const widthCoef = sourceWidth / reqWidth;
    const heightCoef = sourceHeight / reqHeight;
    const aspectCoef = Math.min(widthCoef, heightCoef);
    return {
        width: Math.floor(sourceWidth / aspectCoef),
        height: Math.floor(sourceHeight / aspectCoef),
    };
}
export function getRequestedImageSize(src, options) {
    let reqWidth = options.width || Math.min(src.width, Screen.mainScreen.widthPixels);
    let reqHeight = options.height || Math.min(src.height, Screen.mainScreen.heightPixels);
    if (options && options.keepAspectRatio) {
        const safeAspectSize = getAspectSafeDimensions(src.width, src.height, reqWidth, reqHeight);
        reqWidth = safeAspectSize.width;
        reqHeight = safeAspectSize.height;
    }
    return {
        width: reqWidth,
        height: reqHeight,
    };
}
//# sourceMappingURL=image-asset-common.js.map