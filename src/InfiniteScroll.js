import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

export default class InfiniteScroll extends Component {
  static propTypes = {
    children: PropTypes
      .oneOfType([PropTypes.object, PropTypes.array])
      .isRequired,
    element: PropTypes.string,
    className: PropTypes.string,
    hasMore: PropTypes.bool,
    initialLoad: PropTypes.bool,
    isReverse: PropTypes.bool,
    loader: PropTypes.object,
    loadMore: PropTypes.func.isRequired,
    pageStart: PropTypes.number,
    ref: PropTypes.func,
    threshold: PropTypes.number,
    useCapture: PropTypes.bool,
    useWindow: PropTypes.bool,
  };

  static defaultProps = {
    element: 'div',
    className: 'InfiniteScroll',
    hasMore: false,
    initialLoad: true,
    pageStart: 0,
    ref: null,
    threshold: 250,
    useWindow: true,
    isReverse: false,
    useCapture: false,
    loader: null,
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
  }

  // Set a defaut loader for all your `InfiniteScroll` components
  setDefaultLoader(loader) {
    this.defaultLoader = loader;
  }

  detachScrollListener() {
    let scrollEl = window;
    if (this.props.useWindow === false) {
      scrollEl = this.scrollComponent.parentNode;
    }

    scrollEl.removeEventListener('scroll', this.scrollListener, this.props.useCapture);
    scrollEl.removeEventListener('resize', this.scrollListener, this.props.useCapture);
  }

  attachScrollListener() {
    if (!this.props.hasMore) {
      return;
    }

    let scrollEl = window;
    if (this.props.useWindow === false) {
      scrollEl = this.scrollComponent.parentNode;
    }

    scrollEl.addEventListener('scroll', this.scrollListener, this.props.useCapture);
    scrollEl.addEventListener('resize', this.scrollListener, this.props.useCapture);

    if (this.props.initialLoad) {
      this.scrollListener();
    }
  }

  scrollListener() {
    const el = this.scrollComponent;
    const scrollEl = window;

    let offset;
    if (this.props.useWindow) {
      const scrollTop = (scrollEl.pageYOffset !== undefined) ?
       scrollEl.pageYOffset :
       (document.documentElement || document.body.parentNode || document.body).scrollTop;
      if (this.props.isReverse) {
        offset = scrollTop;
      } else {
        offset = this.calculateTopPosition(el) +
                     (el.offsetHeight -
                     scrollTop -
                     window.innerHeight);
      }
    } else if (this.props.isReverse) {
      offset = el.parentNode.scrollTop;
    } else {
      offset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
    }

    if (offset < Number(this.props.threshold)) {
      this.detachScrollListener();
      // Call loadMore after detachScrollListener to allow for non-async loadMore functions
      if (typeof this.props.loadMore === 'function') {
        this.props.loadMore(this.pageLoaded += 1);
      }
    }
  }

  calculateTopPosition(el) {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }

  render() {
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
      ...props
    } = this.props;

    props.ref = (node) => {
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
        isReverse ?
          childrenArray.unshift(this.defaultLoader) :
          childrenArray.push(this.defaultLoader);
      }
    }
    return React.createElement(
        element,
        props,
        ...childrenArray,
    );
  }
}
