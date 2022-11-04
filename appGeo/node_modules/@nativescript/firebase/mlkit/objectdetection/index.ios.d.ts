import { MLKitObjectDetectionOptions, MLKitObjectDetectionResult } from "./";
import { MLKitObjectDetection as MLKitObjectDetectionBase } from "./objectdetection-common";
export declare class MLKitObjectDetection extends MLKitObjectDetectionBase {
    protected createDetector(): any;
    protected createSuccessListener(): any;
    protected rotateRecording(): boolean;
}
export declare function detectObjects(options: MLKitObjectDetectionOptions): Promise<MLKitObjectDetectionResult>;
