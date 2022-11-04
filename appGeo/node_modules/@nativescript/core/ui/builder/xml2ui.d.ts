import { Template, KeyedTemplate } from '../core/view';
import * as xml from '../../xml';
import type { ComponentModule } from './component-builder';
export declare namespace xml2ui {
    /**
     * Pipes and filters:
     * https://en.wikipedia.org/wiki/Pipeline_(software)
     */
    interface XmlProducer {
        pipe<Next extends XmlConsumer>(next: Next): Next;
    }
    interface XmlConsumer {
        parse(args: xml.ParserEvent): any;
    }
    interface ParseInputData extends String {
        default?: string;
    }
    export class XmlProducerBase implements XmlProducer {
        private _next;
        pipe<Next extends XmlConsumer>(next: Next): Next;
        protected next(args: xml.ParserEvent): void;
    }
    export class XmlStringParser extends XmlProducerBase implements XmlProducer {
        private error;
        constructor(error?: ErrorFormatter);
        parse(value: ParseInputData): void;
    }
    interface ErrorFormatter {
        (e: Error, p: xml.Position): Error;
    }
    export function PositionErrorFormat(e: Error, p: xml.Position): Error;
    export function SourceErrorFormat(uri: any): ErrorFormatter;
    interface SourceTracker {
        (component: any, p: xml.Position): void;
    }
    export function ComponentSourceTracker(uri: any): SourceTracker;
    export class PlatformFilter extends XmlProducerBase implements XmlProducer, XmlConsumer {
        private currentPlatformContext;
        parse(args: xml.ParserEvent): void;
        private static isPlatform;
        private static isCurentPlatform;
    }
    export class XmlArgsReplay extends XmlProducerBase implements XmlProducer {
        private error;
        private args;
        constructor(args: xml.ParserEvent[], errorFormat: ErrorFormatter);
        replay(): void;
    }
    interface TemplateProperty {
        context?: any;
        parent: ComponentModule;
        name: string;
        elementName: string;
        templateItems: Array<string>;
        errorFormat: ErrorFormatter;
        sourceTracker: SourceTracker;
    }
    /**
     * It is a state pattern
     * https://en.wikipedia.org/wiki/State_pattern
     */
    export class XmlStateParser implements XmlConsumer {
        private state;
        constructor(state: XmlStateConsumer);
        parse(args: xml.ParserEvent): void;
    }
    interface XmlStateConsumer extends XmlConsumer {
        parse(args: xml.ParserEvent): XmlStateConsumer;
    }
    export class TemplateParser implements XmlStateConsumer {
        private _context;
        private _recordedXmlStream;
        private _templateProperty;
        private _nestingLevel;
        private _state;
        private parent;
        private _setTemplateProperty;
        constructor(parent: XmlStateConsumer, templateProperty: TemplateProperty, setTemplateProperty?: boolean);
        parse(args: xml.ParserEvent): XmlStateConsumer;
        get elementName(): string;
        private parseStartElement;
        private parseEndElement;
        buildTemplate(): Template;
    }
    export class MultiTemplateParser implements XmlStateConsumer {
        private parent;
        private templateProperty;
        private _childParsers;
        private _value;
        get value(): KeyedTemplate[];
        constructor(parent: XmlStateConsumer, templateProperty: TemplateProperty);
        parse(args: xml.ParserEvent): XmlStateConsumer;
    }
    export namespace TemplateParser {
        const enum State {
            EXPECTING_START = 0,
            PARSING = 1,
            FINISHED = 2
        }
    }
    export class ComponentParser implements XmlStateConsumer {
        private moduleName?;
        private static KNOWNCOLLECTIONS;
        private static KNOWNTEMPLATES;
        private static KNOWNMULTITEMPLATES;
        rootComponentModule: ComponentModule;
        private context;
        private currentRootView;
        private parents;
        private complexProperties;
        private error;
        private sourceTracker;
        constructor(context: any, errorFormat: ErrorFormatter, sourceTracker: SourceTracker, moduleName?: string);
        private buildComponent;
        parse(args: xml.ParserEvent): XmlStateConsumer;
        private static isComplexProperty;
        static getComplexPropertyName(fullName: string): string;
        private static isKnownTemplate;
        private static isKnownMultiTemplate;
        private static addToComplexProperty;
        private static isKnownCollection;
    }
    export namespace ComponentParser {
        interface ComplexProperty {
            parent: ComponentModule;
            name: string;
            items?: Array<any>;
            parser?: {
                value: any;
            };
        }
    }
    export {};
}
