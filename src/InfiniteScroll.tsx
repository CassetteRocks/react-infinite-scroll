import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  MutableRefObject,
} from "react";

interface Props {
  element?: string;
  hasMore?: boolean;
  pageStart?: number;
  threshold?: number;
  useWindow?: boolean;
  isReverse?: boolean;
  useCapture?: boolean;
  initialLoad?: boolean;
  loader?: React.ReactNode;
  getScrollParent?: () => Element;
  loadMore: (page: number) => void;
}

const InfiniteScroll: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      loader,
      loadMore,
      children,
      pageStart = 0,
      element = "div",
      getScrollParent,
      hasMore = false,
      threshold = 250,
      useWindow = true,
      isReverse = false,
      useCapture = false,
      initialLoad = true,
    },
    ref
  ) => {
    const hasLoadMore = useRef<boolean>();
    const beforeScrollTop = useRef<number>();
    const beforeScrollHeight = useRef<number>();
    const [PageLoaded, setPageLoaded] = useState(pageStart);
    const scrollRef = useRef<HTMLDivElement>();
    const scrollComponent = ref
      ? (ref as MutableRefObject<HTMLDivElement>)
      : scrollRef;

    const isPassiveSupported = () => {
      let passive = false;

      try {
        document.addEventListener("test", null, {
          passive: true,
        });
        document.removeEventListener("test", null);
        passive = true;
      } catch (e) {
        // ignore
      }

      return passive;
    };

    const eventListenerOptions = () => {
      let options: boolean | EventListenerOptions;

      if (isPassiveSupported()) {
        options = {
          capture: useCapture,
        };
      } else {
        options = false;
      }

      return options;
    };

    const options: boolean | EventListenerOptions = useMemo(
      eventListenerOptions,
      []
    );

    useEffect(() => {
      if (isReverse && hasLoadMore.current) {
        const parentElement = getParentElement(scrollComponent.current);
        parentElement.scrollTop =
          parentElement.scrollHeight -
          beforeScrollHeight.current +
          beforeScrollTop.current;
        hasLoadMore.current = false;
      }
      attachScrollListener();

      return () => {
        detachScrollListener();
        detachMousewheelListener();
      };
    }, [hasMore, threshold, pageStart, useCapture, isReverse, element]);

    const childrenArray = [children];
    if (hasMore) {
      if (loader) {
        isReverse ? childrenArray.unshift(loader) : childrenArray.push(loader);
      }
    }

    return React.createElement(
      element,
      {
        children,
        ref: scrollComponent,
      },
      childrenArray
    );

    function getParentElement(el: HTMLElement) {
      const scrollParent = getScrollParent && getScrollParent();
      if (scrollParent != null) {
        return scrollParent;
      }
      return el && el.parentElement;
    }

    function mousewheelListener(e: Event) {
      // Prevents Chrome hangups
      // See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
      if ((e as MouseWheelEvent).deltaY === 1 && !isPassiveSupported()) {
        e.preventDefault();
      }
    }

    function scrollListener() {
      const el = scrollComponent.current;
      const scrollEl = window;
      const parentElement = getParentElement(el);

      let offset;
      if (useWindow) {
        const doc =
          document.documentElement ||
          document.body.parentElement ||
          document.body;
        const scrollTop =
          scrollEl.pageYOffset !== undefined
            ? scrollEl.pageYOffset
            : doc.scrollTop;
        if (isReverse) {
          offset = scrollTop;
        } else {
          offset = calculateOffset(el, scrollTop);
        }
      } else if (isReverse) {
        offset = parentElement.scrollTop;
      } else {
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
      let scrollEl: (Window & typeof globalThis) | Element = window;
      if (useWindow === false) {
        scrollEl = scrollComponent.current.parentElement;
      }

      scrollEl.removeEventListener(
        "mousewheel",
        mousewheelListener,
        options ? options : useCapture
      );
    }

    function detachScrollListener() {
      let scrollEl: (Window & typeof globalThis) | Element = window;
      if (useWindow === false) {
        scrollEl = getParentElement(scrollComponent.current);
      }

      scrollEl.removeEventListener(
        "scroll",
        scrollListener,
        options ? options : useCapture
      );
      scrollEl.removeEventListener(
        "resize",
        scrollListener,
        options ? options : useCapture
      );
    }

    function calculateOffset(el: HTMLElement, scrollTop: number) {
      if (!el) {
        return 0;
      }

      return (
        calculateTopPosition(el) +
        (el.offsetHeight - scrollTop - window.innerHeight)
      );
    }

    function calculateTopPosition(el: HTMLElement): number {
      if (!el) {
        return 0;
      }
      return (
        el.offsetTop + calculateTopPosition(el.offsetParent as HTMLElement)
      );
    }

    function attachScrollListener() {
      const parentElement = getParentElement(scrollComponent.current);

      if (!hasMore || !parentElement) {
        return;
      }

      let scrollEl: (Window & typeof globalThis) | Element = window;
      if (useWindow === false) {
        scrollEl = parentElement;
      }

      scrollEl.addEventListener(
        "mousewheel",
        mousewheelListener,
        options ? options : useCapture
      );
      scrollEl.addEventListener(
        "scroll",
        scrollListener,
        options ? options : useCapture
      );
      scrollEl.addEventListener(
        "resize",
        scrollListener,
        options ? options : useCapture
      );

      if (initialLoad) {
        scrollListener();
      }
    }
  }
);

export default InfiniteScroll;
