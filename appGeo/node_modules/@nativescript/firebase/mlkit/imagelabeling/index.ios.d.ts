import { MLKitImageLabelingCloudResult, MLKitImageLabelingOnDeviceResult, MLKitImageLabelingOptions } from "./";
import { MLKitImageLabeling as MLKitImageLabelingBase } from "./imagelabeling-common";
export declare class MLKitImageLabeling extends MLKitImageLabelingBase {
    protected createDetector(): any;
    protected createSuccessListener(): any;
    protected rotateRecording(): boolean;
}
export declare function labelImageOnDevice(options: MLKitImageLabelingOptions): Promise<MLKitImageLabelingOnDeviceResult>;
export declare function labelImageCloud(options: MLKitImageLabelingOptions): Promise<MLKitImageLabelingCloudResult>;
