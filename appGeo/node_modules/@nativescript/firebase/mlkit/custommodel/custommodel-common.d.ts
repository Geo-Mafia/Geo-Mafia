import { Property } from "@nativescript/core";
import { MLKitCameraView } from "../mlkit-cameraview";
import { MLKitCustomModelType } from "./index";
export declare const localModelFileProperty: any;
export declare const labelsFileProperty: Property<MLKitCustomModel, string>;
export declare const modelInputShapeProperty: Property<MLKitCustomModel, string>;
export declare const modelInputTypeProperty: Property<MLKitCustomModel, string>;
export declare const maxResultsProperty: Property<MLKitCustomModel, number>;
export declare abstract class MLKitCustomModel extends MLKitCameraView {
    static scanResultEvent: string;
    protected localModelFile: string;
    protected labelsFile: string;
    protected maxResults: number;
    protected modelInputShape: Array<number>;
    protected modelInputType: MLKitCustomModelType;
    protected onSuccessListener: any;
    protected detectorBusy: boolean;
    protected labels: Array<string>;
}
export declare function getLabelsFromAppFolder(labelsFile: string): Array<string>;
export declare function getLabelsFromFile(labelsFile: string): Array<string>;
