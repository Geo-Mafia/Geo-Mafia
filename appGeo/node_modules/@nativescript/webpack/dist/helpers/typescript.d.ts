/**
 * Helper used to import typescript.
 *
 * The reason this exists is that not all flavors use Typescript, and
 * in those cases just importing this helper will throw an exception.
 */
export declare function getTypescript(): typeof import('typescript');
export declare function readTsConfig(path: string): import("typescript").ParsedCommandLine;
