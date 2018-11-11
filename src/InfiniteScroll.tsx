import * as React from "react";

export type DirectionOption = "down" | "up";

export interface InfiniteScrollProps {
  // Default: 'div'
  // Container component or HTML tag that the component should render as.
  container: string;
  // Default: 'down'
  // Which direction the user needs to scroll to load more items. `up` or `down`.
  direction: DirectionOption;
  // Default: false
  // Whether there are more items to be loaded. Scroll event listeners are removed if `false`.
  hasMore: boolean;
  // Default: true
  // Whether the component should load the first set of items on mount.
  initialLoad: boolean;
  // A component to show whilst loading items.
  loader: any | (() => any);
  // Default: 'ISLoader'
  // In case the default key of the loader conflicts with your app.
  loaderKey: any;
  // Default: 0
  // The number of the first page to load, With the default of `0`, the first page is `1`.
  pageStart: number;
  ref?: any;
  // Default: 250
  // The distance in pixels before the end of the items that will trigger a call to `loadMore`.
  threshold: number;
  // Default: false
  // The `useCapture` option of the scroll event listeners.
  useCapture: boolean;
  // Default: true
  // Add scroll listeners to the window instead of the container.
  useWindow: boolean;
  // Return a custom element to calculate the scroll position from. Expects a DOM node.
  getScrollParent?: () => any;
  // A callback when more items are requested by the user.
  loadMore?: (pageToload: number) => void;
}

export default class InfiniteScroll extends React.Component<
  InfiniteScrollProps
> {
  // TODO: This should be removed and the default loader should be set via composition (e.g. sending it via props)
  private defaultLoader: null | (() => React.ReactNode) | React.ReactNode;
  private pageLoaded: number;
  private _container: any;

  static defaultProps = {
    container: "div",
    direction: "down",
    hasMore: false,
    initialLoad: true,
    loader: null,
    loaderKey: "ISLoader",
    pageStart: 0,
    threshold: 250,
    useCapture: false,
    useWindow: true
  };

  constructor(props: InfiniteScrollProps) {
    super(props);

    this.scrollListener = this.scrollListener.bind(this);
    this.defaultLoader = null;
  }

  // Set a default loader for all of your InfiniteScroll components.
  public setDefaultLoader(
    loader: (() => React.ReactNode) | React.ReactNode | null
  ) {
    this.defaultLoader = loader;
  }

  componentDidMount() {
    this.pageLoaded = this.props.pageStart;
    this.attachScrollListener();
  }

  componentDidUpdate() {
    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.detachScrollListener();
    this.detachMousewheelListener();
  }

  private getScrollableElement() {
    return this.props.useWindow === false ? this._container : window;
  }

  private getParentElement() {
    const { getScrollParent } = this.props;

    // The parent element can be overriden to make
    // calculations based on a different element.
    if (getScrollParent != null) {
      return getScrollParent();
    }

    return this.props.useWindow === false ? this._container.parentNode : window;
  }

  private detachMousewheelListener() {
    const { useCapture } = this.props;

    const scrollEl = this.getParentElement();
    if (scrollEl == null) {
      return;
    }
    scrollEl.removeEventListener(
      "mousewheel",
      this.mousewheelListener,
      useCapture
    );
  }

  private detachScrollListener() {
    const { useCapture } = this.props;

    const scrollEl = this.getParentElement();
    scrollEl.removeEventListener("scroll", this.scrollListener, useCapture);
    scrollEl.removeEventListener("resize", this.scrollListener, useCapture);
  }

  // TODO: attachScrollListener should be private (for minifier) but test is written so it attaches directly to this method
  public attachScrollListener() {
    const { hasMore, initialLoad, useCapture } = this.props;

    // Don't attach event listeners if we have no more items to load.
    if (!hasMore) {
      return;
    }

    const scrollEl = this.getParentElement();
    scrollEl.addEventListener(
      "mousewheel",
      this.mousewheelListener,
      useCapture
    );
    scrollEl.addEventListener("scroll", this.scrollListener, useCapture);
    scrollEl.addEventListener("resize", this.scrollListener, useCapture);

    if (initialLoad) {
      this.scrollListener();
    }
  }

  private mousewheelListener(e: any) {
    // Prevents Chrome hangups.
    // See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
    if (e.deltaY === 1) {
      e.preventDefault();
    }
  }

  scrollListener() {
    const { direction, loadMore, threshold, useWindow } = this.props;

    const container = this.getScrollableElement();
    const parent = this.getParentElement();
    const isReverse = this.isReverse(direction);

    let offset;
    if (useWindow) {
      const doc: any =
        document.documentElement || document.body.parentNode || document.body;
      const scrollTop =
        container.pageYOffset !== undefined
          ? container.pageYOffset
          : doc.scrollTop;
      if (isReverse) {
        offset = scrollTop;
      } else {
        offset = this.calculateOffset(container, scrollTop);
      }
    } else if (isReverse) {
      offset = parent.scrollTop;
    } else {
      offset = container.scrollHeight - parent.scrollTop - parent.clientHeight;
    }

    // Here we make sure the element is visible as well as checking the offset.
    if (
      offset < Number(threshold) &&
      (container && container.offsetParent !== null)
    ) {
      this.detachScrollListener();
      // Call loadMore after detachScrollListener to
      // allow for non-async loadMore functions.
      if (loadMore != null) {
        loadMore((this.pageLoaded += 1));
      }
    }
  }

  calculateOffset(el: any, scrollTop: any) {
    if (!el) {
      return 0;
    }

    return (
      this.calculateTopPosition(this._container) +
      (this._container.offsetHeight - scrollTop - window.innerHeight)
    );
  }

  calculateTopPosition(el: any): any {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }

  isReverse(direction: DirectionOption) {
    return direction === "up";
  }

  render() {
    const {
      children,
      container: Container,
      direction,
      hasMore,
      initialLoad,
      loader,
      loaderKey,
      loadMore,
      pageStart,
      ref,
      threshold,
      useCapture,
      useWindow,
      ...props
    } = this.props;

    const containerRef = (node: any) => {
      this._container = node;
      if (ref) {
        ref(node);
      }
    };

    const items = [children];
    const isReverse = this.isReverse(direction);
    const Loader = loader || this.defaultLoader;

    return (
      <Container ref={containerRef} {...props}>
        {loader && hasMore && isReverse && <Loader key={loaderKey} />}
        {items}
        {loader && hasMore && !isReverse && <Loader key={loaderKey} />}
      </Container>
    );
  }
}
