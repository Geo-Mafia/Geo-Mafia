import { Property } from "@nativescript/core";
import { MLKitCameraView } from "../mlkit-cameraview";
export const localModelResourceFolderProperty = new Property({
    name: "localModelResourceFolder",
    defaultValue: null,
});
export const confidenceThresholdProperty = new Property({
    name: "confidenceThreshold",
    defaultValue: 0.5,
});
export class MLKitAutoML extends MLKitCameraView {
    [localModelResourceFolderProperty.setNative](value) {
        this.localModelResourceFolder = value;
    }
    [confidenceThresholdProperty.setNative](value) {
        this.confidenceThreshold = parseFloat(value);
    }
}
MLKitAutoML.scanResultEvent = "scanResult";
localModelResourceFolderProperty.register(MLKitAutoML);
confidenceThresholdProperty.register(MLKitAutoML);
//# sourceMappingURL=automl-common.js.map