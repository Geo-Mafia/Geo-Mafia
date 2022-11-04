export declare enum messages {
    compilationComplete = "Webpack compilation complete.",
    startWatching = "Webpack compilation complete. Watching for file changes.",
    changeDetected = "File change detected. Starting incremental webpack compilation..."
}
/**
 * This little plugin will report the webpack state through the console
 * and send status updates through IPC to the {N} CLI.
 */
export declare class WatchStatePlugin {
    apply(compiler: any): void;
}
