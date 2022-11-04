import { Property, booleanConverter } from "@nativescript/core";
import { MLKitCameraView } from "../mlkit-cameraview";
export var ObjectDetectionCategory;
(function (ObjectDetectionCategory) {
    ObjectDetectionCategory[ObjectDetectionCategory["Unknown"] = 0] = "Unknown";
    ObjectDetectionCategory[ObjectDetectionCategory["HomeGoods"] = 1] = "HomeGoods";
    ObjectDetectionCategory[ObjectDetectionCategory["FashionGoods"] = 2] = "FashionGoods";
    ObjectDetectionCategory[ObjectDetectionCategory["Food"] = 3] = "Food";
    ObjectDetectionCategory[ObjectDetectionCategory["Places"] = 4] = "Places";
    ObjectDetectionCategory[ObjectDetectionCategory["Plants"] = 5] = "Plants";
})(ObjectDetectionCategory || (ObjectDetectionCategory = {}));
export const classifyProperty = new Property({
    name: "classify",
    defaultValue: false,
    valueConverter: booleanConverter
});
export const multipleProperty = new Property({
    name: "multiple",
    defaultValue: false,
    valueConverter: booleanConverter
});
export class MLKitObjectDetection extends MLKitCameraView {
    [classifyProperty.setNative](value) {
        this.classify = value;
    }
    [multipleProperty.setNative](value) {
        this.multiple = value;
    }
}
MLKitObjectDetection.scanResultEvent = "scanResult";
classifyProperty.register(MLKitObjectDetection);
multipleProperty.register(MLKitObjectDetection);
//# sourceMappingURL=objectdetection-common.js.map