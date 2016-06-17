import React from 'react';
import ReactDOM from 'react-dom';

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

export default class InfiniteScroll extends React.Component {
 
  componentDidMount() {
    this.pageLoaded = this.props.pageStart;
    this.attachScrollListener();
  }
  componentDidUpdate() {
    this.attachScrollListener();
  }
  render() {
    var props = this.props;
    return React.DOM.div(null, props.children, props.hasMore && (props.loader || this._defaultLoader));
  }
  scrollListener() {
    var el = ReactDOM.findDOMNode(this);
    var scrollEl = window;

    var offset;
    if(his.props.useWindow == true) {
      var scrollTop = (scrollEl.pageYOffset !== undefined) ? scrollEl.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      offset = topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight;
    } else {
      offset = el.offsetHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
    }

    if (offset < Number(this.props.threshold)) {
      this.detachScrollListener();
      // call loadMore after detachScrollListener to allow
      // for non-async loadMore functions
      this.props.loadMore(this.pageLoaded += 1);
    }
  }
  attachScrollListener() {
    if (!this.props.hasMore) {
      return;
    }

    var scrollEl = window;
    if(this.props.useWindow == false) {
      scrollEl = ReactDOM.findDOMNode(this).parentNode;
    }

    scrollEl.addEventListener('scroll', this.scrollListener.bind(this));
    scrollEl.addEventListener('resize', this.scrollListener.bind(this));
    this.scrollListener();
  }
  detachScrollListener() {
    var scrollEl = window;
    if(this.props.useWindow == false) {
      scrollEl = ReactDOM.findDOMNode(this).parentNode;
    }

    scrollEl.removeEventListener('scroll', this.scrollListener.bind(this));
    scrollEl.removeEventListener('resize', this.scrollListener.bind(this));
  }
  componentWillUnmount() {
    this.detachScrollListener();
  }
  setDefaultLoader(loader) {
    this._defaultLoader = loader;
  }
}
InfiniteScroll.PropTypes = {
  pageStart: React.PropTypes.number,
  hasMore: React.PropTypes.bool,
  loadMore: React.PropTypes.func.isRequired,
  threshold: React.PropTypes.number,
  useWindow: React.PropTypes.bool
}
InfiniteScroll.defaultProps = {
  pageStart: 0,
  hasMore: false,
  loadMore: function () {},
  threshold: 250,
  useWindow: true
};
