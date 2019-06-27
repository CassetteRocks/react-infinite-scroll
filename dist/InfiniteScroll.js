'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var InfiniteScroll = (function(_Component) {
  _inherits(InfiniteScroll, _Component);

  function InfiniteScroll(props) {
    _classCallCheck(this, InfiniteScroll);

    var _this = _possibleConstructorReturn(
      this,
      (InfiniteScroll.__proto__ || Object.getPrototypeOf(InfiniteScroll)).call(
        this,
        props
      )
    );

    _this.scrollListener = _this.scrollListener.bind(_this);
    _this.eventListenerOptions = _this.eventListenerOptions.bind(_this);
    _this.mousewheelListener = _this.mousewheelListener.bind(_this);
    return _this;
  }

  _createClass(InfiniteScroll, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.pageLoaded = this.props.pageStart;
        this.options = this.eventListenerOptions();
        this.attachScrollListener();
      }
    },
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        if (this.props.isReverse && this.loadMore) {
          var parentElement = this.getParentElement(this.scrollComponent);
          if (this.props.momentumScrollQuirks) {
            parentElement.style['-webkit-overflow-scrolling'] = 'auto';
          }
          parentElement.scrollTop =
            parentElement.scrollHeight -
            this.beforeScrollHeight +
            this.beforeScrollTop;
          if (this.props.momentumScrollQuirks) {
            parentElement.style['-webkit-overflow-scrolling'] = 'touch';
          }
          this.loadMore = false;
        }
        this.attachScrollListener();
      }
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.detachScrollListener();
        this.detachMousewheelListener();
      }
    },
    {
      key: 'isPassiveSupported',
      value: function isPassiveSupported() {
        var passive = false;

        var testOptions = {
          get passive() {
            passive = true;
          }
        };

        try {
          document.addEventListener('test', null, testOptions);
          document.removeEventListener('test', null, testOptions);
        } catch (e) {
          // ignore
        }
        return passive;
      }
    },
    {
      key: 'eventListenerOptions',
      value: function eventListenerOptions() {
        var options = this.props.useCapture;

        if (this.isPassiveSupported()) {
          options = {
            useCapture: this.props.useCapture,
            passive: true
          };
        }
        return options;
      }

      // Set a defaut loader for all your `InfiniteScroll` components
    },
    {
      key: 'setDefaultLoader',
      value: function setDefaultLoader(loader) {
        this.defaultLoader = loader;
      }
    },
    {
      key: 'detachMousewheelListener',
      value: function detachMousewheelListener() {
        var scrollEl = window;
        if (this.props.useWindow === false) {
          scrollEl = this.scrollComponent.parentNode;
        }

        scrollEl.removeEventListener(
          'mousewheel',
          this.mousewheelListener,
          this.options ? this.options : this.props.useCapture
        );
      }
    },
    {
      key: 'detachScrollListener',
      value: function detachScrollListener() {
        var scrollEl = window;
        if (this.props.useWindow === false) {
          scrollEl = this.getParentElement(this.scrollComponent);
        }

        scrollEl.removeEventListener(
          'scroll',
          this.scrollListener,
          this.options ? this.options : this.props.useCapture
        );
        scrollEl.removeEventListener(
          'resize',
          this.scrollListener,
          this.options ? this.options : this.props.useCapture
        );
      }
    },
    {
      key: 'getParentElement',
      value: function getParentElement(el) {
        var scrollParent =
          this.props.getScrollParent && this.props.getScrollParent();
        if (scrollParent != null) {
          return scrollParent;
        }
        return el && el.parentNode;
      }
    },
    {
      key: 'filterProps',
      value: function filterProps(props) {
        return props;
      }
    },
    {
      key: 'attachScrollListener',
      value: function attachScrollListener() {
        var parentElement = this.getParentElement(this.scrollComponent);

        if (!this.props.hasMore || !parentElement) {
          return;
        }

        var scrollEl = window;
        if (this.props.useWindow === false) {
          scrollEl = parentElement;
        }

        scrollEl.addEventListener(
          'mousewheel',
          this.mousewheelListener,
          this.options ? this.options : this.props.useCapture
        );
        scrollEl.addEventListener(
          'scroll',
          this.scrollListener,
          this.options ? this.options : this.props.useCapture
        );
        scrollEl.addEventListener(
          'resize',
          this.scrollListener,
          this.options ? this.options : this.props.useCapture
        );

        if (this.props.initialLoad) {
          this.scrollListener();
        }
      }
    },
    {
      key: 'mousewheelListener',
      value: function mousewheelListener(e) {
        // Prevents Chrome hangups
        // See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
        if (e.deltaY === 1 && !this.isPassiveSupported()) {
          e.preventDefault();
        }
      }
    },
    {
      key: 'scrollListener',
      value: function scrollListener() {
        var el = this.scrollComponent;
        var scrollEl = window;
        var parentNode = this.getParentElement(el);

        var offset = void 0;
        if (this.props.useWindow) {
          var doc =
            document.documentElement ||
            document.body.parentNode ||
            document.body;
          var scrollTop =
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
          offset =
            el.scrollHeight - parentNode.scrollTop - parentNode.clientHeight;
        }

        // Here we make sure the element is visible as well as checking the offset
        if (
          offset < Number(this.props.threshold) &&
          el &&
          el.offsetParent !== null
        ) {
          this.detachScrollListener();
          this.beforeScrollHeight = parentNode.scrollHeight;
          this.beforeScrollTop = parentNode.scrollTop;
          // Call loadMore after detachScrollListener to allow for non-async loadMore functions
          if (typeof this.props.loadMore === 'function') {
            this.props.loadMore((this.pageLoaded += 1));
            this.loadMore = true;
          }
        }
      }
    },
    {
      key: 'calculateOffset',
      value: function calculateOffset(el, scrollTop) {
        if (!el) {
          return 0;
        }

        return (
          this.calculateTopPosition(el) +
          (el.offsetHeight - scrollTop - window.innerHeight)
        );
      }
    },
    {
      key: 'calculateTopPosition',
      value: function calculateTopPosition(el) {
        if (!el) {
          return 0;
        }
        return el.offsetTop + this.calculateTopPosition(el.offsetParent);
      }
    },
    {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var renderProps = this.filterProps(this.props);

        var children = renderProps.children,
          element = renderProps.element,
          hasMore = renderProps.hasMore,
          initialLoad = renderProps.initialLoad,
          isReverse = renderProps.isReverse,
          loader = renderProps.loader,
          loadMore = renderProps.loadMore,
          pageStart = renderProps.pageStart,
          ref = renderProps.ref,
          threshold = renderProps.threshold,
          useCapture = renderProps.useCapture,
          useWindow = renderProps.useWindow,
          getScrollParent = renderProps.getScrollParent,
          momentumScrollQuirks = renderProps.momentumScrollQuirks,
          props = _objectWithoutProperties(renderProps, [
            'children',
            'element',
            'hasMore',
            'initialLoad',
            'isReverse',
            'loader',
            'loadMore',
            'pageStart',
            'ref',
            'threshold',
            'useCapture',
            'useWindow',
            'getScrollParent',
            'momentumScrollQuirks'
          ]);

        props.ref = function(node) {
          _this2.scrollComponent = node;
          if (ref) {
            ref(node);
          }
        };

        var childrenArray = [children];
        if (hasMore) {
          if (loader) {
            isReverse
              ? childrenArray.unshift(loader)
              : childrenArray.push(loader);
          } else if (this.defaultLoader) {
            isReverse
              ? childrenArray.unshift(this.defaultLoader)
              : childrenArray.push(this.defaultLoader);
          }
        }
        return _react2.default.createElement(element, props, childrenArray);
      }
    }
  ]);

  return InfiniteScroll;
})(_react.Component);

InfiniteScroll.propTypes = {
  children: _propTypes2.default.node.isRequired,
  element: _propTypes2.default.node,
  hasMore: _propTypes2.default.bool,
  initialLoad: _propTypes2.default.bool,
  isReverse: _propTypes2.default.bool,
  loader: _propTypes2.default.node,
  loadMore: _propTypes2.default.func.isRequired,
  pageStart: _propTypes2.default.number,
  ref: _propTypes2.default.func,
  getScrollParent: _propTypes2.default.func,
  threshold: _propTypes2.default.number,
  useCapture: _propTypes2.default.bool,
  useWindow: _propTypes2.default.bool,
  momentumScrollQuirks: _propTypes2.default.bool
};
InfiniteScroll.defaultProps = {
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
  momentumScrollQuirks: false
};
exports.default = InfiniteScroll;
module.exports = exports['default'];
