import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

export default class InfiniteScroll extends Component {
  static propTypes = {
    element: PropTypes.string,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    initialLoad: PropTypes.bool,
    isReverse: PropTypes.bool,
    loadMore: PropTypes.func.isRequired,
    pageStart: PropTypes.number,
    threshold: PropTypes.number,
    useCapture: PropTypes.bool,
    useWindow: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]).isRequired,
    loader: PropTypes.object,
  };

  static defaultProps = {
    element: 'div',
    hasMore: false,
    isLoading: false,
    initialLoad: true,
    pageStart: 0,
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
    if (!this.props.hasMore || this.props.isLoading) {
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
      isLoading,
      initialLoad,
      isReverse,
      loader,
      loadMore,
      pageStart,
      threshold,
      useCapture,
      useWindow,
      ...props
    } = this.props;

    props.ref = (node) => {
      this.scrollComponent = node;
    };

    if (isReverse) {
      return React.createElement(
          element,
          props,
          isLoading && (loader || this.defaultLoader),
          children,
      );
    }

    return React.createElement(
        element,
        props,
        children,
        isLoading && (loader || this.defaultLoader),
    );
  }
}
