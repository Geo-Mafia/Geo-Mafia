import * as common from './color-common';
export class Color extends common.Color {
    get ios() {
        if (!this._ios) {
            // iOS Color is using floating-point values in the [0, 1] range, so divide the components by 255
            this._ios = UIColor.alloc().initWithRedGreenBlueAlpha(this.r / 255, this.g / 255, this.b / 255, this.a / 255);
        }
        return this._ios;
    }
    static fromIosColor(value) {
        const rgba = CGColorGetComponents(value.CGColor);
        return new Color(Math.round(rgba[3] * 255), Math.round(rgba[0] * 255), Math.round(rgba[1] * 255), Math.round(rgba[2] * 255));
    }
}
//# sourceMappingURL=index.ios.js.map