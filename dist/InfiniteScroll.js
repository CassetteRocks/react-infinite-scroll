"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var InfiniteScroll = react_1.default.forwardRef(function (_a, ref) {
    var loader = _a.loader, loadMore = _a.loadMore, children = _a.children, _b = _a.pageStart, pageStart = _b === void 0 ? 0 : _b, _c = _a.element, element = _c === void 0 ? "div" : _c, getScrollParent = _a.getScrollParent, _d = _a.hasMore, hasMore = _d === void 0 ? false : _d, _e = _a.threshold, threshold = _e === void 0 ? 250 : _e, _f = _a.useWindow, useWindow = _f === void 0 ? true : _f, _g = _a.isReverse, isReverse = _g === void 0 ? false : _g, _h = _a.useCapture, useCapture = _h === void 0 ? false : _h, _j = _a.initialLoad, initialLoad = _j === void 0 ? true : _j;
    var hasLoadMore = react_1.useRef();
    var beforeScrollTop = react_1.useRef();
    var beforeScrollHeight = react_1.useRef();
    var _k = react_1.useState(pageStart), PageLoaded = _k[0], setPageLoaded = _k[1];
    var scrollRef = react_1.useRef();
    var scrollComponent = ref
        ? ref
        : scrollRef;
    var isPassiveSupported = function () {
        var passive = false;
        try {
            document.addEventListener("test", null, {
                passive: true,
            });
            document.removeEventListener("test", null);
            passive = true;
        }
        catch (e) {
            // ignore
        }
        return passive;
    };
    var eventListenerOptions = function () {
        var options;
        if (isPassiveSupported()) {
            options = {
                capture: useCapture,
            };
        }
        else {
            options = false;
        }
        return options;
    };
    var options = react_1.useMemo(eventListenerOptions, []);
    react_1.useEffect(function () {
        if (isReverse && hasLoadMore.current) {
            var parentElement = getParentElement(scrollComponent.current);
            parentElement.scrollTop =
                parentElement.scrollHeight -
                    beforeScrollHeight.current +
                    beforeScrollTop.current;
            hasLoadMore.current = false;
        }
        attachScrollListener();
        return function () {
            detachScrollListener();
            detachMousewheelListener();
        };
    }, [hasMore, threshold, pageStart, useCapture, isReverse, element]);
    var childrenArray = [children];
    if (hasMore) {
        if (loader) {
            isReverse ? childrenArray.unshift(loader) : childrenArray.push(loader);
        }
    }
    return react_1.default.createElement(element, {
        children: children,
        ref: scrollComponent,
    }, childrenArray);
    function getParentElement(el) {
        var scrollParent = getScrollParent && getScrollParent();
        if (scrollParent != null) {
            return scrollParent;
        }
        return el && el.parentElement;
    }
    function mousewheelListener(e) {
        // Prevents Chrome hangups
        // See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
        if (e.deltaY === 1 && !isPassiveSupported()) {
            e.preventDefault();
        }
    }
    function scrollListener() {
        var el = scrollComponent.current;
        var scrollEl = window;
        var parentElement = getParentElement(el);
        var offset;
        if (useWindow) {
            var doc = document.documentElement ||
                document.body.parentElement ||
                document.body;
            var scrollTop = scrollEl.pageYOffset !== undefined
                ? scrollEl.pageYOffset
                : doc.scrollTop;
            if (isReverse) {
                offset = scrollTop;
            }
            else {
                offset = calculateOffset(el, scrollTop);
            }
        }
        else if (isReverse) {
            offset = parentElement.scrollTop;
        }
        else {
            offset =
                el.scrollHeight -
                    parentElement.scrollTop -
                    parentElement.clientHeight;
        }
        // Here we make sure the element is visible as well as checking the offset
        if (offset < Number(threshold) && el && el.offsetParent !== null) {
            detachScrollListener();
            beforeScrollHeight.current = parentElement.scrollHeight;
            beforeScrollTop.current = parentElement.scrollTop;
            // Call loadMore after detachScrollListener to allow for non-async loadMore functions
            if (loadMore) {
                loadMore(PageLoaded + 1);
                hasLoadMore.current = true;
                setPageLoaded(PageLoaded + 1);
            }
        }
    }
    function detachMousewheelListener() {
        var scrollEl = window;
        if (useWindow === false) {
            scrollEl = scrollComponent.current.parentElement;
        }
        scrollEl.removeEventListener("mousewheel", mousewheelListener, options ? options : useCapture);
    }
    function detachScrollListener() {
        var scrollEl = window;
        if (useWindow === false) {
            scrollEl = getParentElement(scrollComponent.current);
        }
        scrollEl.removeEventListener("scroll", scrollListener, options ? options : useCapture);
        scrollEl.removeEventListener("resize", scrollListener, options ? options : useCapture);
    }
    function calculateOffset(el, scrollTop) {
        if (!el) {
            return 0;
        }
        return (calculateTopPosition(el) +
            (el.offsetHeight - scrollTop - window.innerHeight));
    }
    function calculateTopPosition(el) {
        if (!el) {
            return 0;
        }
        return (el.offsetTop + calculateTopPosition(el.offsetParent));
    }
    function attachScrollListener() {
        var parentElement = getParentElement(scrollComponent.current);
        if (!hasMore || !parentElement) {
            return;
        }
        var scrollEl = window;
        if (useWindow === false) {
            scrollEl = parentElement;
        }
        scrollEl.addEventListener("mousewheel", mousewheelListener, options ? options : useCapture);
        scrollEl.addEventListener("scroll", scrollListener, options ? options : useCapture);
        scrollEl.addEventListener("resize", scrollListener, options ? options : useCapture);
        if (initialLoad) {
            scrollListener();
        }
    }
});
exports.default = InfiniteScroll;
