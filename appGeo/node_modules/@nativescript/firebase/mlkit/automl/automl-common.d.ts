import { Property } from "@nativescript/core";
import { MLKitCameraView } from "../mlkit-cameraview";
export declare const localModelResourceFolderProperty: any;
export declare const confidenceThresholdProperty: Property<MLKitAutoML, number>;
export declare abstract class MLKitAutoML extends MLKitCameraView {
    static scanResultEvent: string;
    protected localModelResourceFolder: string;
    protected confidenceThreshold: number;
}
