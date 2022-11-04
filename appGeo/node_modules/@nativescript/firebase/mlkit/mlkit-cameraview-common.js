import { ContentView, Property, booleanConverter } from "@nativescript/core";
export const processEveryNthFrameProperty = new Property({
    name: "processEveryNthFrame",
    defaultValue: 10,
});
export const preferFrontCameraProperty = new Property({
    name: "preferFrontCamera",
    defaultValue: false,
    valueConverter: booleanConverter
});
export const torchOnProperty = new Property({
    name: "torchOn",
    defaultValue: false,
    valueConverter: booleanConverter
});
export const pauseProperty = new Property({
    name: "pause",
    defaultValue: false,
    valueConverter: booleanConverter
});
export class MLKitCameraView extends ContentView {
    [processEveryNthFrameProperty.setNative](value) {
        this.processEveryNthFrame = value;
    }
    [preferFrontCameraProperty.setNative](value) {
        this.preferFrontCamera = value;
    }
    [torchOnProperty.setNative](value) {
        this.torchOn = value;
        this.updateTorch();
    }
    [pauseProperty.setNative](value) {
        this.pause = value;
        this.pause ? this.pauseScanning() : this.resumeScanning();
    }
    updateTorch() {
    }
    pauseScanning() {
    }
    resumeScanning() {
    }
    preProcessImage(image) {
        return image;
    }
}
MLKitCameraView.scanResultEvent = "scanResult";
processEveryNthFrameProperty.register(MLKitCameraView);
preferFrontCameraProperty.register(MLKitCameraView);
torchOnProperty.register(MLKitCameraView);
pauseProperty.register(MLKitCameraView);
//# sourceMappingURL=mlkit-cameraview-common.js.map