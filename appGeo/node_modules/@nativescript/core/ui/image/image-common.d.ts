import { Image as ImageDefinition } from '.';
import { View } from '../core/view';
import { CoreTypes } from '../../core-types';
import { ImageAsset } from '../../image-asset';
import { ImageSource } from '../../image-source';
import { Color } from '../../color';
import { Style } from '../styling/style';
import { Property, InheritedCssProperty } from '../core/properties';
export declare abstract class ImageBase extends View implements ImageDefinition {
    imageSource: ImageSource;
    src: string | ImageSource;
    isLoading: boolean;
    stretch: CoreTypes.ImageStretchType;
    loadMode: 'sync' | 'async';
    decodeWidth: CoreTypes.LengthType;
    decodeHeight: CoreTypes.LengthType;
    get tintColor(): Color;
    set tintColor(value: Color);
    disposeImageSource(): void;
    /**
     * @internal
     */
    _createImageSourceFromSrc(value: string | ImageSource | ImageAsset): void;
}
export declare const imageSourceProperty: Property<ImageBase, ImageSource>;
export declare const srcProperty: Property<ImageBase, any>;
export declare const loadModeProperty: Property<ImageBase, "sync" | "async">;
export declare const isLoadingProperty: Property<ImageBase, boolean>;
export declare const stretchProperty: Property<ImageBase, CoreTypes.ImageStretchType>;
export declare const tintColorProperty: InheritedCssProperty<Style, Color>;
export declare const decodeHeightProperty: Property<ImageBase, CoreTypes.LengthType>;
export declare const decodeWidthProperty: Property<ImageBase, CoreTypes.LengthType>;
