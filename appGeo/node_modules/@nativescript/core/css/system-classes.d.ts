export declare namespace CSSUtils {
    const CLASS_PREFIX = "ns-";
    const MODAL_ROOT_VIEW_CSS_CLASS: string;
    const ROOT_VIEW_CSS_CLASS: string;
    function getSystemCssClasses(): string[];
    function pushToSystemCssClasses(value: string): number;
    function removeSystemCssClass(value: string): string;
    function getModalRootViewCssClass(): string;
    function getRootViewCssClasses(): string[];
    function pushToRootViewCssClasses(value: string): number;
    function removeFromRootViewCssClasses(value: string): string;
}
