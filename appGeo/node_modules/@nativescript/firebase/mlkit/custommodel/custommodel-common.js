import { knownFolders, File, Property } from "@nativescript/core";
import { MLKitCameraView } from "../mlkit-cameraview";
export const localModelFileProperty = new Property({
    name: "localModelFile",
    defaultValue: null,
});
export const labelsFileProperty = new Property({
    name: "labelsFile",
    defaultValue: null,
});
export const modelInputShapeProperty = new Property({
    name: "modelInputShape",
    defaultValue: null,
});
export const modelInputTypeProperty = new Property({
    name: "modelInputType",
    defaultValue: null,
});
export const maxResultsProperty = new Property({
    name: "maxResults",
    defaultValue: 5
});
export class MLKitCustomModel extends MLKitCameraView {
    [localModelFileProperty.setNative](value) {
        this.localModelFile = value;
    }
    [labelsFileProperty.setNative](value) {
        this.labelsFile = value;
        if (value.indexOf("~/") === 0) {
            this.labels = getLabelsFromAppFolder(value);
        }
        else {
            console.log("For the 'labelsFile' property, use the ~/ prefix for now..");
            return;
        }
    }
    [maxResultsProperty.setNative](value) {
        this.maxResults = parseInt(value);
    }
    [modelInputShapeProperty.setNative](value) {
        if ((typeof value) === "string") {
            this.modelInputShape = value.split(",").map(v => parseInt(v.trim()));
        }
    }
    [modelInputTypeProperty.setNative](value) {
        this.modelInputType = value;
    }
}
MLKitCustomModel.scanResultEvent = "scanResult";
localModelFileProperty.register(MLKitCustomModel);
labelsFileProperty.register(MLKitCustomModel);
maxResultsProperty.register(MLKitCustomModel);
modelInputShapeProperty.register(MLKitCustomModel);
modelInputTypeProperty.register(MLKitCustomModel);
export function getLabelsFromAppFolder(labelsFile) {
    const labelsPath = knownFolders.currentApp().path + labelsFile.substring(1);
    return getLabelsFromFile(labelsPath);
}
export function getLabelsFromFile(labelsFile) {
    const fileContents = File.fromPath(labelsFile).readTextSync();
    const lines = fileContents.split("\n");
    while (lines[lines.length - 1].trim() === "") {
        lines.pop();
    }
    return lines;
}
//# sourceMappingURL=custommodel-common.js.map