import * as definition from '.';
export declare class Color implements definition.Color {
    private _argb;
    private _name;
    constructor(color: number);
    constructor(color: string);
    constructor(a: number, r: number, g: number, b: number, type?: 'rbg' | 'hsl' | 'hsv');
    get a(): number;
    get r(): number;
    get g(): number;
    get b(): number;
    get argb(): number;
    get hex(): string;
    get name(): string;
    get ios(): UIColor;
    get android(): number;
    _argbFromString(hex: string): number;
    equals(value: definition.Color): boolean;
    static equals(value1: definition.Color, value2: definition.Color): boolean;
    static isValid(value: any): boolean;
    static fromHSL(a: any, h: any, s: any, l: any): Color;
    static fromHSV(a: any, h: any, s: any, l: any): Color;
    toString(): string;
    static fromIosColor(value: UIColor): Color;
    /**
     * return true if brightness < 128
     *
     */
    isDark(): boolean;
    /**
     * return true if brightness >= 128
     *
     */
    isLight(): boolean;
    /**
     * return the [brightness](http://www.w3.org/TR/AERT#color-contrast)
     *
     */
    getBrightness(): number;
    /**
     * return the [luminance](http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef)
     *
     */
    getLuminance(): number;
    /**
     * Return this color (as a new Color instance) with the provided alpha
     *
     * @param alpha (between 0 and 255)
     */
    setAlpha(a: number): Color;
    /**
     * return the hsl representation of the color
     *
     */
    toHsl(): {
        a: number;
        h: number;
        s: number;
        l: number;
    };
    /**
     * return the [CSS hsv](https://www.w3schools.com/Css/css_colors_hsl.asp) representation of the color
     *
     */
    toHslString(): string;
    /**
     * return the hsv representation of the color
     *
     */
    toHsv(): {
        a: number;
        h: number;
        s: number;
        v: number;
    };
    /**
     * return the [CSS hsv](https://www.w3schools.com/Css/css_colors_rgb.asp) representation of the color
     *
     */
    toHsvString(): string;
    /**
     * return the [CSS rgb](https://www.w3schools.com/Css/css_colors_rgb.asp) representation of the color
     *
     */
    toRgbString(): string;
    /**
     *  Desaturate the color a given amount, from 0 to 100. Providing 100 will is the same as calling greyscale.
     *
     * @param amount (between 0 and 100)
     */
    desaturate(amount: number): Color;
    /**
     * Saturate the color a given amount, from 0 to 100.
     *
     * @param amount (between 0 and 100)
     */
    saturate(amount: number): Color;
    /**
     * Completely desaturates a color into greyscale. Same as calling desaturate(100).
     *
     */
    greyscale(): Color;
    /**
     * Lighten the color a given amount, from 0 to 100. Providing 100 will always return white.
     *
     * @param amount (between 0 and 100)
     */
    lighten(amount: number): Color;
    /**
     * Brighten the color a given amount, from 0 to 100.
     *
     * @param amount (between 0 and 100)
     */
    brighten(amount: number): Color;
    /**
     * Darken the color a given amount, from 0 to 100. Providing 100 will always return black.
     *
     * @param amount (between 0 and 100)
     */
    darken(amount: number): Color;
    /**
     * Spin the hue a given amount, from -360 to 360. Calling with 0, 360, or -360 will do nothing (since it sets the hue back to what it was before).
     *
     * @param amount (between -360 and 360)
     */
    spin(amount: number): Color;
    /**
     * returns the color complement
     *
     */
    complement(): Color;
    static mix(color1: Color, color2: Color, amount?: number): Color;
}
