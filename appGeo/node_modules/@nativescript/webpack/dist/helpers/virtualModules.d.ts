import Config from 'webpack-chain';
/**
 * @deprecated Virtual entries are not recommended by the webpack team, use real files instead. For example, resolve a path in node_modules if necessary.
 */
export declare function addVirtualEntry(config: Config, name: string, contents: string): string;
/**
 * @deprecated Virtual modules are not recommended by the webpack team, use real files instead. For example, resolve a path in node_modules if necessary.
 */
export declare function addVirtualModule(config: Config, name: string, contents: string): string;
