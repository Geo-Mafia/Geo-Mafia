/**
 * This is a stub class, the console is implemented in native code
 */
export declare class Console {
    time(reportName?: string): void;
    timeEnd(reportName?: string): void;
    assert(test: boolean, message?: string): void;
    info(message: any): void;
    warn(message: any): void;
    error(message: any): void;
    log(message: any): void;
    trace(): void;
    dir(obj: any): void;
}
