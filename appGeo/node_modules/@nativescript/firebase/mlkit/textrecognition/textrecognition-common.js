import { Property, booleanConverter } from "@nativescript/core";
import { MLKitCameraView } from "../mlkit-cameraview";
export const reportDuplicatesProperty = new Property({
    name: "reportDuplicates",
    defaultValue: false,
    valueConverter: booleanConverter
});
export class MLKitTextRecognition extends MLKitCameraView {
    [reportDuplicatesProperty.setNative](value) {
        this.reportDuplicates = value;
    }
}
MLKitTextRecognition.scanResultEvent = "scanResult";
reportDuplicatesProperty.register(MLKitTextRecognition);
//# sourceMappingURL=textrecognition-common.js.map