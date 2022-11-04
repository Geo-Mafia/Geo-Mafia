import { Utils, Application } from "@nativescript/core";
import { MLKitCameraView as MLKitCameraViewBase } from "./mlkit-cameraview-common";
export class MLKitCameraView extends MLKitCameraViewBase {
    disposeNativeView() {
        super.disposeNativeView();
        if (this.captureSession) {
            this.captureSession.stopRunning();
            this.captureSession = undefined;
        }
        this.captureDevice = undefined;
        this.previewLayer = undefined;
        this.cameraView = undefined;
        Application.off("orientationChanged");
    }
    createNativeView() {
        let v = super.createNativeView();
        if (this.canUseCamera()) {
            this.initView();
        }
        else {
            console.log("There's no Camera on this device :(");
        }
        return v;
    }
    canUseCamera() {
        try {
            return !!AVCaptureDeviceDiscoverySession &&
                AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo) !== null &&
                NSProcessInfo.processInfo.environment.objectForKey("SIMULATOR_DEVICE_NAME") === null;
        }
        catch (ignore) {
            return false;
        }
    }
    initView() {
        this.captureDevice = AVCaptureDeviceDiscoverySession.discoverySessionWithDeviceTypesMediaTypePosition([AVCaptureDeviceTypeBuiltInWideAngleCamera], AVMediaTypeVideo, this.preferFrontCamera ? 2 : 1).devices.firstObject;
        if (this.torchOn) {
            this.updateTorch();
        }
        this.captureSession = AVCaptureSession.new();
        this.captureSession.sessionPreset = AVCaptureSessionPreset1280x720;
        try {
            const captureDeviceInput = AVCaptureDeviceInput.deviceInputWithDeviceError(this.captureDevice);
            this.captureSession.addInput(captureDeviceInput);
        }
        catch (e) {
            console.log("Error while trying to use the camera: " + e);
            return;
        }
        this.previewLayer = AVCaptureVideoPreviewLayer.layerWithSession(this.captureSession);
        this.previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
        if (Utils.ios.isLandscape()) {
            const deviceOrientation = UIDevice.currentDevice.orientation;
            this.previewLayer.connection.videoOrientation = deviceOrientation === 3 ? 3 : 4;
        }
        else {
            this.previewLayer.connection.videoOrientation = 1;
        }
        Application.off(Application.orientationChangedEvent);
        Application.on(Application.orientationChangedEvent, this.rotateOnOrientationChange.bind(this));
        setTimeout(() => {
            if (this.ios) {
                this.ios.layer.addSublayer(this.previewLayer);
            }
            if (!this.pause) {
                this.captureSession.startRunning();
            }
            this.cameraView = TNSMLKitCameraView.alloc().initWithCaptureSession(this.captureSession);
            this.cameraView.processEveryXFrames = this.processEveryNthFrame;
            if (this.rotateRecording()) {
                this.cameraView.imageOrientation = 3;
            }
            this.cameraView.delegate = TNSMLKitCameraViewDelegateImpl.createWithOwnerResultCallbackAndOptions(new WeakRef(this), data => { }, this.preProcessImage, {});
        }, 0);
    }
    rotateOnOrientationChange(args) {
        if (this.previewLayer) {
            if (args.newValue === "landscape") {
                const deviceOrientation = UIDevice.currentDevice.orientation;
                this.previewLayer.connection.videoOrientation = deviceOrientation === 3 ? 3 : 4;
            }
            else if (args.newValue === "portrait") {
                this.previewLayer.connection.videoOrientation = 1;
            }
        }
    }
    onLayout(left, top, right, bottom) {
        super.onLayout(left, top, right, bottom);
        if (this.previewLayer && this.ios && this.canUseCamera()) {
            this.previewLayer.frame = this.ios.layer.bounds;
        }
    }
    getVisionOrientation(imageOrientation) {
        if (imageOrientation === 0) {
            return 1;
        }
        else if (imageOrientation === 1) {
            return 3;
        }
        else if (imageOrientation === 2) {
            return 8;
        }
        else if (imageOrientation === 3) {
            return 6;
        }
        else if (imageOrientation === 4) {
            return 2;
        }
        else if (imageOrientation === 5) {
            return 4;
        }
        else if (imageOrientation === 6) {
            return 5;
        }
        else if (imageOrientation === 7) {
            return 7;
        }
        else {
            return 1;
        }
    }
    updateTorch() {
        const device = this.captureDevice;
        if (device && device.hasTorch && device.lockForConfiguration()) {
            if (this.torchOn) {
                device.torchMode = 1;
                device.flashMode = 1;
            }
            else {
                device.torchMode = 0;
                device.flashMode = 0;
            }
            device.unlockForConfiguration();
        }
    }
    pauseScanning() {
        if (this.captureSession && this.captureSession.running) {
            this.captureSession.stopRunning();
        }
    }
    resumeScanning() {
        if (this.captureSession && !this.captureSession.running) {
            this.captureSession.startRunning();
        }
    }
    runDetector(image, onComplete) {
        throw new Error("No custom detector implemented, so 'runDetector' can't do its thing");
    }
}
var TNSMLKitCameraViewDelegateImpl = /** @class */ (function (_super) {
    __extends(TNSMLKitCameraViewDelegateImpl, _super);
    function TNSMLKitCameraViewDelegateImpl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.detectorBusy = false;
        return _this;
    }
    TNSMLKitCameraViewDelegateImpl.createWithOwnerResultCallbackAndOptions = function (owner, callback, preProcessImageCallback, options) {
        // defer initialisation because the framework may not be available / used
        if (TNSMLKitCameraViewDelegateImpl.ObjCProtocols.length === 0 && typeof (TNSMLKitCameraViewDelegate) !== "undefined") {
            TNSMLKitCameraViewDelegateImpl.ObjCProtocols.push(TNSMLKitCameraViewDelegate);
        }
        var delegate = TNSMLKitCameraViewDelegateImpl.new();
        delegate.owner = owner;
        delegate.options = options;
        delegate.resultCallback = callback;
        delegate.preProcessImageCallback = preProcessImageCallback;
        delegate.detector = owner.get().createDetector();
        delegate.onSuccessListener = owner.get().createSuccessListener();
        return delegate;
    };
    TNSMLKitCameraViewDelegateImpl.prototype.cameraDidOutputImage = function (image) {
        var _this = this;
        if (!image || this.detectorBusy) {
            return;
        }
        this.detectorBusy = true;
        var onComplete = function () {
            _this.detectorBusy = false;
        };
        this.owner.get().lastVisionImage = image;
        if (this.detector.detectInImageCompletion) {
            this.detector.detectInImageCompletion(this.uiImageToFIRVisionImage(image), function (result, error) {
                _this.onSuccessListener(result, error);
                onComplete();
            });
        }
        else if (this.detector.processImageCompletion) {
            this.detector.processImageCompletion(this.uiImageToFIRVisionImage(image), function (result, error) {
                _this.onSuccessListener(result, error);
                onComplete();
            });
        }
        else {
            this.owner.get().runDetector(image, onComplete);
        }
    };
    TNSMLKitCameraViewDelegateImpl.prototype.uiImageToFIRVisionImage = function (image) {
        image = this.preProcessImageCallback(image);
        var fIRVisionImage = FIRVisionImage.alloc().initWithImage(image);
        var fIRVisionImageMetadata = FIRVisionImageMetadata.new();
        fIRVisionImageMetadata.orientation = this.owner.get().getVisionOrientation(image.imageOrientation);
        fIRVisionImage.metadata = fIRVisionImageMetadata;
        return fIRVisionImage;
    };
    TNSMLKitCameraViewDelegateImpl.ObjCProtocols = [];
    return TNSMLKitCameraViewDelegateImpl;
}(NSObject));
//# sourceMappingURL=mlkit-cameraview.ios.js.map