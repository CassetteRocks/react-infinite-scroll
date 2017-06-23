'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InviewSensor = function (_React$Component) {
  _inherits(InviewSensor, _React$Component);

  function InviewSensor(props) {
    _classCallCheck(this, InviewSensor);

    var _this = _possibleConstructorReturn(this, (InviewSensor.__proto__ || Object.getPrototypeOf(InviewSensor)).call(this, props));

    _this.state = {
      isVisible: null,
      visibilityRect: {}
    };
    _this.check = _.debounce(_this.check.bind(_this), 100);
    return _this;
  }

  _createClass(InviewSensor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.context.infiniteScrollComponent.scrollWindow.addEventListener('scroll', this.check);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.context.infiniteScrollComponent.scrollWindow.removeEventListener('scroll', this.check);
    }
  }, {
    key: 'check',
    value: function check() {
      var el = _reactDom2.default.findDOMNode(this);
      var rect = el.getBoundingClientRect();
      var containmentRect = this.context.infiniteScrollComponent.scrollWindow.getBoundingClientRect();

      var visibilityRect = {
        top: rect.top >= containmentRect.top,
        left: rect.left >= containmentRect.left,
        bottom: rect.bottom <= containmentRect.bottom,
        right: rect.right <= containmentRect.right
      };

      var fullVisible = visibilityRect.top && visibilityRect.left && visibilityRect.bottom && visibilityRect.right;

      var partialVertical = rect.top >= containmentRect.top && rect.top <= containmentRect.bottom || rect.bottom >= containmentRect.top && rect.bottom <= containmentRect.bottom || rect.top <= containmentRect.top && rect.bottom >= containmentRect.bottom;

      var partialHorizontal = rect.left >= containmentRect.left && rect.left <= containmentRect.right || rect.right >= containmentRect.left && rect.right <= containmentRect.right;

      var partialVisible = partialVertical && partialHorizontal;

      var isVisible = false;

      // if element is fully visible, why care about partial visibility??
      if (fullVisible !== true && this.props.partialVisibility) {
        // so, if partial visibility is observed
        // if we have minimum top visibility set by props, lets check, if it meets the passed value
        // so if for instance element is at least 200px in viewport, then show it.
        if (this.props.partialVisibility && this.props.minTopValue && partialVisible) {
          isVisible = rect.top <= containmentRect.bottom - this.props.minTopValue;
        } else {
          // minTopValue was not passed, just give partial Result.
          isVisible = partialVisible;
        }
      } else {
        // Partial visibility is not required, just return fullVisibility value
        isVisible = fullVisible;
      }

      // notify the parent when the value changes
      if (this.state.isVisible !== isVisible) {
        this.setState({
          isVisible: isVisible,
          visibilityRect: visibilityRect
        });
        this.props.onChange(isVisible, visibilityRect);
      }

      return this.state;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.Children.only(this.props.children);
    }
  }]);

  return InviewSensor;
}(_react2.default.Component);

InviewSensor.propTypes = {
  onChange: _react2.default.PropTypes.func.isRequired,
  active: _react2.default.PropTypes.bool,
  partialVisibility: _react2.default.PropTypes.bool,
  delay: _react2.default.PropTypes.number,
  delayedCall: _react2.default.PropTypes.bool,
  children: _react2.default.PropTypes.element,
  minTopValue: _react2.default.PropTypes.number
};
InviewSensor.contextTypes = {
  infiniteScrollComponent: _react2.default.PropTypes.object
};
InviewSensor.defaultProps = {
  active: true,
  partialVisibility: false,
  minTopValue: false,
  children: _react2.default.createElement('span')
};
exports.default = InviewSensor;
module.exports = exports['default'];
