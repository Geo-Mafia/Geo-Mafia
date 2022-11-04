import { firebaseUtils } from "../utils";
export function startTrace(name) {
    return new FirebaseTrace(FIRPerformance.startTraceWithName(name));
}
export function startHttpMetric(url, method) {
    const httpMetric = FIRHTTPMetric.alloc().initWithURLHTTPMethod(NSURL.URLWithString(url), getHttpMethodFromString(method));
    httpMetric.start();
    return new FirebaseHttpMetric(httpMetric);
}
export class FirebaseTrace {
    constructor(nativeTrace) {
        this.nativeTrace = nativeTrace;
    }
    setValue(attribute, value) {
        this.nativeTrace.setValueForAttribute(value, attribute);
    }
    getValue(attribute) {
        return this.nativeTrace.valueForAttribute(attribute);
    }
    getAttributes() {
        return firebaseUtils.toJsObject(this.nativeTrace.attributes);
    }
    removeAttribute(attribute) {
        this.nativeTrace.removeAttribute(attribute);
    }
    incrementMetric(metric, by) {
        this.nativeTrace.incrementMetricByInt(metric, by);
    }
    stop() {
        this.nativeTrace.stop();
    }
}
export class FirebaseHttpMetric {
    constructor(nativeHttpMetric) {
        this.nativeHttpMetric = nativeHttpMetric;
    }
    setRequestPayloadSize(size) {
        this.nativeHttpMetric.requestPayloadSize = size;
    }
    setHttpResponseCode(responseCode) {
        this.nativeHttpMetric.responseCode = responseCode;
    }
    stop() {
        this.nativeHttpMetric.stop();
    }
}
function getHttpMethodFromString(method) {
    switch (method) {
        case 'GET':
            return 0;
        case 'PUT':
            return 1;
        case 'POST':
            return 2;
        case 'DELETE':
            return 3;
        case 'HEAD':
            return 4;
        case 'PATCH':
            return 5;
        case 'OPTIONS':
            return 6;
        default:
            return null;
    }
}
//# sourceMappingURL=performance.ios.js.map