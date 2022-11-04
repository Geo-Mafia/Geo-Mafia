import { CssAnimationProperty } from '../core/properties';
import { KeyframeAnimationInfo } from '../animation/keyframe-animation';
import { timeConverter, animationTimingFunctionConverter } from '../styling/converters';
import { transformConverter } from '../styling/style-properties';
const ANIMATION_PROPERTY_HANDLERS = Object.freeze({
    'animation-name': (info, value) => (info.name = value),
    'animation-duration': (info, value) => (info.duration = timeConverter(value)),
    'animation-delay': (info, value) => (info.delay = timeConverter(value)),
    'animation-timing-function': (info, value) => (info.curve = animationTimingFunctionConverter(value)),
    'animation-iteration-count': (info, value) => (info.iterations = value === 'infinite' ? Number.POSITIVE_INFINITY : parseFloat(value)),
    'animation-direction': (info, value) => (info.isReverse = value === 'reverse'),
    'animation-fill-mode': (info, value) => (info.isForwards = value === 'forwards'),
});
export class CssAnimationParser {
    static keyframeAnimationsFromCSSDeclarations(declarations) {
        if (declarations === null || declarations === undefined) {
            return undefined;
        }
        const animations = new Array();
        let animationInfo = undefined;
        declarations.forEach(({ property, value }) => {
            if (property === 'animation') {
                keyframeAnimationsFromCSSProperty(value, animations);
            }
            else {
                const propertyHandler = ANIMATION_PROPERTY_HANDLERS[property];
                if (propertyHandler) {
                    if (animationInfo === undefined) {
                        animationInfo = new KeyframeAnimationInfo();
                        animations.push(animationInfo);
                    }
                    propertyHandler(animationInfo, value);
                }
            }
        });
        return animations.length === 0 ? undefined : animations;
    }
    static keyframesArrayFromCSS(keyframes) {
        const parsedKeyframes = new Array();
        for (const keyframe of keyframes) {
            const declarations = parseKeyframeDeclarations(keyframe.declarations);
            for (let time of keyframe.values) {
                if (time === 'from') {
                    time = 0;
                }
                else if (time === 'to') {
                    time = 1;
                }
                else {
                    time = parseFloat(time) / 100;
                    if (time < 0) {
                        time = 0;
                    }
                    if (time > 100) {
                        time = 100;
                    }
                }
                let current = parsedKeyframes[time];
                if (current === undefined) {
                    current = {};
                    current.duration = time;
                    parsedKeyframes[time] = current;
                }
                for (const declaration of keyframe.declarations) {
                    if (declaration.property === 'animation-timing-function') {
                        current.curve = animationTimingFunctionConverter(declaration.value);
                    }
                }
                current.declarations = declarations;
            }
        }
        const array = [];
        for (const parsedKeyframe in parsedKeyframes) {
            array.push(parsedKeyframes[parsedKeyframe]);
        }
        array.sort(function (a, b) {
            return a.duration - b.duration;
        });
        return array;
    }
}
function keyframeAnimationsFromCSSProperty(value, animations) {
    if (typeof value === 'string') {
        const values = value.split(/[,]+/);
        for (const parsedValue of values) {
            const animationInfo = new KeyframeAnimationInfo();
            const arr = parsedValue.trim().split(/[ ]+/);
            if (arr.length > 0) {
                animationInfo.name = arr[0];
            }
            if (arr.length > 1) {
                animationInfo.duration = timeConverter(arr[1]);
            }
            if (arr.length > 2) {
                animationInfo.curve = animationTimingFunctionConverter(arr[2]);
            }
            if (arr.length > 3) {
                animationInfo.delay = timeConverter(arr[3]);
            }
            if (arr.length > 4) {
                animationInfo.iterations = parseInt(arr[4]);
            }
            if (arr.length > 5) {
                animationInfo.isReverse = arr[4] === 'reverse';
            }
            if (arr.length > 6) {
                animationInfo.isForwards = arr[5] === 'forwards';
            }
            if (arr.length > 7) {
                throw new Error('Invalid value for animation: ' + value);
            }
            animations.push(animationInfo);
        }
    }
}
export function parseKeyframeDeclarations(unparsedKeyframeDeclarations) {
    const declarations = unparsedKeyframeDeclarations.reduce((declarations, { property: unparsedProperty, value: unparsedValue }) => {
        const property = CssAnimationProperty._getByCssName(unparsedProperty);
        if (typeof unparsedProperty === 'string' && property && property._valueConverter) {
            declarations[property.name] = property._valueConverter(unparsedValue);
        }
        else if (typeof unparsedValue === 'string' && unparsedProperty === 'transform') {
            const transformations = transformConverter(unparsedValue);
            Object.assign(declarations, transformations);
        }
        return declarations;
    }, {});
    return Object.keys(declarations).map((property) => ({
        property,
        value: declarations[property],
    }));
}
//# sourceMappingURL=css-animation-parser.js.map