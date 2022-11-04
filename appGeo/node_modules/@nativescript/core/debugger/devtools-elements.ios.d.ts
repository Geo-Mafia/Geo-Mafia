import { InspectorEvents, InspectorCommands } from './devtools-elements-interfaces';
export * from './devtools-elements-interfaces';
export declare function attachDOMInspectorEventCallbacks(DOMDomainFrontend: InspectorEvents): void;
export declare function attachDOMInspectorCommandCallbacks(DOMDomainBackend: InspectorCommands): void;
export declare function attachCSSInspectorCommandCallbacks(CSSDomainBackend: InspectorCommands): void;
