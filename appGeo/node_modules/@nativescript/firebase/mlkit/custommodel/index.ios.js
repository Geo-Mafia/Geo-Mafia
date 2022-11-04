import { ImageSource, knownFolders } from "@nativescript/core";
import { getLabelsFromAppFolder, getLabelsFromFile, MLKitCustomModel as MLKitCustomModelBase } from "./custommodel-common";
export class MLKitCustomModel extends MLKitCustomModelBase {
    createDetector() {
        this.modelInterpreter = getInterpreter(this.localModelFile);
        return this.modelInterpreter;
    }
    runDetector(image, onComplete) {
        const modelExpectsWidth = this.modelInputShape[1];
        const modelExpectsHeight = this.modelInputShape[2];
        const isQuantized = this.modelInputType !== "FLOAT32";
        if (!this.inputOutputOptions) {
            this.inputOutputOptions = FIRModelInputOutputOptions.new();
            let inputType;
            const arrIn = NSMutableArray.new();
            this.modelInputShape.forEach(dim => arrIn.addObject(dim));
            inputType = isQuantized ? 3 : 1;
            this.inputOutputOptions.setInputFormatForIndexTypeDimensionsError(0, inputType, arrIn);
            const arrOut = NSMutableArray.new();
            arrOut.addObject(1);
            arrOut.addObject(this.labels.length);
            this.inputOutputOptions.setOutputFormatForIndexTypeDimensionsError(0, inputType, arrOut);
        }
        let inputData;
        if (isQuantized) {
            inputData = TNSMLKitCameraView.scaledDataWithSizeByteCountIsQuantized(image, CGSizeMake(modelExpectsWidth, modelExpectsHeight), modelExpectsWidth * modelExpectsHeight * this.modelInputShape[3] * this.modelInputShape[0], isQuantized);
        }
        else {
            inputData = TNSMLKitCameraView.getInputDataWithRowsAndColumnsAndType(image, modelExpectsWidth, modelExpectsHeight, "Float32");
        }
        const inputs = FIRModelInputs.new();
        inputs.addInputError(inputData);
        this.modelInterpreter.runWithInputsOptionsCompletion(inputs, this.inputOutputOptions, (outputs, error) => {
            if (error !== null) {
                console.log(error.localizedDescription);
            }
            else if (outputs !== null) {
                const probabilities = outputs.outputAtIndexError(0)[0];
                if (this.labels.length !== probabilities.count) {
                    console.log(`The number of labels (${this.labels.length}) is not equal to the interpretation result (${probabilities.count})!`);
                    onComplete();
                }
                else {
                    const result = {
                        result: getSortedResult(this.labels, probabilities, this.maxResults)
                    };
                    this.notify({
                        eventName: MLKitCustomModel.scanResultEvent,
                        object: this,
                        value: result
                    });
                }
            }
            onComplete();
        });
    }
    createSuccessListener() {
        return (outputs, error) => {
            if (error !== null) {
                console.log(error.localizedDescription);
            }
            else if (outputs !== null) {
                const result = {
                    result: []
                };
                console.log(">>> outputs: " + outputs);
                this.notify({
                    eventName: MLKitCustomModel.scanResultEvent,
                    object: this,
                    value: result
                });
            }
        };
    }
    rotateRecording() {
        return false;
    }
}
function getInterpreter(localModelFile) {
    if (localModelFile) {
        let localModelFilePath;
        if (localModelFile.indexOf("~/") === 0) {
            localModelFilePath = knownFolders.currentApp().path + localModelFile.substring(1);
        }
        else {
            localModelFilePath = NSBundle.mainBundle.pathForResourceOfType(localModelFile.substring(0, localModelFile.lastIndexOf(".")), localModelFile.substring(localModelFile.lastIndexOf(".") + 1));
        }
        const localModel = FIRCustomLocalModel.alloc().initWithModelPath(localModelFilePath);
        if (localModel) {
            return FIRModelInterpreter.modelInterpreterForLocalModel(localModel);
        }
        else {
            console.log("No (cloud or local) model was successfully loaded.");
        }
    }
    return null;
}
export function useCustomModel(options) {
    return new Promise((resolve, reject) => {
        try {
            const image = options.image instanceof ImageSource ? options.image.ios : options.image.imageSource.ios;
            const isQuant = options.modelInput[0].type !== "FLOAT32";
            let inputData;
            if (isQuant) {
                inputData = TNSMLKitCameraView.scaledDataWithSizeByteCountIsQuantized(image, CGSizeMake(options.modelInput[0].shape[1], options.modelInput[0].shape[2]), options.modelInput[0].shape[1] * options.modelInput[0].shape[2] * options.modelInput[0].shape[3] * options.modelInput[0].shape[0], options.modelInput[0].type !== "FLOAT32");
            }
            else {
                inputData = TNSMLKitCameraView.getInputDataWithRowsAndColumnsAndType(image, options.modelInput[0].shape[1], options.modelInput[0].shape[2], "Float32");
            }
            const inputs = FIRModelInputs.new();
            inputs.addInputError(inputData);
            const inputOptions = FIRModelInputOutputOptions.new();
            let inputType;
            options.modelInput.forEach((dimensionAndType, i) => {
                const arrIn = NSMutableArray.new();
                dimensionAndType.shape.forEach(dim => arrIn.addObject(dim));
                inputType = dimensionAndType.type === "FLOAT32" ? 1 : 3;
                inputOptions.setInputFormatForIndexTypeDimensionsError(i, inputType, arrIn);
            });
            let labels;
            if (options.labelsFile.indexOf("~/") === 0) {
                labels = getLabelsFromAppFolder(options.labelsFile);
            }
            else {
                const labelsFile = NSBundle.mainBundle.pathForResourceOfType(options.labelsFile.substring(0, options.labelsFile.lastIndexOf(".")), options.labelsFile.substring(options.labelsFile.lastIndexOf(".") + 1));
                labels = getLabelsFromFile(labelsFile);
            }
            const arrOut = NSMutableArray.new();
            arrOut.addObject(1);
            arrOut.addObject(labels.length);
            inputOptions.setOutputFormatForIndexTypeDimensionsError(0, inputType, arrOut);
            const modelInterpreter = getInterpreter(options.localModelFile);
            modelInterpreter.runWithInputsOptionsCompletion(inputs, inputOptions, (outputs, error) => {
                if (error !== null) {
                    reject(error.localizedDescription);
                }
                else if (outputs !== null) {
                    const probabilities = outputs.outputAtIndexError(0)[0];
                    if (labels.length !== probabilities.count) {
                        console.log(`The number of labels in ${options.labelsFile} (${labels.length}) is not equal to the interpretation result (${probabilities.count})!`);
                        return;
                    }
                    const result = {
                        result: getSortedResult(labels, probabilities, options.maxResults)
                    };
                    resolve(result);
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.useCustomModel: " + ex);
            reject(ex);
        }
    });
}
function getSortedResult(labels, probabilities, maxResults = 5) {
    const result = [];
    labels.forEach((text, i) => result.push({ text, confidence: probabilities.objectAtIndex(i) }));
    result.sort((a, b) => a.confidence < b.confidence ? 1 : (a.confidence === b.confidence ? 0 : -1));
    if (result.length > maxResults) {
        result.splice(maxResults);
    }
    const softmaxScale = 1.0 / 256.0;
    result.map(r => r.confidence = NSNumber.numberWithFloat(softmaxScale * r.confidence));
    return result;
}
//# sourceMappingURL=index.ios.js.map