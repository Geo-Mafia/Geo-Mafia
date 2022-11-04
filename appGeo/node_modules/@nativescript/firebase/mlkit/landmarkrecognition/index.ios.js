import { ImageSource } from "@nativescript/core";
function getDetector(modelType, maxResults) {
    const firVision = FIRVision.vision();
    const fIRVisionCloudDetectorOptions = FIRVisionCloudDetectorOptions.alloc();
    fIRVisionCloudDetectorOptions.modelType = modelType === "latest" ? 1 : 0;
    fIRVisionCloudDetectorOptions.maxResults = maxResults || 10;
    return firVision.cloudLandmarkDetectorWithOptions(fIRVisionCloudDetectorOptions);
}
export function recognizeLandmarksCloud(options) {
    return new Promise((resolve, reject) => {
        try {
            const landmarkDetector = getDetector(options.modelType, options.maxResults);
            landmarkDetector.detectInImageCompletion(getImage(options), (landmarks, error) => {
                if (error !== null) {
                    reject(error.localizedDescription);
                }
                else if (landmarks !== null) {
                    const result = {
                        landmarks: []
                    };
                    for (let i = 0, l = landmarks.count; i < l; i++) {
                        const landmark = landmarks.objectAtIndex(i);
                        console.log(">> detected landmark: " + landmark);
                        result.landmarks.push({
                            name: landmark.landmark,
                            confidence: landmark.confidence
                        });
                    }
                    resolve(result);
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.recognizeLandmarksCloud: " + ex);
            reject(ex);
        }
    });
}
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.ios : options.image.imageSource.ios;
    return FIRVisionImage.alloc().initWithImage(image);
}
//# sourceMappingURL=index.ios.js.map