const MIN_WH = 'minWH';
const MIN_W = 'minW';
const MIN_H = 'minH';
const PRIORITY_STEP = 10000;
const minWidthHeightQualifier = {
    isMatch: function (path) {
        return new RegExp(`.${MIN_WH}\\d+`).test(path);
    },
    getMatchOccurences: function (path) {
        return path.match(new RegExp(`.${MIN_WH}\\d+`, 'g'));
    },
    getMatchValue(value, context) {
        const numVal = parseInt(value.substr(MIN_WH.length + 1));
        if (isNaN(numVal)) {
            return -1;
        }
        const actualLength = Math.min(context.width, context.height);
        if (actualLength < numVal) {
            return -1;
        }
        return PRIORITY_STEP - (actualLength - numVal);
    },
};
const minWidthQualifier = {
    isMatch: function (path) {
        return new RegExp(`.${MIN_W}\\d+`).test(path) && !new RegExp(`.${MIN_WH}\\d+`).test(path);
    },
    getMatchOccurences: function (path) {
        return path.match(new RegExp(`.${MIN_W}\\d+`, 'g'));
    },
    getMatchValue(value, context) {
        const numVal = parseInt(value.substr(MIN_W.length + 1));
        if (isNaN(numVal)) {
            return -1;
        }
        const actualWidth = context.width;
        if (actualWidth < numVal) {
            return -1;
        }
        return PRIORITY_STEP - (actualWidth - numVal);
    },
};
const minHeightQualifier = {
    isMatch: function (path) {
        return new RegExp(`.${MIN_H}\\d+`).test(path) && !new RegExp(`.${MIN_WH}\\d+`).test(path);
    },
    getMatchOccurences: function (path) {
        return path.match(new RegExp(`.${MIN_H}\\d+`, 'g'));
    },
    getMatchValue(value, context) {
        const numVal = parseInt(value.substr(MIN_H.length + 1));
        if (isNaN(numVal)) {
            return -1;
        }
        const actualHeight = context.height;
        if (actualHeight < numVal) {
            return -1;
        }
        return PRIORITY_STEP - (actualHeight - numVal);
    },
};
const platformQualifier = {
    isMatch: function (path) {
        return path.includes('.android') || path.includes('.ios');
    },
    getMatchOccurences: function (path) {
        return path.match(new RegExp('\\.android|\\.ios', 'g'));
    },
    getMatchValue(value, context) {
        const val = value.substr(1);
        return val === context.os.toLowerCase() ? 1 : -1;
    },
};
const orientationQualifier = {
    isMatch: function (path) {
        return path.includes('.land') || path.includes('.port');
    },
    getMatchOccurences: function (path) {
        return path.match(new RegExp('\\.land|\\.port', 'g'));
    },
    getMatchValue(value, context) {
        const val = value.substr(1);
        const isLandscape = context.width > context.height ? 1 : -1;
        return val === 'land' ? isLandscape : -isLandscape;
    },
};
// List of supported qualifiers ordered by priority
const supportedQualifiers = [minWidthHeightQualifier, minWidthQualifier, minHeightQualifier, orientationQualifier, platformQualifier];
function checkQualifiers(path, context) {
    let result = 0;
    let value;
    for (let i = 0; i < supportedQualifiers.length; i++) {
        const qualifier = supportedQualifiers[i];
        if (qualifier.isMatch(path)) {
            const occurences = qualifier.getMatchOccurences(path);
            // Always get the last qualifier among identical occurences
            value = qualifier.getMatchValue(occurences[occurences.length - 1], context);
            if (value < 0) {
                // Non of the supported qualifiers matched this or the match was not satisfied
                return -1;
            }
            if (value > 0) {
                result += value + (supportedQualifiers.length - i) * PRIORITY_STEP;
            }
        }
    }
    return result;
}
export function stripQualifiers(path) {
    // Strip qualifiers from path if any
    for (let i = 0; i < supportedQualifiers.length; i++) {
        const qualifier = supportedQualifiers[i];
        if (qualifier.isMatch(path)) {
            const occurences = qualifier.getMatchOccurences(path);
            for (let j = 0; j < occurences.length; j++) {
                path = path.replace(occurences[j], '');
            }
        }
    }
    return path;
}
export function findMatch(path, ext, candidates, context) {
    const fullPath = ext ? path + ext : path;
    let bestValue = -1;
    let result = null;
    for (let i = 0; i < candidates.length; i++) {
        const filePath = candidates[i];
        // Check if candidate is correct for given path
        const cleanFilePath = stripQualifiers(filePath);
        if (cleanFilePath !== fullPath) {
            continue;
        }
        const value = checkQualifiers(filePath, context);
        if (value >= 0 && value > bestValue) {
            bestValue = value;
            result = candidates[i];
        }
    }
    return result;
}
//# sourceMappingURL=index.js.map