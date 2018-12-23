import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class InfiniteScroll extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    element: PropTypes.node,
    hasMore: PropTypes.bool,
    initialLoad: PropTypes.bool,
    isReverse: PropTypes.bool,
    loader: PropTypes.node,
    loadMore: PropTypes.func.isRequired,
    pageStart: PropTypes.number,
    ref: PropTypes.func,
    getScrollParent: PropTypes.func,
    threshold: PropTypes.number,
    useCapture: PropTypes.bool,
    useWindow: PropTypes.bool,
  };

  static defaultProps = {
    element: 'div',
    hasMore: false,
    initialLoad: true,
    pageStart: 0,
    ref: null,
    threshold: 250,
    useWindow: true,
    isReverse: false,
    useCapture: false,
    loader: null,
    getScrollParent: null,
  };

  constructor(props) {
    super(props);

    this.scrollListener = this.scrollListener.bind(this);
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

  // Set a defaut loader for all your `InfiniteScroll` components
  setDefaultLoader(loader) {
    this.defaultLoader = loader;
  }

  detachMousewheelListener() {
    let scrollEl = window;
    if (this.props.useWindow === false) {
      scrollEl = this.scrollComponent.parentNode;
    }

    scrollEl.removeEventListener(
      'mousewheel',
      this.mousewheelListener,
      this.props.useCapture,
    );
  }

  detachScrollListener() {
    let scrollEl = window;
    if (this.props.useWindow === false) {
      scrollEl = this.getParentElement(this.scrollComponent);
    }

    scrollEl.removeEventListener(
      'scroll',
      this.scrollListener,
      this.props.useCapture,
    );
    scrollEl.removeEventListener(
      'resize',
      this.scrollListener,
      this.props.useCapture,
    );
  }

  getParentElement(el) {
    const scrollParent =
      this.props.getScrollParent && this.props.getScrollParent();
    if (scrollParent != null) {
      return scrollParent;
    }
    return el && el.parentNode;
  }

  filterProps(props) {
    return props;
  }

  attachScrollListener() {
    const parentElement = this.getParentElement(this.scrollComponent);

    if (!this.props.hasMore || !parentElement) {
      return;
    }

    const supportsPassive = this.supportsPassive();

    const options = supportsPassive
      ? { capture: this.props.useCapture, passive: true }
      : this.props.useCapture;

    let scrollEl = window;
    if (this.props.useWindow === false) {
      scrollEl = parentElement;
    }

    scrollEl.addEventListener('mousewheel', this.mousewheelListener, options);
    scrollEl.addEventListener('scroll', this.scrollListener, options);
    scrollEl.addEventListener('resize', this.scrollListener, options);

    if (this.props.initialLoad) {
      this.scrollListener();
    }
  }

  supportsPassive() {
    let supportsPassive = false;

    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
        },
      });

      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
    } catch (e) {
      /* intentionally empty */
    }

    return supportsPassive;
  }

  mousewheelListener(e) {
    // Prevents Chrome hangups
    // See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
    if (e.deltaY === 1) {
      e.preventDefault();
    }
  }

  scrollListener() {
    const el = this.scrollComponent;
    const scrollEl = window;
    const parentNode = this.getParentElement(el);

    let offset;
    if (this.props.useWindow) {
      const doc =
        document.documentElement || document.body.parentNode || document.body;
      const scrollTop =
        scrollEl.pageYOffset !== undefined
          ? scrollEl.pageYOffset
          : doc.scrollTop;
      if (this.props.isReverse) {
        offset = scrollTop;
      } else {
        offset = this.calculateOffset(el, scrollTop);
      }
    } else if (this.props.isReverse) {
      offset = parentNode.scrollTop;
    } else {
      offset = el.scrollHeight - parentNode.scrollTop - parentNode.clientHeight;
    }

    // Here we make sure the element is visible as well as checking the offset
    if (
      offset < Number(this.props.threshold) &&
      (el && el.offsetParent !== null)
    ) {
      this.detachScrollListener();
      // Call loadMore after detachScrollListener to allow for non-async loadMore functions
      if (typeof this.props.loadMore === 'function') {
        this.props.loadMore((this.pageLoaded += 1));
      }
    }
  }

  calculateOffset(el, scrollTop) {
    if (!el) {
      return 0;
    }

    return (
      this.calculateTopPosition(el) +
      (el.offsetHeight - scrollTop - window.innerHeight)
    );
  }

  calculateTopPosition(el) {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }

  render() {
    const renderProps = this.filterProps(this.props);
    const {
      children,
      element,
      hasMore,
      initialLoad,
      isReverse,
      loader,
      loadMore,
      pageStart,
      ref,
      threshold,
      useCapture,
      useWindow,
      getScrollParent,
      ...props
    } = renderProps;

    props.ref = node => {
      this.scrollComponent = node;
      if (ref) {
        ref(node);
      }
    };

    const childrenArray = [children];
    if (hasMore) {
      if (loader) {
        isReverse ? childrenArray.unshift(loader) : childrenArray.push(loader);
      } else if (this.defaultLoader) {
        isReverse
          ? childrenArray.unshift(this.defaultLoader)
          : childrenArray.push(this.defaultLoader);
      }
    }
    return React.createElement(element, props, childrenArray);
  }
}
