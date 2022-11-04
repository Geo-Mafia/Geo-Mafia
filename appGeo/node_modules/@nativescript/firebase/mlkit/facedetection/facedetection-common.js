import { Property, booleanConverter, makeParser, makeValidator } from "@nativescript/core";
import { MLKitCameraView } from "../mlkit-cameraview";
export const minimumFaceSizeProperty = new Property({
    name: "minimumFaceSize",
    defaultValue: 0.1
});
export const enableFaceTrackingProperty = new Property({
    name: "enableFaceTracking",
    defaultValue: false,
    valueConverter: booleanConverter
});
const detectionModeConverter = makeParser(makeValidator("accurate", "fast"));
export const detectionModeProperty = new Property({
    name: "detectionMode",
    defaultValue: "fast",
    valueConverter: detectionModeConverter
});
export class MLKitFaceDetection extends MLKitCameraView {
    [minimumFaceSizeProperty.setNative](value) {
        this.minimumFaceSize = value;
    }
    [enableFaceTrackingProperty.setNative](value) {
        this.enableFaceTracking = value;
    }
    [detectionModeProperty.setNative](value) {
        this.detectionMode = value;
    }
}
MLKitFaceDetection.scanResultEvent = "scanResult";
minimumFaceSizeProperty.register(MLKitFaceDetection);
enableFaceTrackingProperty.register(MLKitFaceDetection);
detectionModeProperty.register(MLKitFaceDetection);
//# sourceMappingURL=facedetection-common.js.map