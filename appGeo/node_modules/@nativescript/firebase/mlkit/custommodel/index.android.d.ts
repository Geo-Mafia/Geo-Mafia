import { MLKitCustomModelOptions, MLKitCustomModelResult } from "./";
import { MLKitCustomModel as MLKitCustomModelBase } from "./custommodel-common";
export declare class MLKitCustomModel extends MLKitCustomModelBase {
    private detector;
    private onFailureListener;
    private inputOutputOptions;
    protected createDetector(): any;
    protected runDetector(imageByteBuffer: any, previewWidth: any, previewHeight: any): void;
    protected createSuccessListener(): any;
}
export declare function useCustomModel(options: MLKitCustomModelOptions): Promise<MLKitCustomModelResult>;
