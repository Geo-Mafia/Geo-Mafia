const epsilon = 1e-5;
export function areClose(value1, value2) {
    return Math.abs(value1 - value2) < epsilon;
}
export function greaterThanOrClose(value1, value2) {
    return value1 > value2 || areClose(value1, value2);
}
export function greaterThan(value1, value2) {
    return value1 > value2 && !areClose(value1, value2);
}
export function lessThan(value1, value2) {
    return value1 < value2 && !areClose(value1, value2);
}
export function isZero(value) {
    return Math.abs(value) < epsilon;
}
export function greaterThanZero(value) {
    return value > 0;
}
export function notNegative(value) {
    return value >= 0;
}
export const radiansToDegrees = (a) => a * (180 / Math.PI);
export const degreesToRadians = (a) => a * (Math.PI / 180);
//# sourceMappingURL=number-utils.js.map