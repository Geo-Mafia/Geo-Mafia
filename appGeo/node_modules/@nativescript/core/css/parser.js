import { Color } from '../color';
import { getKnownColor } from '../color/known-colors';
const urlRegEx = /\s*url\((?:(['"])([^\1]*)\1|([^)]*))\)\s*/gy;
export function parseURL(text, start = 0) {
    urlRegEx.lastIndex = start;
    const result = urlRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = urlRegEx.lastIndex;
    const value = result[2] || result[3];
    return { start, end, value };
}
const hexColorRegEx = /\s*#((?:[0-9A-F]{8})|(?:[0-9A-F]{6})|(?:[0-9A-F]{4})|(?:[0-9A-F]{3}))\s*/giy;
export function parseHexColor(text, start = 0) {
    hexColorRegEx.lastIndex = start;
    const result = hexColorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = hexColorRegEx.lastIndex;
    return { start, end, value: new Color('#' + result[1]) };
}
const cssColorRegEx = /\s*((?:rgb|rgba|hsl|hsla|hsv|hsva)\([^\(\)]*\))/gy;
export function parseCssColor(text, start = 0) {
    cssColorRegEx.lastIndex = start;
    const result = cssColorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = cssColorRegEx.lastIndex;
    try {
        return { start, end, value: new Color(result[1]) };
    }
    catch (_a) {
        return null;
    }
}
export function convertHSLToRGBColor(hue, saturation, lightness) {
    // Per formula it will be easier if hue is divided to 60° and saturation to 100 beforehand
    // https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
    hue /= 60;
    lightness /= 100;
    const chroma = ((1 - Math.abs(2 * lightness - 1)) * saturation) / 100, X = chroma * (1 - Math.abs((hue % 2) - 1));
    // Add lightness match to all RGB components beforehand
    let { m: r, m: g, m: b } = { m: lightness - chroma / 2 };
    if (0 <= hue && hue < 1) {
        r += chroma;
        g += X;
    }
    else if (hue < 2) {
        r += X;
        g += chroma;
    }
    else if (hue < 3) {
        g += chroma;
        b += X;
    }
    else if (hue < 4) {
        g += X;
        b += chroma;
    }
    else if (hue < 5) {
        r += X;
        b += chroma;
    }
    else if (hue < 6) {
        r += chroma;
        b += X;
    }
    return {
        r: Math.round(r * 0xff),
        g: Math.round(g * 0xff),
        b: Math.round(b * 0xff),
    };
}
export function parseColorKeyword(value, start, keyword = parseKeyword(value, start)) {
    const parseColor = keyword && getKnownColor(keyword.value);
    if (parseColor != null) {
        const end = keyword.end;
        return { start, end, value: new Color(parseColor) };
    }
    return null;
}
export function parseColor(value, start = 0, keyword = parseKeyword(value, start)) {
    return parseHexColor(value, start) || parseColorKeyword(value, start, keyword) || parseCssColor(value, start);
}
const keywordRegEx = /\s*([a-z][\w\-]*)\s*/giy;
function parseKeyword(text, start = 0) {
    keywordRegEx.lastIndex = start;
    const result = keywordRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = keywordRegEx.lastIndex;
    const value = result[1];
    return { start, end, value };
}
const backgroundRepeatKeywords = new Set(['repeat', 'repeat-x', 'repeat-y', 'no-repeat']);
export function parseRepeat(value, start = 0, keyword = parseKeyword(value, start)) {
    if (keyword && backgroundRepeatKeywords.has(keyword.value)) {
        const end = keyword.end;
        const value = keyword.value;
        return { start, end, value };
    }
    return null;
}
const unitRegEx = /\s*([+\-]?(?:\d+\.\d+|\d+|\.\d+)(?:[eE][+\-]?\d+)?)([a-zA-Z]+|%)?\s*/gy;
export function parseUnit(text, start = 0) {
    unitRegEx.lastIndex = start;
    const result = unitRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = unitRegEx.lastIndex;
    const value = parseFloat(result[1]);
    const unit = result[2] || 'dip';
    return { start, end, value: { value, unit } };
}
export function parsePercentageOrLength(text, start = 0) {
    const unitResult = parseUnit(text, start);
    if (unitResult) {
        const { start, end } = unitResult;
        const value = unitResult.value;
        if (value.unit === '%') {
            value.value /= 100;
        }
        else if (!value.unit) {
            value.unit = 'dip';
        }
        else if (value.unit === 'px' || value.unit === 'dip') {
            // same
        }
        else {
            return null;
        }
        return { start, end, value };
    }
    return null;
}
const angleUnitsToRadMap = {
    deg: (start, end, deg) => ({
        start,
        end,
        value: (deg / 180) * Math.PI,
    }),
    rad: (start, end, rad) => ({
        start,
        end,
        value: rad,
    }),
    grad: (start, end, grad) => ({
        start,
        end,
        value: (grad / 200) * Math.PI,
    }),
    turn: (start, end, turn) => ({
        start,
        end,
        value: turn * Math.PI * 2,
    }),
};
export function parseAngle(value, start = 0) {
    const angleResult = parseUnit(value, start);
    if (angleResult) {
        const { start, end, value } = angleResult;
        return (angleUnitsToRadMap[value.unit] || ((_, __, ___) => null))(start, end, value.value);
    }
    return null;
}
const backgroundSizeKeywords = new Set(['auto', 'contain', 'cover']);
export function parseBackgroundSize(value, start = 0, keyword = parseKeyword(value, start)) {
    let end = start;
    if (keyword && backgroundSizeKeywords.has(keyword.value)) {
        end = keyword.end;
        const value = keyword.value;
        return { start, end, value };
    }
    // Parse one or two lengths... the other will be "auto"
    const firstLength = parsePercentageOrLength(value, end);
    if (firstLength) {
        end = firstLength.end;
        const secondLength = parsePercentageOrLength(value, firstLength.end);
        if (secondLength) {
            end = secondLength.end;
            return {
                start,
                end,
                value: { x: firstLength.value, y: secondLength.value },
            };
        }
        else {
            return { start, end, value: { x: firstLength.value, y: 'auto' } };
        }
    }
    return null;
}
const backgroundPositionKeywords = Object.freeze(new Set(['left', 'right', 'top', 'bottom', 'center']));
const backgroundPositionKeywordsDirection = {
    left: 'x',
    right: 'x',
    center: 'center',
    top: 'y',
    bottom: 'y',
};
export function parseBackgroundPosition(text, start = 0, keyword = parseKeyword(text, start)) {
    function formatH(align, offset) {
        if (align.value === 'center') {
            return 'center';
        }
        if (offset && offset.value.value !== 0) {
            return { align: align.value, offset: offset.value };
        }
        return align.value;
    }
    function formatV(align, offset) {
        if (align.value === 'center') {
            return 'center';
        }
        if (offset && offset.value.value !== 0) {
            return { align: align.value, offset: offset.value };
        }
        return align.value;
    }
    let end = start;
    if (keyword && backgroundPositionKeywords.has(keyword.value)) {
        end = keyword.end;
        const firstDirection = backgroundPositionKeywordsDirection[keyword.value];
        const firstLength = firstDirection !== 'center' && parsePercentageOrLength(text, end);
        if (firstLength) {
            end = firstLength.end;
        }
        const secondKeyword = parseKeyword(text, end);
        if (secondKeyword && backgroundPositionKeywords.has(secondKeyword.value)) {
            end = secondKeyword.end;
            const secondDirection = backgroundPositionKeywordsDirection[secondKeyword.end];
            if (firstDirection === secondDirection && firstDirection !== 'center') {
                return null; // Reject pair of both horizontal or both vertical alignments.
            }
            const secondLength = secondDirection !== 'center' && parsePercentageOrLength(text, end);
            if (secondLength) {
                end = secondLength.end;
            }
            if ((firstDirection === secondDirection && secondDirection === 'center') || firstDirection === 'x' || secondDirection === 'y') {
                return {
                    start,
                    end,
                    value: {
                        x: formatH(keyword, firstLength),
                        y: formatV(secondKeyword, secondLength),
                    },
                };
            }
            else {
                return {
                    start,
                    end,
                    value: {
                        x: formatH(secondKeyword, secondLength),
                        y: formatV(keyword, firstLength),
                    },
                };
            }
        }
        else {
            if (firstDirection === 'center') {
                return { start, end, value: { x: 'center', y: 'center' } };
            }
            else if (firstDirection === 'x') {
                return {
                    start,
                    end,
                    value: {
                        x: formatH(keyword, firstLength),
                        y: 'center',
                    },
                };
            }
            else {
                return {
                    start,
                    end,
                    value: {
                        x: 'center',
                        y: formatV(keyword, firstLength),
                    },
                };
            }
        }
    }
    else {
        const firstLength = parsePercentageOrLength(text, end);
        if (firstLength) {
            end = firstLength.end;
            const secondLength = parsePercentageOrLength(text, end);
            if (secondLength) {
                end = secondLength.end;
                return {
                    start,
                    end,
                    value: {
                        x: { align: 'left', offset: firstLength.value },
                        y: { align: 'top', offset: secondLength.value },
                    },
                };
            }
            else {
                return {
                    start,
                    end,
                    value: {
                        x: { align: 'left', offset: firstLength.value },
                        y: 'center',
                    },
                };
            }
        }
        else {
            return null;
        }
    }
}
const directionRegEx = /\s*to\s*(left|right|top|bottom)\s*(left|right|top|bottom)?\s*/gy;
const sideDirections = {
    top: (Math.PI * 0) / 2,
    right: (Math.PI * 1) / 2,
    bottom: (Math.PI * 2) / 2,
    left: (Math.PI * 3) / 2,
};
const cornerDirections = {
    top: {
        right: (Math.PI * 1) / 4,
        left: (Math.PI * 7) / 4,
    },
    right: {
        top: (Math.PI * 1) / 4,
        bottom: (Math.PI * 3) / 4,
    },
    bottom: {
        right: (Math.PI * 3) / 4,
        left: (Math.PI * 5) / 4,
    },
    left: {
        top: (Math.PI * 7) / 4,
        bottom: (Math.PI * 5) / 4,
    },
};
function parseDirection(text, start = 0) {
    directionRegEx.lastIndex = start;
    const result = directionRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = directionRegEx.lastIndex;
    const firstDirection = result[1];
    if (result[2]) {
        const secondDirection = result[2];
        const value = cornerDirections[firstDirection][secondDirection];
        return value === undefined ? null : { start, end, value };
    }
    else {
        return { start, end, value: sideDirections[firstDirection] };
    }
}
const openingBracketRegEx = /\s*\(\s*/gy;
const closingBracketRegEx = /\s*\)\s*/gy;
const closingBracketOrCommaRegEx = /\s*([),])\s*/gy;
function parseArgumentsList(text, start, argument) {
    openingBracketRegEx.lastIndex = start;
    const openingBracket = openingBracketRegEx.exec(text);
    if (!openingBracket) {
        return null;
    }
    let end = openingBracketRegEx.lastIndex;
    const value = [];
    closingBracketRegEx.lastIndex = end;
    const closingBracket = closingBracketRegEx.exec(text);
    if (closingBracket) {
        return { start, end, value };
    }
    for (let index = 0; true; index++) {
        const arg = argument(text, end, index);
        if (!arg) {
            return null;
        }
        end = arg.end;
        value.push(arg);
        closingBracketOrCommaRegEx.lastIndex = end;
        const closingBracketOrComma = closingBracketOrCommaRegEx.exec(text);
        if (closingBracketOrComma) {
            end = closingBracketOrCommaRegEx.lastIndex;
            if (closingBracketOrComma[1] === ',') {
                // noinspection UnnecessaryContinueJS
                continue;
            }
            else if (closingBracketOrComma[1] === ')') {
                return { start, end, value };
            }
        }
        else {
            return null;
        }
    }
}
export function parseColorStop(text, start = 0) {
    const color = parseColor(text, start);
    if (!color) {
        return null;
    }
    let end = color.end;
    const offset = parsePercentageOrLength(text, end);
    if (offset) {
        end = offset.end;
        return {
            start,
            end,
            value: { color: color.value, offset: offset.value },
        };
    }
    return { start, end, value: { color: color.value } };
}
const linearGradientStartRegEx = /\s*linear-gradient\s*/gy;
export function parseLinearGradient(text, start = 0) {
    linearGradientStartRegEx.lastIndex = start;
    const lgs = linearGradientStartRegEx.exec(text);
    if (!lgs) {
        return null;
    }
    let end = linearGradientStartRegEx.lastIndex;
    let angle = Math.PI;
    const colors = [];
    const parsedArgs = parseArgumentsList(text, end, (text, start, index) => {
        if (index === 0) {
            // First arg can be gradient direction
            const angleArg = parseAngle(text, start) || parseDirection(text, start);
            if (angleArg) {
                angle = angleArg.value;
                return angleArg;
            }
        }
        const colorStop = parseColorStop(text, start);
        if (colorStop) {
            colors.push(colorStop.value);
            return colorStop;
        }
        return null;
    });
    if (!parsedArgs) {
        return null;
    }
    end = parsedArgs.end;
    return { start, end, value: { angle, colors } };
}
const slashRegEx = /\s*(\/)\s*/gy;
function parseSlash(text, start) {
    slashRegEx.lastIndex = start;
    const slash = slashRegEx.exec(text);
    if (!slash) {
        return null;
    }
    const end = slashRegEx.lastIndex;
    return { start, end, value: '/' };
}
export function parseBackground(text, start = 0) {
    const value = {};
    let end = start;
    while (end < text.length) {
        const keyword = parseKeyword(text, end);
        const color = parseColor(text, end, keyword);
        if (color) {
            value.color = color.value;
            end = color.end;
            continue;
        }
        const repeat = parseRepeat(text, end, keyword);
        if (repeat) {
            value.repeat = repeat.value;
            end = repeat.end;
            continue;
        }
        const position = parseBackgroundPosition(text, end, keyword);
        if (position) {
            position.value.text = text.substring(position.start, position.end);
            value.position = position.value;
            end = position.end;
            const slash = parseSlash(text, end);
            if (slash) {
                end = slash.end;
                const size = parseBackgroundSize(text, end);
                if (!size) {
                    // Found / but no proper size following
                    return null;
                }
                value.size = size.value;
                end = size.end;
            }
            continue;
        }
        const url = parseURL(text, end);
        if (url) {
            value.image = url.value;
            end = url.end;
            continue;
        }
        const gradient = parseLinearGradient(text, end);
        if (gradient) {
            value.image = gradient.value;
            end = gradient.end;
            continue;
        }
        return null;
    }
    return { start, end, value };
}
const universalSelectorRegEx = /\*/gy;
export function parseUniversalSelector(text, start = 0) {
    universalSelectorRegEx.lastIndex = start;
    const result = universalSelectorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = universalSelectorRegEx.lastIndex;
    return { start, end, value: { type: '*' } };
}
const simpleIdentifierSelectorRegEx = /(#|\.|:|\b)((?:[\w_-]|\\.)(?:[\w\d_-]|\\.)*)/guy;
const unicodeEscapeRegEx = /\\([0-9a-fA-F]{1,5}\s|[0-9a-fA-F]{6})/g;
export function parseSimpleIdentifierSelector(text, start = 0) {
    simpleIdentifierSelectorRegEx.lastIndex = start;
    const result = simpleIdentifierSelectorRegEx.exec(text.replace(unicodeEscapeRegEx, (_, c) => '\\' + String.fromCodePoint(parseInt(c.trim(), 16))));
    if (!result) {
        return null;
    }
    const end = simpleIdentifierSelectorRegEx.lastIndex;
    const type = result[1];
    const identifier = result[2].replace(/\\/g, '');
    const value = { type, identifier };
    return { start, end, value };
}
const attributeSelectorRegEx = /\[\s*([_\-\w][_\-\w\d]*)\s*(?:(=|\^=|\$=|\*=|\~=|\|=)\s*(?:([_\-\w][_\-\w\d]*)|"((?:[^\\"]|\\(?:"|n|r|f|\\|0-9a-f))*)"|'((?:[^\\']|\\(?:'|n|r|f|\\|0-9a-f))*)')\s*)?\]/gy;
export function parseAttributeSelector(text, start) {
    attributeSelectorRegEx.lastIndex = start;
    const result = attributeSelectorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = attributeSelectorRegEx.lastIndex;
    const property = result[1];
    if (result[2]) {
        const test = result[2];
        const value = result[3] || result[4] || result[5];
        return { start, end, value: { type: '[]', property, test, value } };
    }
    return { start, end, value: { type: '[]', property } };
}
export function parseSimpleSelector(text, start = 0) {
    return parseUniversalSelector(text, start) || parseSimpleIdentifierSelector(text, start) || parseAttributeSelector(text, start);
}
export function parseSimpleSelectorSequence(text, start) {
    let simpleSelector = parseSimpleSelector(text, start);
    if (!simpleSelector) {
        return null;
    }
    let end = simpleSelector.end;
    const value = [];
    while (simpleSelector) {
        value.push(simpleSelector.value);
        end = simpleSelector.end;
        simpleSelector = parseSimpleSelector(text, end);
    }
    return { start, end, value };
}
const combinatorRegEx = /\s*([+~>])?\s*/gy;
export function parseCombinator(text, start = 0) {
    combinatorRegEx.lastIndex = start;
    const result = combinatorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = combinatorRegEx.lastIndex;
    const value = result[1] || ' ';
    return { start, end, value };
}
const whiteSpaceRegEx = /\s*/gy;
export function parseSelector(text, start = 0) {
    let end = start;
    whiteSpaceRegEx.lastIndex = end;
    const leadingWhiteSpace = whiteSpaceRegEx.exec(text);
    if (leadingWhiteSpace) {
        end = whiteSpaceRegEx.lastIndex;
    }
    const value = [];
    let combinator;
    let expectSimpleSelector = true; // Must have at least one
    let pair;
    do {
        const simpleSelectorSequence = parseSimpleSelectorSequence(text, end);
        if (!simpleSelectorSequence) {
            if (expectSimpleSelector) {
                return null;
            }
            else {
                break;
            }
        }
        end = simpleSelectorSequence.end;
        if (combinator) {
            // This logic looks weird; this `if` statement would occur on the next LOOP, so it effects the prior `pair`
            // variable which is already pushed into the `value` array is going to have its `undefined` set to this
            // value before the following statement creates a new `pair` memory variable.
            // noinspection JSUnusedAssignment
            pair[1] = combinator.value;
        }
        pair = [simpleSelectorSequence.value, undefined];
        value.push(pair);
        combinator = parseCombinator(text, end);
        if (combinator) {
            end = combinator.end;
        }
        expectSimpleSelector = combinator && combinator.value !== ' '; // Simple selector must follow non trailing white space combinator
    } while (combinator);
    return { start, end, value };
}
//# sourceMappingURL=parser.js.map