import { MLKitCustomModelOptions, MLKitCustomModelResult } from "./";
import { MLKitCustomModel as MLKitCustomModelBase } from "./custommodel-common";
export declare class MLKitCustomModel extends MLKitCustomModelBase {
    private modelInterpreter;
    private inputOutputOptions;
    protected createDetector(): any;
    runDetector(image: UIImage, onComplete: () => void): void;
    protected createSuccessListener(): any;
    protected rotateRecording(): boolean;
}
export declare function useCustomModel(options: MLKitCustomModelOptions): Promise<MLKitCustomModelResult>;
