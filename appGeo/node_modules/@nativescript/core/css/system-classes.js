const MODAL = 'modal';
const ROOT = 'root';
const cssClasses = [];
export var CSSUtils;
(function (CSSUtils) {
    CSSUtils.CLASS_PREFIX = 'ns-';
    CSSUtils.MODAL_ROOT_VIEW_CSS_CLASS = `${CSSUtils.CLASS_PREFIX}${MODAL}`;
    CSSUtils.ROOT_VIEW_CSS_CLASS = `${CSSUtils.CLASS_PREFIX}${ROOT}`;
    function getSystemCssClasses() {
        return cssClasses;
    }
    CSSUtils.getSystemCssClasses = getSystemCssClasses;
    function pushToSystemCssClasses(value) {
        cssClasses.push(value);
        return cssClasses.length;
    }
    CSSUtils.pushToSystemCssClasses = pushToSystemCssClasses;
    function removeSystemCssClass(value) {
        const index = cssClasses.indexOf(value);
        let removedElement;
        if (index > -1) {
            removedElement = cssClasses.splice(index, 1);
        }
        return removedElement;
    }
    CSSUtils.removeSystemCssClass = removeSystemCssClass;
    function getModalRootViewCssClass() {
        return CSSUtils.MODAL_ROOT_VIEW_CSS_CLASS;
    }
    CSSUtils.getModalRootViewCssClass = getModalRootViewCssClass;
    function getRootViewCssClasses() {
        return [CSSUtils.ROOT_VIEW_CSS_CLASS, ...cssClasses];
    }
    CSSUtils.getRootViewCssClasses = getRootViewCssClasses;
    function pushToRootViewCssClasses(value) {
        return pushToSystemCssClasses(value) + 1; // because of ROOT_VIEW_CSS_CLASS
    }
    CSSUtils.pushToRootViewCssClasses = pushToRootViewCssClasses;
    function removeFromRootViewCssClasses(value) {
        return removeSystemCssClass(value);
    }
    CSSUtils.removeFromRootViewCssClasses = removeFromRootViewCssClasses;
})(CSSUtils || (CSSUtils = {}));
//# sourceMappingURL=system-classes.js.map