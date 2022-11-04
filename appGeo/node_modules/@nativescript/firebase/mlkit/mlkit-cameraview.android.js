import { Application, AndroidApplication, Utils } from "@nativescript/core";
import { MLKitCameraView as MLKitCameraViewBase } from "./mlkit-cameraview-common";
const ActivityCompatClass = useAndroidX() ? global.androidx.core.app.ActivityCompat : android.support.v4.app.ActivityCompat;
const ContentPackageName = useAndroidX() ? global.androidx.core.content : android.support.v4.content;
const CAMERA_PERMISSION_REQUEST_CODE = 502;
class SizePair {
}
function useAndroidX() {
    return global.androidx && global.androidx.appcompat;
}
export class MLKitCameraView extends MLKitCameraViewBase {
    constructor() {
        super(...arguments);
        this.bytesToByteBuffer = new Map();
        this.pendingFrameData = null;
    }
    disposeNativeView() {
        super.disposeNativeView();
        this.surfaceView = null;
        if (this.camera != null) {
            Application.off("orientationChanged");
            this.camera.stopPreview();
            this.camera.setPreviewCallbackWithBuffer(null);
            try {
                this.camera.setPreviewDisplay(null);
            }
            catch (e) {
                console.log("Error cleaning up the ML Kit camera (you can probably ignore this): " + e);
            }
            this.camera.release();
            this.camera = null;
        }
        this.bytesToByteBuffer.clear();
        if (this.detector) {
            this.detector.close();
            this.detector = undefined;
        }
        this.lastVisionImage = null;
        this.pendingFrameData = null;
    }
    createNativeView() {
        let nativeView = super.createNativeView();
        if (this.hasCamera()) {
            if (this.wasCameraPermissionGranted()) {
                this.initView(nativeView);
            }
            else {
                const permissionCb = (args) => {
                    if (args.requestCode === CAMERA_PERMISSION_REQUEST_CODE) {
                        Application.android.off(AndroidApplication.activityRequestPermissionsEvent, permissionCb);
                        for (let i = 0; i < args.permissions.length; i++) {
                            if (args.grantResults[i] === android.content.pm.PackageManager.PERMISSION_DENIED) {
                                console.log("Camera permission denied");
                                return;
                            }
                        }
                        this.initView(nativeView);
                    }
                };
                Application.android.on(AndroidApplication.activityRequestPermissionsEvent, permissionCb);
                ActivityCompatClass.requestPermissions(Application.android.foregroundActivity || Application.android.startActivity, [android.Manifest.permission.CAMERA], CAMERA_PERMISSION_REQUEST_CODE);
            }
        }
        else {
            console.log("There's no Camera on this device :(");
        }
        return nativeView;
    }
    initNativeView() {
        super.initNativeView();
        Application.on("resume", arg => this.runCamera());
    }
    hasCamera() {
        return !!Utils.android
            .getApplicationContext()
            .getPackageManager()
            .hasSystemFeature("android.hardware.camera");
    }
    wasCameraPermissionGranted() {
        let hasPermission = android.os.Build.VERSION.SDK_INT < 23;
        if (!hasPermission) {
            hasPermission = android.content.pm.PackageManager.PERMISSION_GRANTED ===
                ContentPackageName.ContextCompat.checkSelfPermission(Utils.android.getApplicationContext(), android.Manifest.permission.CAMERA);
        }
        return hasPermission;
    }
    initView(nativeView) {
        this.surfaceView = new android.view.SurfaceView(Utils.android.getApplicationContext());
        nativeView.addView(this.surfaceView);
        this.runCamera();
    }
    runCamera() {
        setTimeout(() => {
            if (!this.surfaceView) {
                return;
            }
            try {
                const surfaceHolder = this.surfaceView.getHolder();
                const cameraFacingRequested = this.preferFrontCamera ? android.hardware.Camera.CameraInfo.CAMERA_FACING_FRONT : android.hardware.Camera.CameraInfo.CAMERA_FACING_BACK;
                const cameraInfo = new android.hardware.Camera.CameraInfo();
                let requestedCameraId = android.hardware.Camera.CameraInfo.CAMERA_FACING_BACK;
                for (let i = 0; i < android.hardware.Camera.getNumberOfCameras(); ++i) {
                    android.hardware.Camera.getCameraInfo(i, cameraInfo);
                    if (cameraInfo.facing === cameraFacingRequested) {
                        requestedCameraId = i;
                        break;
                    }
                }
                this.camera = android.hardware.Camera.open(requestedCameraId);
                let sizePair = this.selectSizePair(this.camera, 1400, 1200);
                if (!sizePair) {
                    console.log("Could not find suitable preview size.");
                    return;
                }
                const pictureSize = sizePair.pictureSize;
                const previewSize = sizePair.previewSize;
                const parameters = this.camera.getParameters();
                if (pictureSize) {
                    parameters.setPictureSize(pictureSize.width, pictureSize.height);
                }
                parameters.setPreviewSize(previewSize.width, previewSize.height);
                parameters.setPreviewFormat(android.graphics.ImageFormat.NV21);
                Application.off("orientationChanged");
                Application.on("orientationChanged", () => {
                    this.setRotation(this.camera, parameters, requestedCameraId);
                    setTimeout(() => {
                        this.fixStretch(previewSize);
                        this.setMetadata(previewSize);
                    }, 700);
                });
                this.setRotation(this.camera, parameters, requestedCameraId);
                this.fixStretch(previewSize);
                if (parameters.getSupportedFocusModes().contains(android.hardware.Camera.Parameters.FOCUS_MODE_CONTINUOUS_VIDEO)) {
                    parameters.setFocusMode(android.hardware.Camera.Parameters.FOCUS_MODE_CONTINUOUS_VIDEO);
                }
                if (this.torchOn) {
                    if (parameters.getSupportedFlashModes() && parameters.getSupportedFlashModes().contains(android.hardware.Camera.Parameters.FLASH_MODE_TORCH)) {
                        parameters.setFlashMode(android.hardware.Camera.Parameters.FLASH_MODE_TORCH);
                    }
                }
                this.camera.setParameters(parameters);
                this.detector = this.createDetector();
                const onSuccessListener = this.createSuccessListener();
                const onFailureListener = this.createFailureListener();
                this.setMetadata(previewSize);
                let throttle = 0;
                this.camera.setPreviewCallbackWithBuffer(new android.hardware.Camera.PreviewCallback({
                    onPreviewFrame: (byteArray, camera) => {
                        if (this.pendingFrameData !== null) {
                            camera.addCallbackBuffer(this.pendingFrameData.array());
                            this.pendingFrameData = null;
                        }
                        if (!this.bytesToByteBuffer.has(byteArray)) {
                            console.log("Skipping frame");
                            return;
                        }
                        byteArray = this.preProcessImage(byteArray);
                        this.pendingFrameData = this.bytesToByteBuffer.get(byteArray);
                        if (throttle++ % this.processEveryNthFrame !== 0) {
                            return;
                        }
                        let data = this.pendingFrameData;
                        if (this.detector.processImage) {
                            this.lastVisionImage = com.google.firebase.ml.vision.common.FirebaseVisionImage.fromByteBuffer(data, this.metadata);
                            this.detector
                                .processImage(this.lastVisionImage)
                                .addOnSuccessListener(onSuccessListener)
                                .addOnFailureListener(onFailureListener);
                        }
                        else if (this.detector.detectInImage) {
                            this.lastVisionImage = com.google.firebase.ml.vision.common.FirebaseVisionImage.fromByteBuffer(data, this.metadata);
                            this.detector
                                .detectInImage(this.lastVisionImage)
                                .addOnSuccessListener(onSuccessListener)
                                .addOnFailureListener(onFailureListener);
                        }
                        else {
                            this.runDetector(data, previewSize.width, previewSize.height);
                        }
                    }
                }));
                this.camera.addCallbackBuffer(this.createPreviewBuffer(previewSize));
                this.camera.addCallbackBuffer(this.createPreviewBuffer(previewSize));
                this.camera.addCallbackBuffer(this.createPreviewBuffer(previewSize));
                this.camera.addCallbackBuffer(this.createPreviewBuffer(previewSize));
                this.camera.setPreviewDisplay(surfaceHolder);
                if (!this.pause) {
                    this.camera.startPreview();
                }
            }
            catch (e) {
                console.log("Error in Firebase MLKit's runCamera function: " + e);
            }
        }, 500);
    }
    setMetadata(previewSize) {
        this.metadata =
            new com.google.firebase.ml.vision.common.FirebaseVisionImageMetadata.Builder()
                .setFormat(com.google.firebase.ml.vision.common.FirebaseVisionImageMetadata.IMAGE_FORMAT_NV21)
                .setWidth(previewSize.width)
                .setHeight(previewSize.height)
                .setRotation(this.rotation)
                .build();
    }
    fixStretch(previewSize) {
        let measuredWidth = this.surfaceView.getMeasuredWidth();
        let measuredHeight = this.surfaceView.getMeasuredHeight();
        let scale = previewSize.width / previewSize.height;
        let invertedScale = previewSize.height / previewSize.width;
        let measuredScale = measuredWidth / measuredHeight;
        let scaleX = 1, scaleY = 1;
        if (this.rotation == 1 || this.rotation == 3) {
            if (measuredScale <= scale) {
                scaleY = (measuredWidth * scale) / measuredHeight;
            }
            else {
                scaleX = (measuredHeight * scale) / measuredWidth;
            }
        }
        else {
            if (measuredScale >= invertedScale) {
                scaleY = (measuredWidth * invertedScale) / measuredHeight;
            }
            else {
                scaleX = (measuredHeight * invertedScale) / measuredWidth;
            }
        }
        const correction = scaleX / scaleY > 1 ? scaleX / scaleY : 1;
        this.surfaceView.setScaleX(scaleX * correction);
        this.surfaceView.setScaleY(scaleY * correction);
    }
    updateTorch() {
        if (this.camera) {
            const parameters = this.camera.getParameters();
            parameters.setFlashMode(this.torchOn ? android.hardware.Camera.Parameters.FLASH_MODE_TORCH : android.hardware.Camera.Parameters.FLASH_MODE_OFF);
            this.camera.setParameters(parameters);
        }
    }
    pauseScanning() {
        if (this.camera != null) {
            this.camera.stopPreview();
        }
    }
    resumeScanning() {
        this.runCamera();
    }
    runDetector(imageByteBuffer, width, height) {
        throw new Error("No custom detector implemented for detector " + this.detector + ", so 'runDetector' can't do its thing");
    }
    createFailureListener() {
        return new com.google.android.gms.tasks.OnFailureListener({
            onFailure: exception => console.log(exception.getMessage())
        });
    }
    generateValidPreviewSizeList(camera) {
        let parameters = camera.getParameters();
        let supportedPreviewSizes = parameters.getSupportedPreviewSizes();
        let supportedPictureSizes = parameters.getSupportedPictureSizes();
        let validPreviewSizes = [];
        for (let i = 0; i < supportedPreviewSizes.size(); i++) {
            let previewSize = supportedPreviewSizes.get(i);
            let previewAspectRatio = previewSize.width / previewSize.height;
            for (let j = 0; j < supportedPictureSizes.size(); j++) {
                let pictureSize = supportedPictureSizes.get(j);
                let pictureAspectRatio = pictureSize.width / pictureSize.height;
                if (Math.abs(previewAspectRatio - pictureAspectRatio) < 0.01) {
                    validPreviewSizes.push({ previewSize: previewSize, pictureSize: pictureSize });
                    break;
                }
            }
        }
        if (validPreviewSizes.length === 0) {
            console.log("No preview sizes have a corresponding same-aspect-ratio picture size");
            for (let i = 0; i < supportedPreviewSizes.size(); i++) {
                let previewSize = supportedPreviewSizes.get(i);
                validPreviewSizes.push({ previewSize: previewSize, pictureSize: null });
            }
        }
        return validPreviewSizes;
    }
    selectSizePair(camera, desiredWidth, desiredHeight) {
        const validPreviewSizes = this.generateValidPreviewSizeList(camera);
        let selectedPair = null;
        let minDiff = java.lang.Integer.MAX_VALUE;
        for (let i = 0; i < validPreviewSizes.length; i++) {
            const sizePair = validPreviewSizes[i];
            let size = sizePair.previewSize;
            let diff = Math.abs(size.width - desiredWidth) + Math.abs(size.height - desiredHeight);
            if (diff < minDiff) {
                selectedPair = sizePair;
                minDiff = diff;
            }
        }
        return selectedPair;
    }
    createPreviewBuffer(previewSize) {
        let bitsPerPixel = android.graphics.ImageFormat.getBitsPerPixel(android.graphics.ImageFormat.NV21);
        let sizeInBits = previewSize.height * previewSize.width * bitsPerPixel;
        let bufferSize = Math.ceil(sizeInBits / 8.0) + 1;
        let byteArray = Array.create('byte', bufferSize);
        let buffer = java.nio.ByteBuffer.wrap(byteArray);
        if (!buffer.hasArray() || (buffer.array() !== byteArray)) {
            console.log("Failed to create valid buffer for camera source.");
        }
        else {
            this.bytesToByteBuffer.set(byteArray, buffer);
            return byteArray;
        }
    }
    setRotation(camera, parameters, cameraId) {
        let windowManager = (Application.android.foregroundActivity || Application.android.startActivity).getSystemService(android.content.Context.WINDOW_SERVICE);
        let degrees = 0;
        const deviceRotation = windowManager.getDefaultDisplay().getRotation();
        switch (deviceRotation) {
            case android.view.Surface.ROTATION_0:
                degrees = 0;
                break;
            case android.view.Surface.ROTATION_90:
                degrees = 90;
                break;
            case android.view.Surface.ROTATION_180:
                degrees = 180;
                break;
            case android.view.Surface.ROTATION_270:
                degrees = 270;
                break;
            default:
                console.log("Bad rotation value: " + deviceRotation);
        }
        const cameraInfo = new android.hardware.Camera.CameraInfo();
        android.hardware.Camera.getCameraInfo(cameraId, cameraInfo);
        let angle;
        let displayAngle;
        if (cameraInfo.facing === android.hardware.Camera.CameraInfo.CAMERA_FACING_FRONT) {
            angle = (cameraInfo.orientation + degrees) % 360;
            displayAngle = (360 - angle) % 360;
        }
        else {
            angle = (cameraInfo.orientation - degrees + 360) % 360;
            displayAngle = angle;
        }
        this.rotation = angle / 90;
        camera.setDisplayOrientation(displayAngle);
        parameters.setRotation(angle);
    }
}
//# sourceMappingURL=mlkit-cameraview.android.js.map