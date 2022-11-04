import { ImageBase, stretchProperty, imageSourceProperty, srcProperty, tintColorProperty } from './image-common';
import { isDataURI, isFontIconURI, isFileOrResourcePath, RESOURCE_PREFIX } from '../../utils';
import { ImageAsset } from '../../image-asset';
import { Length } from '../styling/style-properties';
import { knownFolders } from '../../file-system';
import { Screen } from '../../platform';
export * from './image-common';
const FILE_PREFIX = 'file:///';
const ASYNC = 'async';
let AndroidImageView;
let ImageLoadedListener;
function initializeImageLoadedListener() {
    if (ImageLoadedListener) {
        return;
    }
    var ImageLoadedListenerImpl = /** @class */ (function (_super) {
    __extends(ImageLoadedListenerImpl, _super);
    function ImageLoadedListenerImpl(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    ImageLoadedListenerImpl.prototype.onImageLoaded = function (success) {
        var owner = this.owner;
        if (owner) {
            owner.isLoading = false;
        }
    };
    ImageLoadedListenerImpl = __decorate([
        Interfaces([org.nativescript.widgets.image.Worker.OnImageLoadedListener])
    ], ImageLoadedListenerImpl);
    return ImageLoadedListenerImpl;
}(java.lang.Object));
    ImageLoadedListener = ImageLoadedListenerImpl;
}
export class Image extends ImageBase {
    constructor() {
        super(...arguments);
        this.useCache = true;
    }
    createNativeView() {
        if (!AndroidImageView) {
            AndroidImageView = org.nativescript.widgets.ImageView;
        }
        return new AndroidImageView(this._context);
    }
    initNativeView() {
        super.initNativeView();
        initializeImageLoadedListener();
        const nativeView = this.nativeViewProtected;
        const listener = new ImageLoadedListener(this);
        nativeView.setImageLoadedListener(listener);
        nativeView.listener = listener;
    }
    disposeNativeView() {
        this.nativeViewProtected.listener.owner = null;
        super.disposeNativeView();
    }
    resetNativeView() {
        super.resetNativeView();
        this.nativeViewProtected.setImageMatrix(new android.graphics.Matrix());
    }
    _createImageSourceFromSrc(value) {
        const imageView = this.nativeViewProtected;
        if (!imageView) {
            return;
        }
        if (!value) {
            imageView.setUri(null, 0, 0, false, false, true);
            return;
        }
        let decodeWidth = Math.min(Length.toDevicePixels(this.decodeWidth, 0), Screen.mainScreen.widthPixels);
        let decodeHeight = Math.min(Length.toDevicePixels(this.decodeHeight, 0), Screen.mainScreen.heightPixels);
        let keepAspectRatio = this._calculateKeepAspectRatio();
        if (value instanceof ImageAsset) {
            if (value.options) {
                decodeWidth = value.options.width || decodeWidth;
                decodeHeight = value.options.height || decodeHeight;
                keepAspectRatio = !!value.options.keepAspectRatio;
            }
            // handle assets as file paths natively
            value = value.android;
        }
        const async = this.loadMode === ASYNC;
        if (typeof value === 'string' || value instanceof String) {
            value = value.trim();
            this.isLoading = true;
            if (isFontIconURI(value) || isDataURI(value)) {
                // TODO: Check with runtime what should we do in case of base64 string.
                super._createImageSourceFromSrc(value);
            }
            else if (isFileOrResourcePath(value)) {
                if (value.indexOf(RESOURCE_PREFIX) === 0) {
                    imageView.setUri(value, decodeWidth, decodeHeight, keepAspectRatio, this.useCache, async);
                }
                else {
                    let fileName = value;
                    if (fileName.indexOf('~/') === 0) {
                        fileName = knownFolders.currentApp().path + '/' + fileName.replace('~/', '');
                    }
                    imageView.setUri(FILE_PREFIX + fileName, decodeWidth, decodeHeight, keepAspectRatio, this.useCache, async);
                }
            }
            else {
                // For backwards compatibility http always use async loading.
                imageView.setUri(value, decodeWidth, decodeHeight, keepAspectRatio, this.useCache, true);
            }
        }
        else {
            super._createImageSourceFromSrc(value);
        }
    }
    _calculateKeepAspectRatio() {
        return this.stretch === 'fill' ? false : true;
    }
    [stretchProperty.getDefault]() {
        return 'aspectFit';
    }
    [stretchProperty.setNative](value) {
        switch (value) {
            case 'aspectFit':
                this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.FIT_CENTER);
                break;
            case 'aspectFill':
                this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
                break;
            case 'fill':
                this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.FIT_XY);
                break;
            case 'none':
            default:
                this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.MATRIX);
                break;
        }
    }
    [tintColorProperty.getDefault]() {
        return undefined;
    }
    [tintColorProperty.setNative](value) {
        if (value === undefined) {
            this.nativeViewProtected.clearColorFilter();
        }
        else {
            this.nativeViewProtected.setColorFilter(value.android);
        }
    }
    [imageSourceProperty.getDefault]() {
        return undefined;
    }
    [imageSourceProperty.setNative](value) {
        const nativeView = this.nativeViewProtected;
        if (value && value.android) {
            const rotation = value.rotationAngle ? value.rotationAngle : 0;
            nativeView.setRotationAngle(rotation);
            nativeView.setImageBitmap(value.android);
        }
        else {
            nativeView.setRotationAngle(0);
            nativeView.setImageBitmap(null);
        }
    }
    [srcProperty.getDefault]() {
        return undefined;
    }
    [srcProperty.setNative](value) {
        this._createImageSourceFromSrc(value);
    }
}
//# sourceMappingURL=index.android.js.map