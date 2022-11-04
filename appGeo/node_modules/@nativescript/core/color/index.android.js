import * as common from './color-common';
export class Color extends common.Color {
    get android() {
        return this.argb >> 0;
    }
}
//# sourceMappingURL=index.android.js.map