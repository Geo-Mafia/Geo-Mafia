export function startTrace(name) {
    const trace = com.google.firebase.perf.FirebasePerformance.getInstance().newTrace(name);
    trace.start();
    return new FirebaseTrace(trace);
}
export function startHttpMetric(url, method) {
    const httpMetric = com.google.firebase.perf.FirebasePerformance.getInstance().newHttpMetric(url, method);
    httpMetric.start();
    return new FirebaseHttpMetric(httpMetric);
}
export class FirebaseTrace {
    constructor(nativeTrace) {
        this.nativeTrace = nativeTrace;
    }
    setValue(attribute, value) {
        this.nativeTrace.putAttribute(attribute, value);
    }
    getValue(attribute) {
        return this.nativeTrace.getAttribute(attribute);
    }
    getAttributes() {
        const attributes = this.nativeTrace.getAttributes();
        const node = {};
        const iterator = attributes.entrySet().iterator();
        while (iterator.hasNext()) {
            const item = iterator.next();
            node[item.getKey()] = item.getValue();
        }
        return node;
    }
    removeAttribute(attribute) {
        this.nativeTrace.removeAttribute(attribute);
    }
    incrementMetric(metric, by) {
        this.nativeTrace.incrementMetric(metric, by);
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
        this.nativeHttpMetric.setRequestPayloadSize(size);
    }
    setHttpResponseCode(responseCode) {
        this.nativeHttpMetric.setHttpResponseCode(responseCode);
    }
    stop() {
        this.nativeHttpMetric.stop();
    }
}
//# sourceMappingURL=performance.android.js.map