import { Color } from '../../color';
export class LinearGradient {
    static parse(value) {
        const result = new LinearGradient();
        result.angle = value.angle;
        result.colorStops = value.colors.map((color) => {
            const offset = color.offset || null;
            let offsetUnit;
            if (offset && offset.unit === '%') {
                offsetUnit = {
                    unit: '%',
                    value: offset.value,
                };
            }
            return {
                color: color.color,
                offset: offsetUnit,
            };
        });
        return result;
    }
    static equals(first, second) {
        if (!first && !second) {
            return true;
        }
        else if (!first || !second) {
            return false;
        }
        if (first.angle !== second.angle) {
            return false;
        }
        if (first.colorStops.length !== second.colorStops.length) {
            return false;
        }
        for (let i = 0; i < first.colorStops.length; i++) {
            const firstStop = first.colorStops[i];
            const secondStop = second.colorStops[i];
            if (firstStop.offset !== secondStop.offset) {
                return false;
            }
            if (!Color.equals(firstStop.color, secondStop.color)) {
                return false;
            }
        }
        return true;
    }
}
//# sourceMappingURL=linear-gradient.js.map