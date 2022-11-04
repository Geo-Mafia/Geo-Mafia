// Types.
import { debug } from '../../utils/debug';
import { isDefined } from '../../utils/types';
import { setPropertyValue, getComponentModule } from './component-builder';
import { platformNames } from '../../platform';
import { sanitizeModuleName } from './module-name-sanitizer';
import { resolveModuleName } from '../../module-name-resolver';
import { xml2ui } from './xml2ui';
export const ios = platformNames.ios.toLowerCase();
export const android = platformNames.android.toLowerCase();
export const defaultNameSpaceMatcher = /tns\.xsd$/i;
export class Builder {
    static createViewFromEntry(entry) {
        if (entry.create) {
            const view = entry.create();
            if (!view) {
                throw new Error('Failed to create View with entry.create() function.');
            }
            return view;
        }
        else if (entry.moduleName) {
            const moduleName = sanitizeModuleName(entry.moduleName);
            const resolvedCodeModuleName = resolveModuleName(moduleName, ''); //`${moduleName}.xml`;
            const moduleExports = resolvedCodeModuleName ? global.loadModule(resolvedCodeModuleName, true) : null;
            if (moduleExports && moduleExports.createPage) {
                // Exports has a createPage() method
                const view = moduleExports.createPage();
                const resolvedCssModuleName = resolveModuleName(moduleName, 'css'); //entry.moduleName + ".css";
                if (resolvedCssModuleName) {
                    view.addCssFile(resolvedCssModuleName);
                }
                return view;
            }
            else {
                const componentModule = loadInternal(moduleName, moduleExports);
                const componentView = componentModule && componentModule.component;
                return componentView;
            }
        }
        throw new Error('Failed to load page XML file for module: ' + entry.moduleName);
    }
    static parse(value, context) {
        if (typeof value === 'function') {
            return value();
        }
        else {
            const exports = context ? getExports(context) : undefined;
            const componentModule = parseInternal(value, exports);
            return componentModule && componentModule.component;
        }
    }
    static load(pathOrOptions, context) {
        let componentModule;
        if (typeof pathOrOptions === 'string') {
            const moduleName = sanitizeModuleName(pathOrOptions);
            componentModule = loadInternal(moduleName, context);
        }
        else {
            componentModule = loadCustomComponent(pathOrOptions.path, pathOrOptions.name, pathOrOptions.attributes, pathOrOptions.exports, pathOrOptions.page, true);
        }
        return componentModule && componentModule.component;
    }
    static parseMultipleTemplates(value, context) {
        const dummyComponent = `<ListView><ListView.itemTemplates>${value}</ListView.itemTemplates></ListView>`;
        return parseInternal(dummyComponent, context).component['itemTemplates'];
    }
}
// ui plugin developers can add to these to define their own custom types if needed
Builder.knownTemplates = new Set(['itemTemplate']);
Builder.knownMultiTemplates = new Set(['itemTemplates']);
Builder.knownCollections = new Set(['items', 'spans', 'actionItems']);
export function parse(value, context) {
    console.log('parse() is deprecated. Use Builder.parse() instead.');
    return Builder.parse(value, context);
}
export function parseMultipleTemplates(value, context) {
    console.log('parseMultipleTemplates() is deprecated. Use Builder.parseMultipleTemplates() instead.');
    return Builder.parseMultipleTemplates(value, context);
}
export function load(pathOrOptions, context) {
    console.log('load() is deprecated. Use Builder.load() instead.');
    return Builder.load(pathOrOptions, context);
}
export function createViewFromEntry(entry) {
    console.log('createViewFromEntry() is deprecated. Use Builder.createViewFromEntry() instead.');
    return Builder.createViewFromEntry(entry);
}
function loadInternal(moduleName, moduleExports) {
    let componentModule;
    const resolvedXmlModule = resolveModuleName(moduleName, 'xml');
    if (resolvedXmlModule) {
        const text = global.loadModule(resolvedXmlModule, true);
        componentModule = parseInternal(text, moduleExports, resolvedXmlModule, moduleName);
    }
    const componentView = componentModule && componentModule.component;
    if (componentView) {
        // Save exports to root component (will be used for templates).
        componentView.exports = moduleExports;
        // Save _moduleName - used for livesync
        componentView._moduleName = moduleName;
    }
    if (!componentModule) {
        throw new Error('Failed to load component from module: ' + moduleName);
    }
    return componentModule;
}
export function loadCustomComponent(componentNamespace, componentName, attributes, context, parentPage, isRootComponent = true, moduleNamePath) {
    if (!parentPage && context) {
        // Read the parent page that was passed down below
        // https://github.com/NativeScript/NativeScript/issues/1639
        parentPage = context['_parentPage'];
        delete context['_parentPage'];
    }
    let result;
    componentNamespace = sanitizeModuleName(componentNamespace);
    const moduleName = `${componentNamespace}/${componentName}`;
    const resolvedCodeModuleName = resolveModuleName(moduleName, '');
    const resolvedXmlModuleName = resolveModuleName(moduleName, 'xml');
    let resolvedCssModuleName = resolveModuleName(moduleName, 'css');
    if (resolvedXmlModuleName) {
        // Custom components with XML
        let subExports = context;
        if (resolvedCodeModuleName) {
            // Component has registered code module.
            subExports = global.loadModule(resolvedCodeModuleName, true);
        }
        // Pass the parent page down the chain in case of custom components nested on many levels. Use the context for piggybacking.
        // https://github.com/NativeScript/NativeScript/issues/1639
        if (!subExports) {
            subExports = {};
        }
        subExports['_parentPage'] = parentPage;
        result = loadInternal(moduleName, subExports);
        // Attributes will be transferred to the custom component
        if (isDefined(result) && isDefined(result.component) && isDefined(attributes)) {
            for (const attr in attributes) {
                setPropertyValue(result.component, subExports, context, attr, attributes[attr]);
            }
        }
    }
    else {
        // Custom components without XML
        result = getComponentModule(componentName, componentNamespace, attributes, context, moduleNamePath, isRootComponent);
        // The namespace is the JS module and the (componentName is the name of the class in the module)
        // So if there is no componentNamespace/componentName.{qualifiers}.css we should also look for
        // componentNamespace.{qualifiers}.css
        if (!resolvedCssModuleName) {
            resolvedCssModuleName = resolveModuleName(componentNamespace, 'css');
        }
    }
    // Add CSS from webpack module if exists.
    if (parentPage && resolvedCssModuleName) {
        parentPage.addCssFile(resolvedCssModuleName);
    }
    return result;
}
export function getExports(instance) {
    const isView = !!instance._domId;
    if (!isView) {
        return instance.exports || instance;
    }
    let exportObject = instance.exports;
    let parent = instance.parent;
    while (exportObject === undefined && parent) {
        exportObject = parent.exports;
        parent = parent.parent;
    }
    return exportObject;
}
function parseInternal(value, context, xmlModule, moduleName) {
    if (__UI_USE_XML_PARSER__) {
        let start;
        let ui;
        const errorFormat = debug && xmlModule ? xml2ui.SourceErrorFormat(xmlModule) : xml2ui.PositionErrorFormat;
        const componentSourceTracker = debug && xmlModule
            ? xml2ui.ComponentSourceTracker(xmlModule)
            : () => {
                // no-op
            };
        (start = new xml2ui.XmlStringParser(errorFormat)).pipe(new xml2ui.PlatformFilter()).pipe(new xml2ui.XmlStateParser((ui = new xml2ui.ComponentParser(context, errorFormat, componentSourceTracker, moduleName))));
        start.parse(value);
        return ui.rootComponentModule;
    }
    else {
        return null;
    }
}
//# sourceMappingURL=index.js.map