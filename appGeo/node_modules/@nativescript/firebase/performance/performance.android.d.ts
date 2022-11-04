export declare function startTrace(name: string): FirebaseTrace;
export declare function startHttpMetric(url: string, method: string): FirebaseHttpMetric;
export declare class FirebaseTrace {
    private nativeTrace;
    constructor(nativeTrace: com.google.firebase.perf.metrics.Trace);
    setValue(attribute: string, value: string): void;
    getValue(attribute: string): string;
    getAttributes(): {
        [field: string]: any;
    };
    removeAttribute(attribute: string): void;
    incrementMetric(metric: string, by: number): void;
    stop(): void;
}
export declare class FirebaseHttpMetric {
    private nativeHttpMetric;
    constructor(nativeHttpMetric: com.google.firebase.perf.metrics.HttpMetric);
    setRequestPayloadSize(size: number): void;
    setHttpResponseCode(responseCode: number): void;
    stop(): void;
}
