import { Property } from "@nativescript/core";
import { MLKitCameraView } from "../mlkit-cameraview";
export const confidenceThresholdProperty = new Property({
    name: "confidenceThreshold",
    defaultValue: 0.5,
});
export class MLKitImageLabeling extends MLKitCameraView {
    [confidenceThresholdProperty.setNative](value) {
        this.confidenceThreshold = parseFloat(value);
    }
}
MLKitImageLabeling.scanResultEvent = "scanResult";
confidenceThresholdProperty.register(MLKitImageLabeling);
//# sourceMappingURL=imagelabeling-common.js.map