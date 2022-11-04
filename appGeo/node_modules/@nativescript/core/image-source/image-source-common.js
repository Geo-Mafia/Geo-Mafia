export function getScaledDimensions(width, height, maxSize) {
    if (height >= width) {
        if (height <= maxSize) {
            // if image already smaller than the required height
            return { width, height };
        }
        return {
            width: Math.round((maxSize * width) / height),
            height: maxSize,
        };
    }
    if (width <= maxSize) {
        // if image already smaller than the required width
        return { width, height };
    }
    return {
        width: maxSize,
        height: Math.round((maxSize * height) / width),
    };
}
//# sourceMappingURL=image-source-common.js.map